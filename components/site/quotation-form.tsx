'use client';

import { useActionState, useState } from 'react';
import { submitQuotation, type QuotationState } from '@/app/actions';
import type { Locale } from '@/lib/types';
import { messages, ui } from '@/lib/i18n';

const initialState: QuotationState = { status: 'idle', message: '' };

export function QuotationForm({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const copy = messages[locale].contact_form;
  const [state, action, pending] = useActionState(submitQuotation, initialState);
  const [showDetails, setShowDetails] = useState(false);

  const toggleLabels: Record<Locale, { add: string; hide: string }> = {
    en: { add: '+ Add optional details (Location, Date, Budget, Services)', hide: '− Hide optional details' },
    km: { add: '+ បន្ថែមព័ត៌មានលម្អិតជម្រើស (ទីតាំង កាលបរិច្ឆេទ ថវិកា...)', hide: '− លាក់ព័ត៌មានលម្អិត' },
    zh: { add: '+ 添加更多细节（选填：地点、日期、预算、服务）', hide: '− 收起可选细节' },
  };

  return (
    <form action={action} className="quote-form">
      <input type="hidden" name="language" value={locale} />
      <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label></div>
      
      {/* Essential Quick Contact Fields */}
      <div className="quote-form__grid">
        <label>
          {copy.labels.name} *
          <input className="field" name="customer_name" required autoComplete="name" placeholder={copy.placeholders.name} />
        </label>
        <label>
          {copy.labels.phone} *
          <input className="field" name="phone" required autoComplete="tel" placeholder={copy.placeholders.phone} />
        </label>
      </div>

      <div className="quote-form__grid">
        <label className="grid gap-2 text-sm font-semibold">
          {copy.labels.event_type}
          <select className="field" name="event_type" defaultValue="grand_opening">
            {Object.entries(copy.options.event_types).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          {copy.labels.contact_method}
          <select className="field" name="preferred_contact_method" defaultValue="telegram">
            {Object.entries(copy.options.contact_methods).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        {copy.labels.additional}
        <textarea className="field min-h-28" name="additional_information" placeholder={copy.placeholders.additional} />
      </label>

      {/* Optional Details Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-4 cursor-pointer transition-colors"
        >
          {showDetails ? toggleLabels[locale].hide : toggleLabels[locale].add}
        </button>
      </div>

      {/* Expanded Optional Fields */}
      {showDetails && (
        <div className="grid gap-5 pt-3 pb-1 border-t border-slate-200/60 mt-2">
          <div className="quote-form__grid">
            <label>
              {copy.labels.company} ({copy.optional})
              <input className="field" name="company_name" autoComplete="organization" placeholder={copy.placeholders.company} />
            </label>
            <label>
              {copy.labels.email} ({copy.optional})
              <input className="field" name="email" type="email" autoComplete="email" placeholder={copy.placeholders.email} />
            </label>
          </div>

          <div className="quote-form__grid">
            <label>
              {copy.labels.event_location} ({copy.optional})
              <input className="field" name="event_location" placeholder={copy.placeholders.event_location} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              {copy.labels.event_date} ({copy.optional})
              <input className="field" name="event_date" type="date" />
            </label>
          </div>

          <div className="quote-form__grid">
            <label>
              {copy.labels.guests} ({copy.optional})
              <input className="field" name="estimated_guests" placeholder={copy.placeholders.guests} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              {copy.labels.budget} ({copy.optional})
              <select className="field" name="estimated_budget" defaultValue="unsure">
                {Object.entries(copy.options.budget_ranges).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold">{copy.labels.services} ({copy.optional})</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(copy.options.services).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="required_services" value={value} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <div className="quote-form__submit">
        <button className="cta-island" disabled={pending}>
          <span>{pending ? labels.submitting : labels.submit}</span>
          <i aria-hidden="true">↗</i>
        </button>
        {state.message && (
          <p role="status" className={state.status === 'success' ? 'quote-form__success' : 'quote-form__error'}>
            {state.message}{state.reference ? ` · ${state.reference}` : ''}
          </p>
        )}
      </div>
    </form>
  );
}
