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
    <form action={action} className="quote-form">
      <input type="hidden" name="language" value={locale} />
      <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="quote-form__grid">
        <label>{copy.labels.name}<input className="field" name="customer_name" required autoComplete="name" placeholder={copy.placeholders.name} /></label>
        <label>{copy.labels.company}<input className="field" name="company_name" autoComplete="organization" placeholder={copy.placeholders.company} /></label>
        <label>{copy.labels.phone}<input className="field" name="phone" required autoComplete="tel" placeholder={copy.placeholders.phone} /></label>
        <label>{copy.labels.email}<input className="field" name="email" type="email" autoComplete="email" placeholder={copy.placeholders.email} /></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.contact_method}<select className="field" name="preferred_contact_method" defaultValue="telegram">{Object.entries(copy.options.contact_methods).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.event_type}<select className="field" name="event_type" defaultValue="grand_opening">{Object.entries(copy.options.event_types).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-semibold">{copy.labels.event_date}<input className="field" name="event_date" type="date" /></label>
      </div>
      <label>{copy.labels.event_location}<input className="field" name="event_location" required placeholder={copy.placeholders.event_location} /></label>
      <div className="quote-form__grid">
        <label>{copy.labels.guests}<input className="field" name="estimated_guests" placeholder={copy.placeholders.guests} /></label>
        <label>{copy.labels.budget}<select className="field" name="estimated_budget" defaultValue="unsure">{Object.entries(copy.options.budget_ranges).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      <fieldset className="grid gap-3"><legend className="text-sm font-semibold">{copy.labels.services}</legend><div className="grid gap-2 sm:grid-cols-2">{Object.entries(copy.options.services).map(([value, label]) => <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" name="required_services" value={value} />{label}</label>)}</div></fieldset>
      <label>{copy.labels.additional}<textarea className="field min-h-36" name="additional_information" placeholder={copy.placeholders.additional} /></label>
      <div className="quote-form__submit"><button className="cta-island" disabled={pending}><span>{pending ? labels.submitting : labels.submit}</span><i aria-hidden="true">↗</i></button>{state.message && <p role="status" className={state.status === 'success' ? 'quote-form__success' : 'quote-form__error'}>{state.message}{state.reference ? ` · ${state.reference}` : ''}</p>}</div>
    </form>
  );
}
