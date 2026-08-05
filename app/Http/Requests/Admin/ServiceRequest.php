<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\SanitizesRichText;
use App\Http\Requests\Admin\Concerns\PreparesContentEditor;
use App\Support\ImageStorage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    use PreparesContentEditor, SanitizesRichText;

    public function authorize(): bool
    {
        return (bool) $this->user()?->isAdmin();
    }

    /** @return list<string> */
    protected function richTextFields(): array
    {
        return ['description'];
    }

    protected function prepareForValidation(): void
    {
        // Slugs are stable identifiers used in public URLs, so derive one from
        // the English title only when the admin has not set it themselves.
        $slug = $this->input('slug') ?: $this->input('title_en');
        $service = $this->route('service');
        $publishing = $this->publishingValues($service?->published_at);
        $title = $this->input('title_en');
        $summary = $this->input('short_description_en');

        $this->merge([
            'slug' => $slug ? Str::slug($slug) : null,
            'is_featured' => $this->boolean('is_featured'),
            'is_published' => $publishing['is_published'],
            'published_at' => $publishing['published_at'],
            'author_name' => $this->editorAuthor(),
            'tags' => $this->editorTags((string) $title, (string) $summary, (string) $this->input('description_en')),
            'seo_title_en' => $this->generated('seo_title_en', $title),
            'seo_title_km' => $this->generated('seo_title_km', $this->input('title_km')),
            'seo_title_zh' => $this->generated('seo_title_zh', $this->input('title_zh')),
            'seo_description_en' => $this->generated('seo_description_en', $summary),
            'seo_description_km' => $this->generated('seo_description_km', $this->input('short_description_km')),
            'seo_description_zh' => $this->generated('seo_description_zh', $this->input('short_description_zh')),
            'image_alt_en' => $this->generated('image_alt_en', $title),
            'image_alt_km' => $this->generated('image_alt_km', $this->input('title_km')),
            'image_alt_zh' => $this->generated('image_alt_zh', $this->input('title_zh')),
            'social_image_alt_en' => $this->generated('social_image_alt_en', $title),
            'social_image_alt_km' => $this->generated('social_image_alt_km', $this->input('title_km')),
            'social_image_alt_zh' => $this->generated('social_image_alt_zh', $this->input('title_zh')),
        ]);

        $this->sanitizeRichText();
    }

    public function rules(): array
    {
        $serviceId = $this->route('service')?->id;

        return [
            'slug' => [
                'required', 'string', 'max:160', 'alpha_dash',
                Rule::unique('services', 'slug')->ignore($serviceId)->whereNull('deleted_at'),
            ],
            'category' => ['nullable', 'string', 'max:120'],

            // English is the fallback for every other locale, so it is the only
            // required language.
            'title_en' => ['required', 'string', 'max:255'],
            'title_km' => ['nullable', 'string', 'max:255'],
            'title_zh' => ['nullable', 'string', 'max:255'],

            'short_description_en' => ['nullable', 'string', 'max:500'],
            'short_description_km' => ['nullable', 'string', 'max:500'],
            'short_description_zh' => ['nullable', 'string', 'max:500'],

            'description_en' => ['nullable', 'string', 'max:5000'],
            'description_km' => ['nullable', 'string', 'max:5000'],
            'description_zh' => ['nullable', 'string', 'max:5000'],

            'image_alt_en' => ['nullable', 'string', 'max:255'],
            'image_alt_km' => ['nullable', 'string', 'max:255'],
            'image_alt_zh' => ['nullable', 'string', 'max:255'],
            'social_image' => array_merge(['nullable'], ImageStorage::RULES),
            'remove_social_image' => ['nullable', 'boolean'],
            'social_image_alt_en' => ['nullable', 'string', 'max:255'],
            'social_image_alt_km' => ['nullable', 'string', 'max:255'],
            'social_image_alt_zh' => ['nullable', 'string', 'max:255'],
            'seo_title_en' => ['nullable', 'string', 'max:255'],
            'seo_title_km' => ['nullable', 'string', 'max:255'],
            'seo_title_zh' => ['nullable', 'string', 'max:255'],
            'seo_description_en' => ['nullable', 'string', 'max:500'],
            'seo_description_km' => ['nullable', 'string', 'max:500'],
            'seo_description_zh' => ['nullable', 'string', 'max:500'],

            'image' => array_merge(['nullable'], ImageStorage::RULES),
            'remove_image' => ['nullable', 'boolean'],

            'display_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'publish_intent' => ['nullable', 'boolean'],
            'publish_action' => ['nullable', 'in:draft,publish,schedule'],
            'published_at' => ['nullable', 'date', Rule::when($this->input('publish_action') === 'schedule', ['required', 'after:now'])],
            'author_name' => ['nullable', 'string', 'max:100'],
            'tags' => ['nullable', 'array', 'max:24'],
            'tags.*' => ['nullable', 'string', 'max:60'],
            'tags_text' => ['nullable', 'string', 'max:1600'],

            'capabilities' => ['nullable', 'array', 'max:24'],
            'capabilities.*.label_en' => ['nullable', 'string', 'max:160'],
            'capabilities.*.label_km' => ['nullable', 'string', 'max:160'],
            'capabilities.*.label_zh' => ['nullable', 'string', 'max:160'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title_en' => 'English title',
            'slug' => 'URL slug',
        ];
    }
}
