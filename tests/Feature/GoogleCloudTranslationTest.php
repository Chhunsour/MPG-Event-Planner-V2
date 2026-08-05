<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\BlogPost;
use App\Services\GoogleCloudTranslation;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class GoogleCloudTranslationTest extends TestCase
{
    use RefreshDatabase;

    private ?string $originalHome = null;

    private ?string $originalServerHome = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->originalHome = getenv('HOME') ?: null;
        $this->originalServerHome = $_SERVER['HOME'] ?? null;
        putenv('HOME='.sys_get_temp_dir().'/google-cloud-translation-test-home');
        $_SERVER['HOME'] = sys_get_temp_dir().'/google-cloud-translation-test-home';
        $this->withoutMiddleware(PreventRequestForgery::class);

        config()->set('services.google_translation.project_id', 'test-project');
        config()->set('services.google_translation.credentials_path', null);
        config()->set('services.google_translation.credentials_json', json_encode([
            'type' => 'service_account',
            'client_email' => 'translator@test-project.iam.gserviceaccount.com',
            'private_key' => $this->privateKey(),
            'token_uri' => 'https://oauth2.googleapis.com/token',
        ]));
    }

    protected function tearDown(): void
    {
        if ($this->originalHome === null) {
            putenv('HOME');
        } else {
            putenv('HOME='.$this->originalHome);
        }

        if ($this->originalServerHome === null) {
            unset($_SERVER['HOME']);
        } else {
            $_SERVER['HOME'] = $this->originalServerHome;
        }

        parent::tearDown();
    }

    public function test_plain_and_rich_html_translation_use_the_expected_mime_types_and_protect_terms(): void
    {
        $this->fakeGoogleApi();
        $translator = app(GoogleCloudTranslation::class);

        $plain = $translator->translate('Entrance arch & backdrop — MPG Event Planner', 'km', 'text', []);
        $html = $translator->translate('<p><strong>Entrance arch</strong> for MPG Event Planner</p>', 'zh-CN', 'html', []);

        $this->assertStringContainsString('MPG Event Planner', $plain);
        $this->assertSame('<p><strong>Entrance arch</strong> for MPG Event Planner</p>', $html);

        $requests = collect(Http::recorded())
            ->map(fn (array $recorded) => $recorded[0])
            ->filter(fn (Request $request) => str_contains($request->url(), 'translateText'));

        $this->assertCount(2, $requests);
        $this->assertSame('text/plain', $requests->first()->data()['mimeType']);
        $this->assertSame('text/html', $requests->last()->data()['mimeType']);
        $this->assertStringNotContainsString('MPG Event Planner', $requests->first()->data()['contents'][0]);
    }

    public function test_cached_translation_does_not_call_google_twice(): void
    {
        $this->fakeGoogleApi();
        $translator = app(GoogleCloudTranslation::class);

        $first = $translator->translate('A cached phrase', 'km', 'text', []);
        $second = $translator->translate('A cached phrase', 'km', 'text', []);

        $this->assertSame($first, $second);
        $translationRequests = collect(Http::recorded())
            ->map(fn (array $recorded) => $recorded[0])
            ->filter(fn (Request $request) => str_contains($request->url(), 'translateText'));
        $this->assertCount(1, $translationRequests);
    }

    public function test_credentials_missing_is_reported_without_a_google_request(): void
    {
        config()->set('services.google_translation.credentials_json', null);
        Http::fake();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('credentials are not configured');

        app(GoogleCloudTranslation::class)->translate('Missing credentials', 'km', 'text');
    }

    public function test_google_api_failure_is_reported_without_leaking_response_data(): void
    {
        Http::fake([
            'http://metadata.google.internal/*' => Http::response([], 404),
            'https://oauth2.googleapis.com/token' => Http::response(['access_token' => 'test-token'], 200),
            'https://translation.googleapis.com/v3/*' => Http::response([
                'error' => ['message' => 'permission denied'],
            ], 403),
        ]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('could not complete the request');

        app(GoogleCloudTranslation::class)->translate('API failure', 'km', 'text');
    }

    public function test_translation_endpoint_requires_an_authenticated_admin(): void
    {
        $response = $this->postJson('/admin/translations', [
            'entity' => 'service',
            'field' => 'title',
            'value' => 'Entrance arch',
        ]);

        $response->assertUnauthorized()->assertJson(['message' => 'Authentication is required for translation.']);
    }

    public function test_translation_endpoint_validates_payload(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $response = $this->postJson('/admin/translations', [
            'entity' => 'invalid',
            'field' => 'title',
            'value' => 'Entrance arch',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['entity']);
    }

    public function test_translation_endpoint_accepts_empty_optional_fields_from_translate_all(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $this->fakeGoogleApi();

        $response = $this->postJson('/admin/translations', [
            'entity' => 'service',
            'field' => 'all',
            'fields' => [
                'title' => 'Entrance arch & backdrop',
                'short_description' => null,
                'description' => null,
                'features' => [null, ''],
                'seo_title' => null,
                'seo_description' => null,
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title.km', 'Entrance arch & backdrop');
    }

    public function test_translation_endpoint_returns_partial_failure_results(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $this->fakeGoogleApi(partialFailure: true);

        $response = $this->postJson('/admin/translations', [
            'entity' => 'service',
            'field' => 'title',
            'value' => 'Entrance arch & backdrop',
        ]);

        $response->assertStatus(207)
            ->assertJsonPath('data.title.km', 'Entrance arch & backdrop')
            ->assertJsonCount(1, 'errors');
    }

    public function test_translation_endpoint_returns_json_when_google_fails_completely(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        Http::fake(function (Request $request) {
            if (str_contains($request->url(), 'metadata.google.internal')) {
                return Http::response([], 404);
            }

            if (str_contains($request->url(), 'oauth2.googleapis.com/token')) {
                return Http::response(['access_token' => 'test-token'], 200);
            }

            return Http::response(['error' => ['message' => 'simulated failure']], 503);
        });

        $response = $this->postJson('/admin/translations', [
            'entity' => 'service',
            'field' => 'title',
            'value' => 'Endpoint failure',
        ]);

        $response->assertStatus(503)
            ->assertJsonStructure(['message', 'errors']);
    }

    public function test_blog_translation_accepts_rich_body_html(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $post = BlogPost::create(['title_en' => 'Translation article', 'slug' => 'translation-article']);
        $this->fakeGoogleApi();

        $response = $this->postJson('/admin/translations', [
            'entity' => 'blog',
            'entity_id' => $post->id,
            'field' => 'body',
            'value' => '<p><strong>Entrance arch</strong> for MPG Event Planner</p>',
            'protected_terms' => ['MPG Event Planner'],
        ]);

        $response->assertOk()->assertJsonPath('data.body.km', '<p><strong>Entrance arch</strong> for MPG Event Planner</p>');
        $this->assertSame('text/html', collect(Http::recorded())
            ->map(fn (array $recorded) => $recorded[0])
            ->first(fn (Request $request) => str_contains($request->url(), 'translateText'))
            ->data()['mimeType']);
    }

    public function test_translate_all_includes_generated_seo_and_image_alt_text(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $this->fakeGoogleApi();

        $this->postJson('/admin/translations', [
            'entity' => 'project',
            'field' => 'all',
            'fields' => [
                'title' => 'Riverside launch',
                'short_description' => 'A concise project story.',
                'seo_title' => 'Riverside launch',
                'seo_description' => 'A concise project story.',
                'cover_image_alt' => 'Riverside launch',
                'social_image_alt' => 'Riverside launch',
            ],
        ])->assertOk()
            ->assertJsonPath('data.cover_image_alt.km', 'Riverside launch')
            ->assertJsonPath('data.social_image_alt.zh-CN', 'Riverside launch')
            ->assertJsonPath('data.seo_description.km', 'A concise project story.');
    }

    private function fakeGoogleApi(bool $partialFailure = false): void
    {
        Http::fake(function (Request $request) use ($partialFailure) {
            if (str_contains($request->url(), 'metadata.google.internal')) {
                return Http::response([], 404);
            }

            if (str_contains($request->url(), 'oauth2.googleapis.com/token')) {
                return Http::response(['access_token' => 'test-token'], 200);
            }

            if ($partialFailure && $request->data()['targetLanguageCode'] === 'zh-CN') {
                return Http::response(['error' => ['message' => 'simulated failure']], 503);
            }

            return Http::response([
                'translations' => collect($request->data()['contents'])
                    ->map(fn (string $content) => ['translatedText' => $content])
                    ->all(),
            ], 200);
        });
    }

    private function privateKey(): string
    {
        $key = openssl_pkey_new([
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
            'private_key_bits' => 2048,
        ]);
        $privateKey = '';
        openssl_pkey_export($key, $privateKey);

        return $privateKey;
    }
}
