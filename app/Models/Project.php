<?php

namespace App\Models;

use App\Support\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;

    protected $fillable = [
        'slug',
        'category',
        'title_en', 'title_km', 'title_zh',
        'description_en', 'description_km', 'description_zh',
        'short_description_en', 'short_description_km', 'short_description_zh',
        'client_name',
        'event_type',
        'location',
        'event_date',
        'year',
        'cover_image',
        'cover_image_alt_en', 'cover_image_alt_km', 'cover_image_alt_zh',
        'seo_title_en', 'seo_title_km', 'seo_title_zh',
        'seo_description_en', 'seo_description_km', 'seo_description_zh',
        'social_image', 'social_image_alt_en', 'social_image_alt_km', 'social_image_alt_zh',
        'tags', 'author_name', 'published_at',
        'service_id',
        'technologies',
        'display_order',
        'is_featured',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
            'year' => 'integer',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'display_order' => 'integer',
            'technologies' => 'array',
            'published_at' => 'datetime',
            'tags' => 'array',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('display_order');
    }

    public function features(): HasMany
    {
        return $this->hasMany(ProjectFeature::class)->orderBy('display_order');
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

    public function coverImageAlt(?string $locale = null): ?string
    {
        if (! $this->cover_image) {
            return null;
        }

        return $this->translate('cover_image_alt', $locale)
            ?: $this->translate('title', $locale);
    }
}
