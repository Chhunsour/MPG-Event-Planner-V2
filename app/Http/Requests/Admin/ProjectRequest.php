<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\SanitizesRichText;
use App\Http\Requests\Admin\Concerns\PreparesContentEditor;
use App\Support\ImageStorage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
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
        $slug = $this->input('slug') ?: $this->input('title_en');
        $project = $this->route('project');
        $publishing = $this->publishingValues($project?->published_at);
        $title = $this->input('title_en');
        $summary = $this->input('short_description_en');

        $this->merge([
            'slug' => $slug ? Str::slug($slug) : null,
            'is_featured' => $this->boolean('is_featured'),
            'technologies' => collect(explode(',', (string) $this->input('technologies_text', '')))
                ->map(fn ($value) => trim($value))
                ->filter()
                ->unique()
                ->take(24)
                ->values()
                ->all(),
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
            'cover_image_alt_en' => $this->generated('cover_image_alt_en', $title),
            'cover_image_alt_km' => $this->generated('cover_image_alt_km', $this->input('title_km')),
            'cover_image_alt_zh' => $this->generated('cover_image_alt_zh', $this->input('title_zh')),
            'social_image_alt_en' => $this->generated('social_image_alt_en', $title),
            'social_image_alt_km' => $this->generated('social_image_alt_km', $this->input('title_km')),
            'social_image_alt_zh' => $this->generated('social_image_alt_zh', $this->input('title_zh')),
        ]);

        $this->sanitizeRichText();
    }

    public function rules(): array
    {
        $projectId = $this->route('project')?->id;

        return [
            'slug' => [
                'required', 'string', 'max:160', 'alpha_dash',
                Rule::unique('projects', 'slug')->ignore($projectId)->whereNull('deleted_at'),
            ],
            'category' => ['nullable', 'string', 'max:120'],

            'title_en' => ['required', 'string', 'max:255'],
            'title_km' => ['nullable', 'string', 'max:255'],
            'title_zh' => ['nullable', 'string', 'max:255'],

            'description_en' => ['nullable', 'string', 'max:5000'],
            'description_km' => ['nullable', 'string', 'max:5000'],
            'description_zh' => ['nullable', 'string', 'max:5000'],
            'short_description_en' => ['nullable', 'string', 'max:500'],
            'short_description_km' => ['nullable', 'string', 'max:500'],
            'short_description_zh' => ['nullable', 'string', 'max:500'],

            // Left blank whenever MPG cannot or should not publish the detail.
            'client_name' => ['nullable', 'string', 'max:255'],
            'event_type' => ['nullable', 'string', 'max:160'],
            'location' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2200'],

            'service_id' => ['nullable', 'integer', Rule::exists('services', 'id')->whereNull('deleted_at')],
            'technologies' => ['nullable', 'array', 'max:24'],
            'technologies.*' => ['nullable', 'string', 'max:80'],
            'technologies_text' => ['nullable', 'string', 'max:2000'],

            'cover_image' => array_merge(['nullable'], ImageStorage::RULES),
            'remove_cover_image' => ['nullable', 'boolean'],
            'cover_image_alt_en' => ['nullable', 'string', 'max:255'],
            'cover_image_alt_km' => ['nullable', 'string', 'max:255'],
            'cover_image_alt_zh' => ['nullable', 'string', 'max:255'],
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

            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ImageStorage::RULES,
            'gallery_order' => ['nullable', 'string', 'max:2000'],
            'gallery_removed' => ['nullable', 'array', 'max:20'],
            'gallery_removed.*' => ['integer'],

            'features' => ['nullable', 'array', 'max:24'],
            'features.*.label_en' => ['nullable', 'string', 'max:160'],
            'features.*.label_km' => ['nullable', 'string', 'max:160'],
            'features.*.label_zh' => ['nullable', 'string', 'max:160'],

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
        ];
    }

    public function attributes(): array
    {
        return [
            'title_en' => 'English title',
            'slug' => 'URL slug',
            'gallery.*' => 'gallery image',
        ];
    }
}
