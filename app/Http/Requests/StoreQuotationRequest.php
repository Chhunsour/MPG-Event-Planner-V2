<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuotationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation (normalization and sanitization).
     */
    protected function prepareForValidation(): void
    {
        // Map alternative/frontend input keys if supplied
        $phone = trim($this->input('phone') ?? '');
        $email = strtolower(trim($this->input('email') ?? ''));

        // Email is optional in the public form. Keep the existing database
        // contract by creating a clearly marked, non-deliverable placeholder
        // when the customer gives only a phone/Telegram number.
        if ($email === '' && $phone !== '') {
            $digits = preg_replace('/\D+/', '', $phone) ?: '000000';
            $email = 'no-email-'.substr($digits, -8).'@phone-only.invalid';
        }

        $this->merge([
            'customer_name' => trim($this->input('customer_name') ?? $this->input('name') ?? ''),
            'company_name' => trim($this->input('company_name') ?? $this->input('company') ?? ''),
            'phone' => $phone,
            'email' => $email,
            'preferred_contact_method' => $this->input('preferred_contact_method') ?? $this->input('contact_method') ?? 'telegram',
            'event_type' => $this->input('event_type') ?? 'other',
            'event_date' => $this->input('event_date') ?? null,
            'event_location' => trim($this->input('event_location') ?? '') ?: 'To be confirmed',
            'estimated_guests' => $this->input('estimated_guests') ?? $this->input('guests') ?? 'not_specified',
            'estimated_budget' => $this->input('estimated_budget') ?? $this->input('budget') ?? 'not_specified',
            'required_services' => $this->input('required_services') ?? $this->input('services') ?? [],
            'additional_information' => trim($this->input('additional_information') ?? $this->input('additional_info') ?? ''),
            'language' => $this->input('language') ?? 'en',
            'consent' => filter_var($this->input('consent'), FILTER_VALIDATE_BOOLEAN) || $this->input('consent') === 'on' || $this->input('consent') === '1',
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            // Format validation only. The `dns` rule was rejecting every
            // phone-only enquiry: those are submitted with a synthetic
            // `@phone-only.invalid` address (RFC 2606) which by definition has
            // no MX record, so genuine leads were being turned away. It also
            // made every submission wait on a DNS lookup, and failed whenever
            // that lookup was slow or blocked.
            'email' => ['required', 'email:rfc', 'max:255'],
            'preferred_contact_method' => ['required', 'string', 'max:50'],
            'event_type' => ['required', 'string', 'max:100'],
            'event_date' => ['nullable', 'date'],
            'event_location' => ['required', 'string', 'max:255'],
            'estimated_guests' => ['required', 'string', 'max:100'],
            'estimated_budget' => ['required', 'string', 'max:100'],
            'required_services' => ['nullable', 'array'],
            'required_services.*' => ['string'],
            'additional_information' => ['nullable', 'string', 'max:2000'],
            'language' => ['nullable', 'string', 'max:10'],
            'consent' => ['accepted'],
            // Honeypot field: must be empty or missing
            'website_url' => ['nullable', 'max:0'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'website_url.max' => 'Spam submission detected.',
            'consent.accepted' => 'You must consent to submit this quotation request.',
            'email.email' => 'Please enter a valid email address.',
            'event_date.date' => 'Please provide a valid event date.',
        ];
    }
}
