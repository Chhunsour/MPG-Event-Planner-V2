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
  const title = item ? localized(item.seo_title, locale, localized(item.title, locale)) : 'Journal';
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

  return <article><section className="bg-[var(--paper-tint)]"><div className="shell py-8"><Link href={'/' + locale + '/blog'} className="detail-back"><ArrowLeft className="h-4 w-4" /> {ui[locale].journal}</Link><div className="mt-14 max-w-3xl"><p className="t-meta text-[var(--mpg-green-deep)]">{item.category ?? 'MPG Journal'}</p><h1 className="t-display-lg mt-4">{localized(item.title, locale)}</h1><p className="mt-6 text-lg leading-8 text-[var(--text-muted)]">{localized(item.excerpt, locale)}</p></div>{image && <div className="frame relative mt-10 aspect-[16/7]"><SiteImage src={image} alt={localized(item.image_alt, locale, localized(item.title, locale))} /></div>}</div></section><section className="band-lg"><div className="shell"><div className="content-rich mx-auto" dangerouslySetInnerHTML={{ __html: cleanHtml(localized(item.content, locale, localized(item.excerpt, locale))) }} /></div></section></article>;
}
