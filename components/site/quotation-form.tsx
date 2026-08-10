'use client';

import { useActionState } from 'react';
import { submitQuotation, type QuotationState } from '@/app/actions';
import type { Locale } from '@/lib/types';
import { messages, ui } from '@/lib/i18n';

const initialState: QuotationState = { status: 'idle', message: '' };

export function QuotationForm({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const copy = messages[locale].contact_form;
  const [state, action, pending] = useActionState(submitQuotation, initialState);

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="language" value={locale} />
      <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.name}<input className="field" name="customer_name" required autoComplete="name" /></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.company}<input className="field" name="company_name" autoComplete="organization" /></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.phone}<input className="field" name="phone" required autoComplete="tel" /></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.email}<input className="field" name="email" type="email" autoComplete="email" /></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.contact_method}<select className="field" name="preferred_contact_method" defaultValue="telegram">{Object.entries(copy.options.contact_methods).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.event_type}<select className="field" name="event_type" defaultValue="grand_opening">{Object.entries(copy.options.event_types).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.event_date}<input className="field" name="event_date" type="date" /></label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">{copy.labels.event_location}<input className="field" name="event_location" required /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.guests}<input className="field" name="estimated_guests" /></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.budget}<input className="field" name="estimated_budget" /></label>
      </div>
      <fieldset className="grid gap-3"><legend className="text-sm font-semibold">{copy.labels.services}</legend><div className="grid gap-2 sm:grid-cols-2">{Object.entries(copy.options.services).map(([value, label]) => <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" name="required_services" value={value} />{label}</label>)}</div></fieldset>
      <label className="grid gap-2 text-sm font-semibold">{copy.labels.additional}<textarea className="field min-h-36" name="additional_information" /></label>
      <div className="flex flex-wrap items-center gap-4"><button className="btn btn-primary" disabled={pending}>{pending ? labels.submitting : labels.submit}</button>{state.message && <p role="status" className={state.status === 'success' ? 'text-sm text-[var(--mpg-green-deep)]' : 'text-sm text-red-600'}>{state.message}{state.reference ? ` · ${state.reference}` : ''}</p>}</div>
    </form>
  );
}
