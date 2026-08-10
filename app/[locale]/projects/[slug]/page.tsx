import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProject, localized, publicImageUrl } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import { cleanHtml } from '@/lib/sanitize';
import type { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { SiteImage } from '@/components/site/image';
import { Gallery } from '@/components/site/gallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const item = await getProject(slug);
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const title = item ? localized(item.seo_title, locale, localized(item.title, locale)) : 'Project';
  const description = item ? localized(item.seo_description, locale, localized(item.description, locale)) : undefined;
  return { title, description, alternates: { canonical: `/${locale}/projects/${slug}` }, openGraph: { title, description, type: 'website' } };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const item = await getProject(slug);
  if (!item) notFound();
  const supabase = await createClient();
  const image = publicImageUrl(supabase, 'projects', item.cover_image);
  const detailLabels = locale === 'km' ? { notes: 'ព័ត៌មានគម្រោង', location: 'ទីតាំង', date: 'កាលបរិច្ឆេទ' } : locale === 'zh' ? { notes: '项目资料', location: '地点', date: '日期' } : { notes: 'Project notes', location: 'Location', date: 'Date' };

  return <article className="detail-page"><section className="detail-hero"><div className="shell"><Link href={'/' + locale + '/projects'} className="detail-back"><ArrowLeft className="h-4 w-4" /> {ui[locale].projects}</Link><div className="detail-hero__grid"><div data-reveal><p className="micro-label micro-label--light">{item.category ?? detailLabels.notes}</p><h1>{localized(item.title, locale)}</h1><p>{localized(item.description, locale)}</p></div><figure data-reveal><SiteImage src={image} alt={localized(item.image_alt, locale, localized(item.title, locale))} priority /></figure></div></div></section><section className="detail-body"><div className="shell detail-body__grid"><div><div className="content-rich" dangerouslySetInnerHTML={{ __html: cleanHtml(localized(item.content, locale, localized(item.description, locale))) }} /><Gallery client={supabase} bucket="projects" images={item.gallery} alt={localized(item.title, locale)} /></div><aside className="detail-cta" data-reveal><p className="micro-label">{detailLabels.notes}</p><dl><div><dt>{detailLabels.location}</dt><dd>{item.location ?? 'Cambodia'}</dd></div>{item.event_date && <div><dt>{detailLabels.date}</dt><dd>{item.event_date}</dd></div>}</dl><Link href={'/' + locale + '/contact'} className="cta-island"><span>{ui[locale].enquire}</span><i>↗</i></Link></aside></div></section></article>;
}
