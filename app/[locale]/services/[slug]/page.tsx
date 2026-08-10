import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getService, localized, publicImageUrl } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import { cleanHtml } from '@/lib/sanitize';
import type { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { SiteImage } from '@/components/site/image';
import { Gallery } from '@/components/site/gallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const item = await getService(slug);
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const title = item ? localized(item.seo_title, locale, localized(item.title, locale)) : 'Service';
  const description = item ? localized(item.seo_description, locale, localized(item.description, locale)) : undefined;
  return { title, description, alternates: { canonical: `/${locale}/services/${slug}` }, openGraph: { title, description, type: 'website' } };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const item = await getService(slug);
  if (!item) notFound();
  const supabase = await createClient();
  const image = publicImageUrl(supabase, 'services', item.cover_image);

  return <article><section className="bg-[var(--mpg-blue)] text-white"><div className="shell py-8"><Link href={'/' + locale + '/services'} className="detail-back text-white/70 hover:text-white"><ArrowLeft className="h-4 w-4" /> {ui[locale].services}</Link><div className="mt-14 grid gap-10 pb-10 lg:grid-cols-[1fr_0.7fr] lg:items-end"><div><p className="t-meta text-[var(--mpg-green-bright)]">Capability</p><h1 className="t-display-lg mt-4 max-w-3xl">{localized(item.title, locale)}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/75">{localized(item.description, locale)}</p></div><div className="frame relative aspect-[4/3] bg-white/10"><SiteImage src={image} alt={localized(item.image_alt, locale, localized(item.title, locale))} /></div></div></div></section><section className="band-lg"><div className="shell grid gap-12 lg:grid-cols-[1fr_0.7fr]"><div><div className="content-rich" dangerouslySetInnerHTML={{ __html: cleanHtml(localized(item.content, locale, localized(item.description, locale))) }} /><Gallery client={supabase} bucket="services" images={item.gallery} alt={localized(item.title, locale)} /></div><aside className="detail-aside"><p className="t-meta text-[var(--mpg-green-deep)]">Next step</p><h2 className="t-display-sm mt-3">Let’s make the room work harder.</h2><Link href={'/' + locale + '/contact'} className="btn btn-primary mt-7">{ui[locale].enquire}<ArrowUpRight className="h-4 w-4" /></Link></aside></div></section></article>;
}
