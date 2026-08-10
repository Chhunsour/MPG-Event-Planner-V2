import { PageIntro } from '@/components/site/page-intro';
import { QuotationForm } from '@/components/site/quotation-form';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { getSiteSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const labels = ui[locale];
  const settings = await getSiteSettings();
  const copy = messages[locale].contact_form;
  const detailLabels = locale === 'km' ? { brief: 'ព័ត៌មានកម្មវិធី', email: 'អ៊ីមែល', response: 'ការឆ្លើយតប' } : locale === 'zh' ? { brief: '活动需求', email: '邮箱', response: '回复时间' } : { brief: 'Event brief', email: 'Email', response: 'Response' };

  return <><PageIntro eyebrow={labels.contact} title={labels.quotationTitle} description={labels.quotationIntro} /><section className="contact-section"><div className="shell contact-section__grid"><div className="contact-section__form" data-reveal><p className="micro-label">{detailLabels.brief}</p><h2>{copy.title}</h2><QuotationForm locale={locale} /></div><aside className="contact-card" data-reveal><div className="contact-card__image" aria-hidden="true" /><p className="micro-label micro-label--light">{copy.officeLabel}</p><h2>{copy.officeTitle}</h2><p>{copy.intro}</p><div><span>{detailLabels.email}</span><a href={`mailto:${settings.company_email}`}>{settings.company_email}</a></div>{settings.phone && <div><span>{labels.phone}</span><a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}>{settings.phone}</a></div>}<div><span>{detailLabels.response}</span><p>{copy.reply_note}</p></div></aside></div></section></>;
}
