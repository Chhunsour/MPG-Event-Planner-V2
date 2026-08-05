<?php

namespace App\Http\Resources;

use App\Support\HtmlSanitizer;
use App\Support\ImageStorage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public shape of a service.
 *
 * Every translated field is resolved server-side for the requested locale with
 * an English fallback, so the Next.js frontend never has to know the fallback
 * rule or handle a null heading.
 */
class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = $request->attributes->get('locale', 'en');
        $images = app(ImageStorage::class);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'category' => $this->category,
            'title' => $this->translate('title', $locale),
            'short_description' => $this->translate('short_description', $locale),
            // Rendered as HTML by the frontend, so re-filtered on the way out —
            // rows written before write-time sanitization existed are not clean.
            'description' => app(HtmlSanitizer::class)->clean($this->translate('description', $locale)),
            'seo_title' => $this->translate('seo_title', $locale) ?: $this->translate('title', $locale),
            'seo_description' => $this->translate('seo_description', $locale)
                ?: $this->translate('short_description', $locale),
            'image' => $images->url($this->image),
            'image_alt' => $this->imageAlt($locale),
            'social_image' => $images->url($this->social_image) ?: $images->url($this->image),
            'social_image_alt' => $this->translate('social_image_alt', $locale)
                ?: $this->imageAlt($locale),
            'is_featured' => $this->is_featured,
            'display_order' => $this->display_order,
            'tags' => $this->tags ?? [],
            'author_name' => $this->author_name,
            'published_at' => $this->published_at?->toAtomString(),
            'capabilities' => $this->whenLoaded(
                'capabilities',
                fn () => $this->capabilities
                    ->map(fn ($capability) => $capability->translate('label', $locale))
                    ->filter()
                    ->values()
            ),
            'updated_at' => $this->updated_at?->toAtomString(),
        ];
    }
}
