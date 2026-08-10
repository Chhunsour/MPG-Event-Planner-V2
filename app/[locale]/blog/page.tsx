import { ContentCard } from '@/components/site/content-card';
import { PageIntro } from '@/components/site/page-intro';
import { getPublicContent } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const { blog } = await getPublicContent();
  const labels = ui[locale];
  const copy = messages[locale].blog;

  return <><PageIntro eyebrow={copy.label || labels.journal} title={copy.title} description={copy.subtitle} /><section className="band-lg"><div className="shell grid gap-10 md:grid-cols-2 lg:grid-cols-3">{blog.map((item) => <ContentCard key={item.id} item={item} locale={locale} type="blog" />)}</div></section></>;
}
