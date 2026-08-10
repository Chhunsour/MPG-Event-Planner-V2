import { ContentCard } from '@/components/site/content-card';
import { PageIntro } from '@/components/site/page-intro';
import { getPublicContent } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const { projects } = await getPublicContent();
  const labels = ui[locale];
  const copy = messages[locale].projects;

  return <><PageIntro eyebrow={copy.label || labels.projects} title={copy.title} description={copy.subtitle} /><section className="collection-section"><div className="shell collection-grid collection-grid--projects">{projects.map((item, index) => <ContentCard key={item.id} item={item} locale={locale} type="project" index={index} />)}</div></section></>;
}
