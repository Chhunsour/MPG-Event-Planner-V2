import { ContentCard } from '@/components/site/content-card';
import { PageIntro } from '@/components/site/page-intro';
import { getPublicContent } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const { services } = await getPublicContent();
  const labels = ui[locale];
  const copy = messages[locale].services;

  return <><PageIntro eyebrow={copy.label || labels.services} title={copy.title} description={copy.subtitle} /><section className="collection-section"><div className="shell collection-grid collection-grid--services">{services.map((item, index) => <ContentCard key={item.id} item={item} locale={locale} type="service" index={index} />)}</div></section></>;
}
