import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getService, localized, publicImageUrl } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import { cleanHtml } from '@/lib/sanitize';
import type { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { SiteImage } from '@/components/site/image';
import { Gallery } from '@/components/site/gallery';
import { buildPageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ServiceJsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const item = await getService(slug);
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  if (!item) {
    return buildPageMetadata({
      title: 'Service Not Found',
      description: 'The requested service capability could not be found.',
      pathname: `/${locale}/services/${slug}`,
      locale,
      noindex: true,
    });
  }

  const supabase = await createClient();
  const coverImage = publicImageUrl(supabase, 'services', item.cover_image);
  const title = localized(item.seo_title, locale, localized(item.title, locale));
  const description = localized(item.seo_description, locale, localized(item.description, locale));

  return buildPageMetadata({
    title,
    description,
    pathname: `/${locale}/services/${slug}`,
    locale,
    image: coverImage,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const item = await getService(slug);
  if (!item) notFound();

  const supabase = await createClient();
  const image = publicImageUrl(supabase, 'services', item.cover_image);
  const detailCopy = locale === 'km'
    ? { label: 'សេវាកម្ម', next: 'ជំហានបន្ទាប់', title: 'តោះរៀបចំកម្មវិធីរបស់អ្នកឱ្យមានប្រសិទ្ធភាព។' }
    : locale === 'zh'
    ? { label: '服务能力', next: '下一步', title: '让这个空间发挥更大价值。' }
    : { label: 'Capability', next: 'Next step', title: 'Let’s make the room work harder.' };

  const serviceTitle = localized(item.title, locale);
  const serviceDescription = localized(item.description, locale);

  const breadcrumbs = [
    { label: 'Home', href: `/${locale}` },
    { label: ui[locale].services, href: `/${locale}/services` },
    { label: serviceTitle, href: `/${locale}/services/${slug}` },
  ];

  return (
    <>
      <ServiceJsonLd
        name={serviceTitle}
        description={serviceDescription}
        url={`/${locale}/services/${slug}`}
        image={image}
      />
      <Breadcrumbs items={breadcrumbs} />
      <article className="detail-page">
        <section className="detail-hero">
          <div className="shell">
            <Link href={`/${locale}/services`} className="detail-back">
              <ArrowLeft className="h-4 w-4" /> {ui[locale].services}
            </Link>
            <div className="detail-hero__grid">
              <div data-reveal>
                <p className="micro-label micro-label--light">{detailCopy.label}</p>
                <h1>{serviceTitle}</h1>
                <p>{serviceDescription}</p>
              </div>
              <figure data-reveal>
                <SiteImage src={image} alt={localized(item.image_alt, locale, serviceTitle)} priority />
              </figure>
            </div>
          </div>
        </section>
        <section className="detail-body">
          <div className="shell detail-body__grid">
            <div>
              <div
                className="content-rich"
                dangerouslySetInnerHTML={{ __html: cleanHtml(localized(item.content, locale, serviceDescription)) }}
              />
              <Gallery client={supabase} bucket="services" images={item.gallery} alt={serviceTitle} />
            </div>
            <aside className="detail-cta" data-reveal>
              <p className="micro-label">{detailCopy.next}</p>
              <h2>{detailCopy.title}</h2>
              <Link href={`/${locale}/contact`} className="cta-island">
                <span>{ui[locale].enquire}</span>
                <i>↗</i>
              </Link>
            </aside>
          </div>
        </section>
      </article>
    </>
  );
}
