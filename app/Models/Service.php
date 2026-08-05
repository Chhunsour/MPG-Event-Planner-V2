<?php

namespace App\Models;

use App\Support\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;

    protected $fillable = [
        'slug',
        'category',
        'title_en', 'title_km', 'title_zh',
        'short_description_en', 'short_description_km', 'short_description_zh',
        'description_en', 'description_km', 'description_zh',
        'image',
        'image_alt_en', 'image_alt_km', 'image_alt_zh',
        'seo_title_en', 'seo_title_km', 'seo_title_zh',
        'seo_description_en', 'seo_description_km', 'seo_description_zh',
        'social_image', 'social_image_alt_en', 'social_image_alt_km', 'social_image_alt_zh',
        'tags', 'author_name', 'published_at',
        'display_order',
        'is_featured',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'display_order' => 'integer',
            'published_at' => 'datetime',
            'tags' => 'array',
        ];
    }

    public function capabilities(): HasMany
    {
        return $this->hasMany(ServiceCapability::class)->orderBy('display_order');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->where(fn (Builder $query) => $query
                ->whereNull('published_at')
                ->orWhere('published_at', '<=', now()));
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('display_order')->orderBy('id');
    }

    /**
     * Alt text for the service image, falling back to the title so we never
     * emit a filename or an empty alt attribute.
     */
    public function imageAlt(?string $locale = null): ?string
    {
        if (! $this->image) {
            return null;
        }

        return $this->translate('image_alt', $locale) ?: $this->translate('title', $locale);
    }
}
