import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getBlogPost, localized, publicImageUrl } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import { cleanHtml } from '@/lib/sanitize';
import type { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { SiteImage } from '@/components/site/image';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const item = await getBlogPost(slug);
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const title = item ? localized(item.seo_title, locale, localized(item.title, locale)) : 'Blog';
  const description = item ? localized(item.seo_description, locale, localized(item.excerpt, locale)) : undefined;
  return { title, description, alternates: { canonical: `/${locale}/blog/${slug}` }, openGraph: { title, description, type: 'article' } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const item = await getBlogPost(slug);
  if (!item) notFound();
  const supabase = await createClient();
  const image = publicImageUrl(supabase, 'blog', item.cover_image);

  return <article className="journal-detail"><section className="journal-detail__head"><div className="shell"><Link href={'/' + locale + '/blog'} className="detail-back"><ArrowLeft className="h-4 w-4" /> {ui[locale].blog}</Link><div data-reveal><p className="micro-label">{item.category ?? 'MPG Blog'}</p><h1>{localized(item.title, locale)}</h1><p>{localized(item.excerpt, locale)}</p></div>{image && <figure data-reveal><SiteImage src={image} alt={localized(item.image_alt, locale, localized(item.title, locale))} priority /></figure>}</div></section><section className="journal-detail__body"><div className="shell"><div className="content-rich" dangerouslySetInnerHTML={{ __html: cleanHtml(localized(item.content, locale, localized(item.excerpt, locale))) }} /></div></section></article>;
}
