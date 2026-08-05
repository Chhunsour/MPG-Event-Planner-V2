<?php

namespace App\Models;

use App\Support\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceCapability extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'service_id',
        'label_en', 'label_km', 'label_zh',
        'display_order',
    ];

    protected function casts(): array
    {
        return ['display_order' => 'integer'];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
