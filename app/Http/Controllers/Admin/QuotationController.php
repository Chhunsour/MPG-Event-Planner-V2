<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuotationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Quotation requests are readable only here, behind auth + the admin gate.
 * There is deliberately no public read route for this table.
 */
class QuotationController extends Controller
{
    public function index(Request $request): Response
    {
        $requests = QuotationRequest::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('q'), function ($query) use ($request) {
                $term = '%'.$request->string('q')->trim().'%';
                $query->where(fn ($q) => $q
                    ->where('customer_name', 'like', $term)
                    ->orWhere('company_name', 'like', $term)
                    ->orWhere('phone', 'like', $term)
                    ->orWhere('email', 'like', $term));
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/Messages/Index', [
            'requests' => $requests,
            'statuses' => QuotationRequest::STATUSES,
        ]);
    }

    public function show(QuotationRequest $quotation): Response
    {
        if (! $quotation->is_read) {
            $quotation->forceFill(['is_read' => true])->saveQuietly();
        }

        return Inertia::render('Admin/Messages/Show', [
            'quotation' => $quotation,
            'statuses' => QuotationRequest::STATUSES,
        ]);
    }

    public function update(Request $request, QuotationRequest $quotation): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(QuotationRequest::STATUSES)],
            'internal_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $quotation->update([
            'status' => $data['status'],
            'internal_notes' => $data['internal_notes'] ?? null,
            'status_changed_at' => $quotation->status !== $data['status']
                ? now()
                : $quotation->status_changed_at,
            'resolved_at' => in_array($data['status'], ['completed', 'rejected'], true)
                ? ($quotation->resolved_at ?? now())
                : null,
        ]);

        return back()->with('status', 'Request updated.');
    }
}
