'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/lib/types';

export type QuotationState = { status: 'idle' | 'success' | 'error'; message: string; reference?: string };

const schema = z.object({
  customer_name: z.string().trim().min(1, 'Please add your name.').max(255),
  company_name: z.string().trim().max(255).optional(),
  phone: z.string().trim().min(1, 'Please add a phone or Telegram number.').max(80),
  email: z.union([z.string().trim().email('Please add a valid email.'), z.literal('')]).optional(),
  preferred_contact_method: z.string().trim().min(1).max(50),
  event_type: z.string().trim().min(1).max(100),
  event_date: z.string().trim().max(30).optional(),
  event_location: z.string().trim().min(1, 'Please add the event location.').max(255),
  estimated_guests: z.string().trim().max(100).optional(),
  estimated_budget: z.string().trim().max(100).optional(),
  required_services: z.array(z.string().trim().max(100)).max(20).default([]),
  additional_information: z.string().trim().max(4000).optional(),
  language: z.enum(['en', 'km', 'zh']),
  website_url: z.string().max(0, 'Spam submission detected.').optional(),
});

const recentSubmissions = new Map<string, number>();

export async function submitQuotation(_previous: QuotationState, formData: FormData): Promise<QuotationState> {
  const raw = { ...Object.fromEntries(formData.entries()), required_services: formData.getAll('required_services').map(String) };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check the form.' };

  const email = parsed.data.email || null;
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headersList.get('x-real-ip') ?? 'unknown';
  const fingerprint = [email ?? parsed.data.phone, parsed.data.event_type, ip].join('|');
  const now = Date.now();
  const previous = recentSubmissions.get(fingerprint);
  if (previous && now - previous < 60_000) return { status: 'error', message: 'Please wait a moment before sending the same enquiry again.' };
  recentSubmissions.set(fingerprint, now);
  // ponytail: process-local rate limit; replace with a hosted durable limiter if traffic requires multi-region enforcement.

  const supabase = await createClient();
  const { data, error } = await supabase.from('quotations').insert({
    customer_name: parsed.data.customer_name,
    company_name: parsed.data.company_name || null,
    phone: parsed.data.phone,
    email,
    preferred_contact_method: parsed.data.preferred_contact_method,
    event_type: parsed.data.event_type,
    event_date: parsed.data.event_date || null,
    event_location: parsed.data.event_location,
    estimated_guests: parsed.data.estimated_guests || null,
    estimated_budget: parsed.data.estimated_budget || null,
    required_services: parsed.data.required_services,
    additional_information: parsed.data.additional_information || null,
    language: parsed.data.language as Locale,
  }).select('reference_code').single();

  if (error) {
    console.error('quotation insert failed', error);
    return { status: 'error', message: 'The enquiry could not be saved. Please try again.' };
  }

  return { status: 'success', message: 'Thanks — your enquiry is with the MPG team.', reference: data.reference_code };
}
