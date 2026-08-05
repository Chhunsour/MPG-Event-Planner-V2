<?php

namespace App\Models;

use App\Support\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;

    protected $fillable = [
        'slug',
        'title_en', 'title_km', 'title_zh',
        'excerpt_en', 'excerpt_km', 'excerpt_zh',
        'body_en', 'body_km', 'body_zh',
        'category', 'tags',
        'cover_image',
        'cover_image_alt_en', 'cover_image_alt_km', 'cover_image_alt_zh',
        'meta_description_en', 'meta_description_km', 'meta_description_zh',
        'author_name',
        'display_order',
        'is_published',
        'published_at',
        'seo_title_en', 'seo_title_km', 'seo_title_zh',
        'seo_description_en', 'seo_description_km', 'seo_description_zh',
        'social_image', 'social_image_alt_en', 'social_image_alt_km', 'social_image_alt_zh',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'display_order' => 'integer',
            'published_at' => 'datetime',
            'tags' => 'array',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }

    /**
     * Alt text for the cover image, falling back to the title.
     */
    public function coverImageAlt(?string $locale = null): ?string
    {
        if (! $this->cover_image) {
            return null;
        }

        return $this->translate('cover_image_alt', $locale) ?: $this->translate('title', $locale);
    }
}
