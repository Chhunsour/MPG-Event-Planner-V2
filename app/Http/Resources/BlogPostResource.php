<?php

namespace App\Http\Resources;

use App\Support\HtmlSanitizer;
use App\Support\ImageStorage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public shape of a blog post.
 *
 * Every translated field is resolved server-side for the requested locale with
 * an English fallback.
 */
class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = $request->attributes->get('locale', 'en');
        $images = app(ImageStorage::class);

        // `body` is the only field the frontend renders as HTML. It is already
        // sanitized on write, but rows saved before that existed are not, so
        // the allow-list is applied again here rather than trusting the column.
        $html = app(HtmlSanitizer::class);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->translate('title', $locale),
            'excerpt' => $this->translate('excerpt', $locale),
            'body' => $html->clean($this->translate('body', $locale)),
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'cover_image' => $images->url($this->cover_image),
            'cover_image_alt' => $this->coverImageAlt($locale),
            'seo_title' => $this->translate('seo_title', $locale) ?: $this->translate('title', $locale),
            'seo_description' => $this->translate('seo_description', $locale)
                ?: $this->translate('excerpt', $locale),
            'meta_description' => $this->translate('seo_description', $locale)
                ?: $this->translate('meta_description', $locale),
            'social_image' => $images->url($this->social_image) ?: $images->url($this->cover_image),
            'social_image_alt' => $this->translate('social_image_alt', $locale)
                ?: $this->coverImageAlt($locale),
            'author_name' => $this->author_name,
            'published_at' => $this->published_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),
        ];
    }
}
