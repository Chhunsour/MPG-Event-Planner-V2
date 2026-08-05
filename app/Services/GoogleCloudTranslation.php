<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Small REST client for Cloud Translation Advanced (v3).
 *
 * Credentials stay in Laravel's environment. The browser only sees the
 * translated result. HTML is sent as text/html so the API preserves the
 * editor's allow-listed markup.
 */
class GoogleCloudTranslation
{
    private const TARGETS = ['km', 'zh-CN'];

    /** @param string|array<int, string> $source */
    public function translate(string|array $source, string $target, string $format, array $protectedTerms = []): string|array
    {
        if (! in_array($target, self::TARGETS, true)) {
            throw new RuntimeException('Unsupported translation target.');
        }

        $values = is_array($source) ? array_values($source) : [$source];
        $results = array_fill(0, count($values), null);
        $pending = [];

        foreach ($values as $index => $value) {
            $value = (string) ($value ?? '');
            if (trim($value) === '') {
                $results[$index] = '';

                continue;
            }

            $key = $this->cacheKey($value, $target, $format, $protectedTerms);
            $cached = DB::table('translation_cache')->where('cache_key', $key)->value('translated_text');
            if ($cached !== null) {
                $results[$index] = $cached;

                continue;
            }

            [$masked, $replacements] = $this->protect($value, $protectedTerms);
            $pending[] = compact('index', 'value', 'key', 'masked', 'replacements');
        }

        foreach (array_chunk($pending, 128) as $chunk) {
            $translations = $this->request(array_column($chunk, 'masked'), $target, $format);
            foreach ($chunk as $offset => $item) {
                $translated = $this->restore($translations[$offset] ?? '', $item['replacements']);
                DB::table('translation_cache')->updateOrInsert(
                    ['cache_key' => $item['key']],
                    [
                        'target_locale' => $target,
                        'format' => $format,
                        'source_text' => $item['value'],
                        'translated_text' => $translated,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ],
                );
                $results[$item['index']] = $translated;
            }
        }

        return is_array($source) ? $results : ($results[0] ?? '');
    }

    /** @param array<int, string> $protectedTerms */
    private function cacheKey(string $source, string $target, string $format, array $protectedTerms): string
    {
        sort($protectedTerms);

        return hash('sha256', implode("\n", [$source, $target, $format, implode('|', $protectedTerms)]));
    }

    /** @return array{0: string, 1: array<string, string>} */
    private function protect(string $source, array $protectedTerms): array
    {
        $terms = array_filter(array_unique(array_merge(
            config('services.google_translation.protected_terms', []),
            $protectedTerms,
        )));

        $patterns = [
            '~https?://[^\s<>"\']+~iu',
            '~[\w.+-]+@[\w.-]+\.[a-z]{2,}~iu',
            '~(?<![\pL\pN])[+#]?\d[\d\s().,%:/+\-]*(?![\pL\pN])~u',
        ];
        foreach ($terms as $term) {
            $patterns[] = '~'.preg_quote((string) $term, '~').'~iu';
        }

        $replacements = [];
        $counter = 0;
        foreach ($patterns as $pattern) {
            $source = preg_replace_callback($pattern, function (array $match) use (&$replacements, &$counter): string {
                $token = '__PROTECTED_TOKEN_'.str_repeat('A', $counter++ + 1).'__';
                $replacements[$token] = $match[0];

                return $token;
            }, $source) ?? $source;
        }

        return [$source, $replacements];
    }

    private function restore(string $translated, array $replacements): string
    {
        foreach ($replacements as $token => $original) {
            $translated = str_ireplace([$token, str_replace('_', ' ', trim($token, '_'))], $original, $translated);
        }

        return $translated;
    }

    /** @param array<int, string> $contents @return array<int, string> */
    private function request(array $contents, string $target, string $format): array
    {
        $token = $this->accessToken();
        $project = config('services.google_translation.project_id');
        if (! $project) {
            throw new RuntimeException('GOOGLE_CLOUD_PROJECT_ID is not configured.');
        }

        $response = Http::withToken($token)
            // User ADC credentials require the quota project to be explicit
            // on REST requests, even when gcloud has stored it in ADC.
            ->withHeaders(['x-goog-user-project' => $project])
            ->timeout((int) config('services.google_translation.timeout', 20))
            ->retry(2, 250, throw: false)
            ->post("https://translation.googleapis.com/v3/projects/{$project}/locations/global:translateText", [
                'sourceLanguageCode' => 'en',
                'targetLanguageCode' => $target,
                'mimeType' => $format === 'html' ? 'text/html' : 'text/plain',
                'contents' => $contents,
            ]);

        if ($response->failed()) {
            Log::error('Google Cloud Translation request failed.', [
                'status' => $response->status(), 'target' => $target, 'format' => $format,
                'response' => $response->json('error.message'),
            ]);
            throw new RuntimeException('Google Cloud Translation could not complete the request.');
        }

        $translations = collect($response->json('translations', []))
            ->map(fn (array $translation) => (string) ($translation['translatedText'] ?? ''))
            ->all();

        if (count($translations) !== count($contents)) {
            Log::error('Google Cloud Translation returned an unexpected number of translations.', [
                'expected' => count($contents), 'received' => count($translations),
                'target' => $target, 'format' => $format,
            ]);
            throw new RuntimeException('Google Cloud Translation returned an incomplete response.');
        }

        return $translations;
    }

