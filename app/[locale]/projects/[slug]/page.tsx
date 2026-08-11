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
import { buildPageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ProjectJsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const item = await getProject(slug);
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  if (!item) {
    return buildPageMetadata({
      title: 'Project Not Found',
      description: 'The requested project case study could not be found.',
      pathname: `/${locale}/projects/${slug}`,
      locale,
      noindex: true,
    });
  }

  const supabase = await createClient();
  const coverImage = publicImageUrl(supabase, 'projects', item.cover_image);
  const title = localized(item.seo_title, locale, localized(item.title, locale));
  const description = localized(item.seo_description, locale, localized(item.description, locale));

  return buildPageMetadata({
    title,
    description,
    pathname: `/${locale}/projects/${slug}`,
    locale,
    image: coverImage,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const item = await getProject(slug);
  if (!item) notFound();

  const supabase = await createClient();
  const image = publicImageUrl(supabase, 'projects', item.cover_image);
  const detailLabels = locale === 'km'
    ? { notes: 'ព័ត៌មានគម្រោង', location: 'ទីតាំង', date: 'កាលបរិច្ឆេទ' }
    : locale === 'zh'
    ? { notes: '项目资料', location: '地点', date: '日期' }
    : { notes: 'Project notes', location: 'Location', date: 'Date' };

  const projectTitle = localized(item.title, locale);
  const projectDescription = localized(item.description, locale);

  const breadcrumbs = [
    { label: 'Home', href: `/${locale}` },
    { label: ui[locale].projects, href: `/${locale}/projects` },
    { label: projectTitle, href: `/${locale}/projects/${slug}` },
  ];

  return (
    <>
      <ProjectJsonLd
        name={projectTitle}
        description={projectDescription}
        url={`/${locale}/projects/${slug}`}
        image={image}
        category={item.category}
        eventDate={item.event_date}
        location={item.location}
      />
      <Breadcrumbs items={breadcrumbs} />
      <article className="detail-page">
        <section className="detail-hero">
          <div className="shell">
            <Link href={`/${locale}/projects`} className="detail-back">
              <ArrowLeft className="h-4 w-4" /> {ui[locale].projects}
            </Link>
            <div className="detail-hero__grid">
              <div data-reveal>
                <p className="micro-label micro-label--light">{item.category ?? detailLabels.notes}</p>
                <h1>{projectTitle}</h1>
                <p>{projectDescription}</p>
              </div>
              <figure data-reveal>
                <SiteImage src={image} alt={localized(item.image_alt, locale, projectTitle)} priority />
              </figure>
            </div>
          </div>
        </section>
        <section className="detail-body">
          <div className="shell detail-body__grid">
            <div>
              <div
                className="content-rich"
                dangerouslySetInnerHTML={{ __html: cleanHtml(localized(item.content, locale, projectDescription)) }}
              />
              <Gallery client={supabase} bucket="projects" images={item.gallery} alt={projectTitle} />
            </div>
            <aside className="detail-cta" data-reveal>
              <p className="micro-label">{detailLabels.notes}</p>
              <dl>
                <div>
                  <dt>{detailLabels.location}</dt>
                  <dd>{item.location ?? 'Cambodia'}</dd>
                </div>
                {item.event_date && (
                  <div>
                    <dt>{detailLabels.date}</dt>
                    <dd>{item.event_date}</dd>
                  </div>
                )}
              </dl>
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
