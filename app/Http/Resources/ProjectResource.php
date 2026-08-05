<?php

namespace App\Http\Resources;

use App\Support\HtmlSanitizer;
use App\Support\ImageStorage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'short_description' => $this->translate('short_description', $locale)
                ?: strip_tags((string) $this->translate('description', $locale)),
            // Rendered as HTML by the frontend, so re-filtered on the way out —
            // rows written before write-time sanitization existed are not clean.
            'description' => app(HtmlSanitizer::class)->clean($this->translate('description', $locale)),
            'seo_title' => $this->translate('seo_title', $locale) ?: $this->translate('title', $locale),
            'seo_description' => $this->translate('seo_description', $locale)
                ?: $this->translate('short_description', $locale),

            // Nullable by design: MPG frequently cannot name a client, and an
            // absent value must stay absent rather than become a placeholder.
            'client_name' => $this->client_name,
            'event_type' => $this->event_type,
            'location' => $this->location,
            'event_date' => $this->event_date?->toDateString(),
            'year' => $this->year,

            'cover_image' => $images->url($this->cover_image),
            'cover_image_alt' => $this->coverImageAlt($locale),
            'social_image' => $images->url($this->social_image) ?: $images->url($this->cover_image),
            'social_image_alt' => $this->translate('social_image_alt', $locale)
                ?: $this->coverImageAlt($locale),

            'is_featured' => $this->is_featured,
            'display_order' => $this->display_order,
            'tags' => $this->tags ?? [],
            'author_name' => $this->author_name,
            'published_at' => $this->published_at?->toAtomString(),

            'service' => $this->whenLoaded('service', fn () => $this->service ? [
                'slug' => $this->service->slug,
                'title' => $this->service->translate('title', $locale),
            ] : null),
            'technologies' => $this->technologies ?? [],

            'gallery' => $this->whenLoaded(
                'images',
                fn () => $this->images->map(fn ($image) => [
                    'id' => $image->id,
                    'url' => $images->url($image->path),
                    'alt' => $image->alt($locale),
                    'width' => $image->width,
                    'height' => $image->height,
                ])->values()
            ),

            'features' => $this->whenLoaded(
                'features',
                fn () => $this->features
                    ->map(fn ($feature) => $feature->translate('label', $locale))
                    ->filter()
                    ->values()
            ),

            'updated_at' => $this->updated_at?->toAtomString(),
        ];
    }
}