    private function accessToken(): string
    {
        $source = $this->credentialSource();
        $cacheKey = 'google-cloud-translation-access-token-'.hash('sha256', $source['cache_key']);

        return Cache::remember($cacheKey, now()->addMinutes(45), fn (): string => $this->tokenFor($source));
    }

    /** @return array{type: string, cache_key: string, credentials?: array<string, mixed>, access_token?: string} */
    private function credentialSource(): array
    {
        // On Cloud Run, GCE, GKE and App Engine the metadata server represents
        // the attached service account and avoids key files entirely.
        try {
            $response = Http::withHeaders(['Metadata-Flavor' => 'Google'])
                ->connectTimeout(1)->timeout(1)
                ->get('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token');
            if ($response->successful() && is_string($response->json('access_token'))) {
                return [
                    'type' => 'metadata',
                    'cache_key' => 'metadata',
                    'access_token' => $response->json('access_token'),
                ];
            }
        } catch (\Throwable) {
            // Local development normally has a file-based ADC instead.
        }

        $paths = array_filter([
            config('services.google_translation.credentials_path'),
            $this->wellKnownAdcPath(),
        ]);
        foreach ($paths as $path) {
            if (! is_string($path) || ! is_file($path) || ! is_readable($path)) {
                continue;
            }
            $credentials = $this->decodeCredentials((string) file_get_contents($path));

            return [
                'type' => 'file',
                'cache_key' => 'file:'.realpath($path).':'.((string) @filemtime($path)),
                'credentials' => $credentials,
            ];
        }

        $json = config('services.google_translation.credentials_json');
        if (is_string($json) && trim($json) !== '') {
            $credentials = $this->decodeCredentials($json);

            return [
                'type' => 'json',
                'cache_key' => 'json:'.hash('sha256', implode('|', [
                    (string) ($credentials['type'] ?? ''),
                    (string) ($credentials['client_email'] ?? $credentials['client_id'] ?? ''),
                ])),
                'credentials' => $credentials,
            ];
        }

        throw new RuntimeException('Google Cloud Translation credentials are not configured.');
    }

    private function wellKnownAdcPath(): ?string
    {
        $home = getenv('HOME') ?: ($_SERVER['HOME'] ?? null);

        return $home ? $home.'/.config/gcloud/application_default_credentials.json' : null;
    }

    /** @return array<string, mixed> */
    private function decodeCredentials(string $json): array
    {
        $credentials = json_decode($json, true);
        if (! is_array($credentials)) {
            throw new RuntimeException('Google Cloud credentials are invalid JSON.');
        }

        if (isset($credentials['private_key']) && is_string($credentials['private_key'])) {
            // Handles hosting platforms that double-escape JSON environment
            // variables after json_decode has already run once.
            $credentials['private_key'] = str_replace(
                ['\\r\\n', '\\n', '\\r'],
                ["\n", "\n", "\r"],
                $credentials['private_key'],
            );
        }

        return $credentials;
    }

    /** @param array{type: string, cache_key: string, credentials?: array<string, mixed>, access_token?: string} $source */
    private function tokenFor(array $source): string
    {
        if ($source['type'] === 'metadata' && ! empty($source['access_token'])) {
            return (string) $source['access_token'];
        }

        $credentials = $source['credentials'] ?? [];
        if (($credentials['type'] ?? null) === 'authorized_user') {
            $response = Http::asForm()->timeout(15)->post('https://oauth2.googleapis.com/token', [
                'client_id' => $credentials['client_id'] ?? null,
                'client_secret' => $credentials['client_secret'] ?? null,
                'refresh_token' => $credentials['refresh_token'] ?? null,
                'grant_type' => 'refresh_token',
            ]);

            return $this->tokenFromResponse($response);
        }

        if (empty($credentials['client_email']) || empty($credentials['private_key'])) {
            throw new RuntimeException('Google Cloud credentials are invalid.');
        }

        $now = time();
        $tokenUri = $credentials['token_uri'] ?? 'https://oauth2.googleapis.com/token';
        $header = $this->base64Url(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
        $claims = $this->base64Url(json_encode([
            'iss' => $credentials['client_email'],
            'scope' => 'https://www.googleapis.com/auth/cloud-platform',
            'aud' => $tokenUri,
            'iat' => $now,
            'exp' => $now + 3600,
        ]));
        $unsigned = $header.'.'.$claims;
        if (! openssl_sign($unsigned, $signature, $credentials['private_key'], OPENSSL_ALGO_SHA256)) {
            throw new RuntimeException('Could not sign Google Cloud credentials.');
        }

        $response = Http::asForm()->timeout(15)->post($tokenUri, [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $unsigned.'.'.$this->base64Url($signature),
        ]);

        return $this->tokenFromResponse($response);
    }

    private function tokenFromResponse(Response $response): string
    {
        if ($response->failed() || ! is_string($response->json('access_token'))) {
            Log::error('Google Cloud Translation token request failed.', ['status' => $response->status()]);
            throw new RuntimeException('Google Cloud Translation authentication failed.');
        }

        return $response->json('access_token');
    }

    private function base64Url(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
