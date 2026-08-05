<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationRequest extends Model
{
    use HasFactory;

    protected $table = 'quotation_requests';

    protected $fillable = [
        'customer_name',
        'company_name',
        'phone',
        'email',
        'preferred_contact_method',
        'event_type',
        'event_date',
        'event_location',
        'estimated_guests',
        'estimated_budget',
        'required_services',
        'additional_information',
        'language',
        'status',
        'is_read',
        'internal_notes',
        'status_changed_at',
        'resolved_at',
        'ip_address',
        'user_agent',
    ];

    /** Pipeline the sales team moves a request through. */
    public const STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'rejected'];

    protected function casts(): array
    {
        return [
            'required_services' => 'array',
            'event_date' => 'date:Y-m-d',
            'status_changed_at' => 'datetime',
            'is_read' => 'boolean',
            'resolved_at' => 'datetime',
        ];
    }

    public function getReferenceAttribute(): string
    {
        return 'MPG-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }
}
