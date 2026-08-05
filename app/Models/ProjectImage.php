<?php

namespace App\Models;

use App\Support\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectImage extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'project_id',
        'path',
        'alt_en', 'alt_km', 'alt_zh',
        'width',
        'height',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'width' => 'integer',
            'height' => 'integer',
            'display_order' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** Falls back to the project title — never to the filename. */
    public function alt(?string $locale = null): string
    {
        return $this->translate('alt', $locale)
            ?: ($this->project?->translate('title', $locale) ?? '');
    }
}
