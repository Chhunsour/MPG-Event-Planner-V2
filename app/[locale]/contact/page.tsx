import { PageIntro } from '@/components/site/page-intro';
import { QuotationForm } from '@/components/site/quotation-form';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const labels = ui[locale];
  const copy = messages[locale].contact_form;

  return <><PageIntro eyebrow={labels.contact} title={labels.quotationTitle} description={labels.quotationIntro} /><section className="band-lg"><div className="shell grid gap-12 lg:grid-cols-[1fr_0.62fr]"><QuotationForm locale={locale} /><aside className="detail-aside"><p className="t-meta text-[var(--mpg-green-deep)]">{copy.officeLabel}</p><h2 className="t-display-sm mt-4">{copy.title}</h2><p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">{copy.intro}</p><div className="mt-10 grid gap-3 border-t border-[var(--line)] pt-5 text-sm"><a href="mailto:hello@mpgeventplanner.com" className="font-semibold text-[var(--mpg-blue)] hover:underline">hello@mpgeventplanner.com</a><span className="text-[var(--text-muted)]">{copy.officeTitle}</span></div></aside></div></section></>;
}
