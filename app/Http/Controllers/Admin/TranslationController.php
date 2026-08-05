<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Project;
use App\Models\Service;
use App\Services\GoogleCloudTranslation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TranslationController extends Controller
{
    private const FIELDS = [
        'title', 'short_description', 'description', 'features', 'seo_title', 'seo_description',
        'excerpt', 'body', 'image_alt', 'cover_image_alt', 'social_image_alt',
    ];

    public function store(Request $request, GoogleCloudTranslation $translator): JsonResponse
    {
        $data = $request->validate([
            'entity' => ['required', 'in:project,service,blog'],
            'entity_id' => ['nullable', 'integer', 'min:1'],
            'field' => ['required', 'in:'.implode(',', [...self::FIELDS, 'all'])],
            'value' => ['nullable', 'string', 'max:50000'],
            'values' => ['nullable', 'array', 'max:24'],
            'values.*' => ['nullable', 'string', 'max:500'],
            'fields' => ['nullable', 'array', 'max:'.count(self::FIELDS)],
            'protected_terms' => ['nullable', 'array', 'max:80'],
            'protected_terms.*' => ['string', 'max:160'],
        ]);

        foreach ($data['fields'] ?? [] as $field => $value) {
            if (! in_array($field, self::FIELDS, true)) {
                throw ValidationException::withMessages(["fields.{$field}" => 'Unsupported translation field.']);
            }

            // Laravel's ConvertEmptyStringsToNull middleware turns blank
            // optional fields into null. The editor sends those fields when
            // translating everything, so ignore them instead of rejecting a
            // valid partial payload.
            if ($value === null) {
                unset($data['fields'][$field]);

                continue;
            }

            if (is_array($value)) {
                if ($field !== 'features') {
                    throw ValidationException::withMessages(["fields.{$field}" => 'This field must be text.']);
                }
                foreach ($value as $item) {
                    if ($item !== null && (! is_string($item) || mb_strlen($item) > 500)) {
                        throw ValidationException::withMessages(["fields.{$field}" => 'Invalid values.']);
                    }
                }
                $data['fields'][$field] = array_values(array_filter(
                    $value,
                    static fn ($item): bool => is_string($item) && trim($item) !== '',
                ));
            } elseif ($field === 'features' || ! is_string($value) || mb_strlen($value) > 50000) {
                throw ValidationException::withMessages(["fields.{$field}" => 'Invalid value.']);
            }
        }

        $model = null;
        if (! empty($data['entity_id'])) {
            $model = $data['entity'] === 'project'
                ? Project::query()->with(['features'])->findOrFail($data['entity_id'])
                : ($data['entity'] === 'service'
                    ? Service::query()->with(['capabilities'])->findOrFail($data['entity_id'])
                    : BlogPost::query()->findOrFail($data['entity_id']));
        }

        $fields = $this->payloadFields($data);
        $protectedTerms = array_values(array_filter(array_unique(array_merge(
            $data['protected_terms'] ?? [],
            [$model?->title_en, $model?->client_name, $model?->location],
        ))));
        $translations = [];
        $errors = [];

        foreach (['km', 'zh-CN'] as $target) {
            foreach ($fields as $field => $value) {
                try {
                    $format = in_array($field, ['description', 'body'], true) ? 'html' : 'text';
                    $translations[$field][$target] = $translator->translate(
                        $value,
                        $target,
                        $format,
                        $protectedTerms,
                    );
                } catch (\Throwable $exception) {
                    report($exception);
                    Log::error('Admin content translation failed.', [
                        'entity' => $data['entity'], 'entity_id' => $model?->id,
                        'field' => $field, 'target' => $target, 'message' => $exception->getMessage(),
                    ]);
                    $errors[] = ['field' => $field, 'target' => $target, 'message' => 'Translation failed. You can retry this field.'];
                }
            }
        }

        if ($translations === [] && $errors !== []) {
            return response()->json(['message' => 'No translations were completed.', 'errors' => $errors], 503);
        }

        return response()->json([
            'data' => $translations,
            'errors' => $errors,
            'message' => $errors === [] ? 'Translations ready.' : 'Some translations could not be completed.',
        ], $errors === [] ? 200 : 207);
    }

    /** @return array<string, string|array<int, string>> */
    private function payloadFields(array $data): array
    {
        if ($data['field'] !== 'all') {
            $value = $data['field'] === 'features'
                ? array_values(array_filter(
                    $data['values'] ?? [],
                    static fn ($item): bool => is_string($item) && trim($item) !== '',
                ))
                : ($data['value'] ?? '');

            if ($data['field'] !== 'features' && trim((string) $value) === '') {
                return [];
            }

            return [$data['field'] => $value];
        }

        $fields = [];
        foreach (self::FIELDS as $field) {
            if (! array_key_exists($field, $data['fields'] ?? [])) {
                continue;
            }
            $value = $data['fields'][$field];
            if ($value === null || (is_string($value) && trim($value) === '') || ($field === 'features' && $value === [])) {
                continue;
            }
            $fields[$field] = $value;
        }

        return $fields;
    }
}
