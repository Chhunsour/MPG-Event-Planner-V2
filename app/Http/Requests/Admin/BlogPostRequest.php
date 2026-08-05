<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\SanitizesRichText;
use App\Http\Requests\Admin\Concerns\PreparesContentEditor;
use App\Support\ImageStorage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogPostRequest extends FormRequest
{
    use PreparesContentEditor, SanitizesRichText;

    public function authorize(): bool
    {
        return (bool) $this->user()?->isAdmin();
    }

    /** @return list<string> */
    protected function richTextFields(): array
    {
        return ['body'];
    }

    protected function prepareForValidation(): void
    {
        $slug = $this->input('slug') ?: $this->input('title_en');
        $post = $this->route('blog_post') ?? $this->route('blog');
        $publishing = $this->publishingValues($post?->published_at);
        $title = $this->input('title_en');
        $excerpt = $this->input('excerpt_en');

        $this->merge([
            'slug' => $slug ? Str::slug($slug) : null,
            'tags' => $this->editorTags((string) $title, (string) $excerpt, (string) $this->input('body_en')),
            'author_name' => $this->editorAuthor(),
            'is_published' => $publishing['is_published'],
            'published_at' => $publishing['published_at'],
            'seo_title_en' => $this->generated('seo_title_en', $title),
            'seo_title_km' => $this->generated('seo_title_km', $this->input('title_km')),
            'seo_title_zh' => $this->generated('seo_title_zh', $this->input('title_zh')),
            'seo_description_en' => $this->generated('seo_description_en', $excerpt),
            'seo_description_km' => $this->generated('seo_description_km', $this->input('excerpt_km')),
            'seo_description_zh' => $this->generated('seo_description_zh', $this->input('excerpt_zh')),
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
        $postId = $this->route('blog_post')?->id ?? $this->route('blog')?->id;

        return [
            'slug' => [
                'required', 'string', 'max:160', 'alpha_dash',
                Rule::unique('blog_posts', 'slug')->ignore($postId)->whereNull('deleted_at'),
            ],
            'category' => ['nullable', 'string', 'max:120'],
            'tags' => ['nullable', 'array', 'max:24'],
            'tags.*' => ['nullable', 'string', 'max:60'],
            'tags_text' => ['nullable', 'string', 'max:1600'],

            'title_en' => ['required', 'string', 'max:255'],
            'title_km' => ['nullable', 'string', 'max:255'],
            'title_zh' => ['nullable', 'string', 'max:255'],

            'excerpt_en' => ['nullable', 'string', 'max:500'],
            'excerpt_km' => ['nullable', 'string', 'max:500'],
            'excerpt_zh' => ['nullable', 'string', 'max:500'],

            'body_en' => ['nullable', 'string', 'max:50000'],
            'body_km' => ['nullable', 'string', 'max:50000'],
            'body_zh' => ['nullable', 'string', 'max:50000'],

            'cover_image_alt_en' => ['nullable', 'string', 'max:255'],
            'cover_image_alt_km' => ['nullable', 'string', 'max:255'],
            'cover_image_alt_zh' => ['nullable', 'string', 'max:255'],

            'meta_description_en' => ['nullable', 'string', 'max:320'],
            'meta_description_km' => ['nullable', 'string', 'max:320'],
            'meta_description_zh' => ['nullable', 'string', 'max:320'],
            'seo_title_en' => ['nullable', 'string', 'max:255'],
            'seo_title_km' => ['nullable', 'string', 'max:255'],
            'seo_title_zh' => ['nullable', 'string', 'max:255'],
            'seo_description_en' => ['nullable', 'string', 'max:500'],
            'seo_description_km' => ['nullable', 'string', 'max:500'],
            'seo_description_zh' => ['nullable', 'string', 'max:500'],

            'cover_image' => array_merge(['nullable'], ImageStorage::RULES),
            'remove_cover_image' => ['nullable', 'boolean'],
            'social_image' => array_merge(['nullable'], ImageStorage::RULES),
            'remove_social_image' => ['nullable', 'boolean'],
            'social_image_alt_en' => ['nullable', 'string', 'max:255'],
            'social_image_alt_km' => ['nullable', 'string', 'max:255'],
            'social_image_alt_zh' => ['nullable', 'string', 'max:255'],

            'author_name' => ['nullable', 'string', 'max:100'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['boolean'],
            'publish_intent' => ['nullable', 'boolean'],
            'publish_action' => ['nullable', 'in:draft,publish,schedule'],
            'published_at' => ['nullable', 'date', Rule::when($this->input('publish_action') === 'schedule', ['required', 'after:now'])],
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
