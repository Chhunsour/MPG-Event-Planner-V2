<?php

namespace Tests\Feature;

use App\Models\QuotationRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class QuotationRequestTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful quotation submission.
     */
    public function test_successful_quotation_submission(): void
    {
        Mail::fake();

        $payload = [
            'customer_name' => 'Sopheap Seng',
            'company_name' => 'Angkor Enterprises',
            'phone' => '+855 12 345 678',
            'email' => 'sopheap@angkor.com.kh',
            'preferred_contact_method' => 'telegram',
            'event_type' => 'grand_opening',
            'event_date' => now()->addDays(14)->format('Y-m-d'),
            'event_location' => 'Phnom Penh, Cambodia',
            'estimated_guests' => '150 guests',
            'estimated_budget' => '$5,000 - $10,000',
            'required_services' => ['grand_opening', 'rental'],
            'additional_information' => 'Need LED stage backdrop.',
            'consent' => true,
            'website_url' => '',
        ];

        $response = $this->postJson('/api/quotation-requests', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Your quotation request has been submitted successfully.',
            ])
            ->assertJsonStructure(['success', 'message', 'reference']);

        $this->assertDatabaseHas('quotation_requests', [
            'customer_name' => 'Sopheap Seng',
            'email' => 'sopheap@angkor.com.kh',
            'event_type' => 'grand_opening',
        ]);
    }

    /**
     * Test required field validation.
     */
    public function test_required_fields_validation(): void
    {
        $response = $this->postJson('/api/quotation-requests', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['customer_name', 'phone', 'email']);
    }

    /**
     * A customer who only leaves a phone number must still get through.
     *
     * The frontend stands in a synthetic `@phone-only.invalid` address for
     * these. It has no MX record by design, so this asserts the email rule
     * stays format-only and never reintroduces a DNS lookup.
     */
    public function test_phone_only_submission_is_accepted(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/quotation-requests', [
            'customer_name' => 'Dara Kim',
            'phone' => '+855 99 888 777',
            'email' => 'no-email-99888777@phone-only.invalid',
            'preferred_contact_method' => 'telegram',
            'event_type' => 'grand_opening',
            'event_location' => 'Siem Reap',
            'estimated_guests' => 'not_specified',
            'estimated_budget' => 'not_specified',
            'required_services' => [],
            'language' => 'km',
            'consent' => true,
            'website_url' => '',
        ]);

        $response->assertStatus(201)->assertJson(['success' => true]);

        $this->assertDatabaseHas('quotation_requests', [
            'customer_name' => 'Dara Kim',
            'language' => 'km',
        ]);
    }

    /**
     * The public contact form only needs a name and a Telegram/phone number.
     * Email and venue details are collected later by the team.
     */
    public function test_minimal_telegram_submission_is_accepted_without_email(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/quotation-requests', [
            'customer_name' => 'Srey Mom',
            'phone' => '+855 10 222 333',
            'preferred_contact_method' => 'telegram',
            'consent' => true,
        ]);

        $response->assertStatus(201)->assertJson(['success' => true]);

        $this->assertDatabaseHas('quotation_requests', [
            'customer_name' => 'Srey Mom',
            'email' => 'no-email-10222333@phone-only.invalid',
            'event_type' => 'other',
            'event_location' => 'To be confirmed',
        ]);
    }

    /**
     * The language the enquiry was submitted in must be persisted, so the team
     * knows which language to reply in.
     */
    public function test_submission_language_is_persisted(): void
    {
        Mail::fake();

        $this->postJson('/api/quotation-requests', [
            'customer_name' => 'Li Wei',
            'phone' => '+855 77 111 222',
            'email' => 'liwei@example.com',
            'preferred_contact_method' => 'whatsapp',
            'event_type' => 'roadshow',
            'event_location' => 'Sihanoukville',
            'estimated_guests' => '300',
            'estimated_budget' => '10k_25k',
            'required_services' => ['stage', 'led'],
            'language' => 'zh',
            'consent' => true,
        ])->assertStatus(201);

        $this->assertDatabaseHas('quotation_requests', [
            'email' => 'liwei@example.com',
            'language' => 'zh',
        ]);
    }

    /**
     * Test invalid email validation.
     */
    public function test_invalid_email_rejection(): void
    {
        $payload = [
            'customer_name' => 'John Doe',
            'phone' => '+855 12 000 000',
            'email' => 'not-an-email',
            'preferred_contact_method' => 'phone',
            'event_type' => 'seminar',
            'event_location' => 'Phnom Penh',
            'estimated_guests' => '50',
            'estimated_budget' => 'under_5k',
            'consent' => true,
        ];

        $response = $this->postJson('/api/quotation-requests', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test invalid event date validation.
     */
    public function test_invalid_event_date_rejection(): void
    {
        $payload = [
            'customer_name' => 'John Doe',
            'phone' => '+855 12 000 000',
            'email' => 'john@example.com',
            'preferred_contact_method' => 'phone',
            'event_type' => 'seminar',
            'event_date' => 'invalid-date-string',
            'event_location' => 'Phnom Penh',
            'estimated_guests' => '50',
            'estimated_budget' => 'under_5k',
            'consent' => true,
        ];

        $response = $this->postJson('/api/quotation-requests', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['event_date']);
    }

    /**
     * Test honeypot rejection.
     */
    public function test_honeypot_spam_rejection(): void
    {
        $payload = [
            'customer_name' => 'Spam Bot',
            'phone' => '+1 800 0000',
            'email' => 'spambot@spam.com',
            'preferred_contact_method' => 'email',
            'event_type' => 'seminar',
            'event_location' => 'Phnom Penh',
            'estimated_guests' => '500',
            'estimated_budget' => 'above_50k',
            'consent' => true,
            'website_url' => 'http://spam-link.com', // Filled honeypot
        ];

        $response = $this->postJson('/api/quotation-requests', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['website_url']);
    }

    /**
     * Test duplicate submission prevention.
     */
    public function test_duplicate_submission_prevention(): void
    {
        $payload = [
            'customer_name' => 'Repeat Customer',
            'phone' => '+855 12 111 222',
            'email' => 'repeat@company.com',
            'preferred_contact_method' => 'email',
            'event_type' => 'product_launch',
            'event_location' => 'Phnom Penh',
            'estimated_guests' => '100',
            'estimated_budget' => '5k_10k',
            'consent' => true,
        ];

        // First submission succeeds
        $this->postJson('/api/quotation-requests', $payload)->assertStatus(201);

        // Immediate second submission gets blocked
        $response = $this->postJson('/api/quotation-requests', $payload);
        $response->assertStatus(429);
    }

    /**
     * Test public users cannot read quotation records.
     */
    public function test_public_users_cannot_read_quotation_records(): void
    {
        // GET on quotation-requests must return 404 or Method Not Allowed (405)
        $response = $this->getJson('/api/quotation-requests');
        $response->assertStatus(405);
    }
}
