<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuotationRequest;
use App\Mail\QuotationSubmittedMail;
use App\Models\QuotationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class QuotationRequestController extends Controller
{
    /**
     * Store a newly created quotation request in database.
     */
    public function store(StoreQuotationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Check for duplicate submission within 60 seconds
        $recentDuplicate = QuotationRequest::where('email', $validated['email'])
            ->where('event_type', $validated['event_type'])
            ->where('created_at', '>=', now()->subMinute())
            ->first();

        if ($recentDuplicate) {
            return response()->json([
                'success' => false,
                'message' => 'A quotation request with these details was recently submitted. Please wait a moment before submitting again.',
            ], 429);
        }

        // Save to Database
        try {
            $quotation = QuotationRequest::create([
                'customer_name' => $validated['customer_name'],
                'company_name' => $validated['company_name'] ?? null,
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'preferred_contact_method' => $validated['preferred_contact_method'],
                'event_type' => $validated['event_type'],
                'event_date' => $validated['event_date'] ?? null,
                'event_location' => $validated['event_location'],
                'estimated_guests' => $validated['estimated_guests'] ?? null,
                'estimated_budget' => $validated['estimated_budget'] ?? null,
                'required_services' => $validated['required_services'] ?? [],
                'additional_information' => $validated['additional_information'] ?? null,
                'language' => $validated['language'] ?? 'en',
                'status' => 'new',
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 500),
            ]);
        } catch (\Throwable $e) {
            Log::error('Database Error Saving Quotation Request: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving your request. Please try again later.',
            ], 500);
        }

        // Trigger Mail Notification Safely
        try {
            $recipient = config('services.mpg.notification_email');
            if (!empty($recipient) && filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                Mail::to($recipient)->send(new QuotationSubmittedMail($quotation));
            }
        } catch (\Throwable $e) {
            Log::error('Email notification failed for quotation #' . $quotation->id . ': ' . $e->getMessage());
        }

        // Trigger Optional Telegram Notification Safely
        try {
            $botToken = config('services.telegram.bot_token');
            $chatId = config('services.telegram.chat_id');

            if (!empty($botToken) && !empty($chatId)) {
                /*
                 * Every interpolated value comes from a public form, so each one
                 * is escaped for the chosen parse mode.
                 *
                 * This is not cosmetic. Under the previous `Markdown` mode an
                 * unbalanced `*` or `_` in a name made Telegram reject the whole
                 * message with a 400 — so anyone could suppress the alerts for
                 * their own submission, and a link could be smuggled into a
                 * message that reads as coming from MPG. HTML mode escapes
                 * unambiguously with htmlspecialchars.
                 */
                $esc = fn (?string $value) => htmlspecialchars(
                    (string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'
                );

                $telegramMsg = "🔔 <b>New MPG Event Quotation Request</b>\n\n"
                    . "👤 <b>Name</b>: " . $esc($quotation->customer_name) . "\n"
                    . "🏢 <b>Company</b>: " . $esc($quotation->company_name ?? 'N/A') . "\n"
                    . "📞 <b>Phone</b>: " . $esc($quotation->phone) . "\n"
                    . "📧 <b>Email</b>: " . $esc($quotation->email) . "\n"
                    . "💬 <b>Contact Method</b>: " . $esc($quotation->preferred_contact_method) . "\n"
                    . "🎉 <b>Event</b>: " . $esc(str_replace('_', ' ', (string) $quotation->event_type)) . "\n"
                    . "📅 <b>Date</b>: " . ($quotation->event_date ? $quotation->event_date->format('Y-m-d') : 'TBD') . "\n"
                    . "📍 <b>Location</b>: " . $esc($quotation->event_location) . "\n"
                    . "👥 <b>Guests</b>: " . $esc($quotation->estimated_guests) . "\n"
                    . "💰 <b>Budget</b>: " . $esc($quotation->estimated_budget) . "\n";

                Http::timeout(5)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => $telegramMsg,
                    'parse_mode' => 'HTML',
                    'disable_web_page_preview' => true,
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Telegram notification failed for quotation #' . $quotation->id . ': ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Your quotation request has been submitted successfully.',
            'reference' => 'MPG-' . str_pad((string) $quotation->id, 6, '0', STR_PAD_LEFT),
        ], 201);
    }
}
