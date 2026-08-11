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
import { buildPageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ArticleJsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const item = await getBlogPost(slug);
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  if (!item) {
    return buildPageMetadata({
      title: 'Article Not Found',
      description: 'The requested blog article could not be found.',
      pathname: `/${locale}/blog/${slug}`,
      locale,
      noindex: true,
    });
  }

  const supabase = await createClient();
  const coverImage = publicImageUrl(supabase, 'blog', item.cover_image);
  const title = localized(item.seo_title, locale, localized(item.title, locale));
  const description = localized(item.seo_description, locale, localized(item.excerpt, locale));

  return buildPageMetadata({
    title,
    description,
    pathname: `/${locale}/blog/${slug}`,
    locale,
    image: coverImage,
    type: 'article',
    publishedTime: item.published_at,
    modifiedTime: item.updated_at,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const item = await getBlogPost(slug);
  if (!item) notFound();

  const supabase = await createClient();
  const image = publicImageUrl(supabase, 'blog', item.cover_image);
  const articleTitle = localized(item.title, locale);
  const articleExcerpt = localized(item.excerpt, locale);

  const breadcrumbs = [
    { label: 'Home', href: `/${locale}` },
    { label: ui[locale].blog, href: `/${locale}/blog` },
    { label: articleTitle, href: `/${locale}/blog/${slug}` },
  ];

  return (
    <>
      <ArticleJsonLd
        title={articleTitle}
        description={articleExcerpt}
        url={`/${locale}/blog/${slug}`}
        image={image}
        datePublished={item.published_at}
        dateModified={item.updated_at}
      />
      <Breadcrumbs items={breadcrumbs} />
      <article className="journal-detail">
        <section className="journal-detail__head">
          <div className="shell">
            <Link href={`/${locale}/blog`} className="detail-back">
              <ArrowLeft className="h-4 w-4" /> {ui[locale].blog}
            </Link>
            <div data-reveal>
              <p className="micro-label">{item.category ?? 'MPG Blog'}</p>
              <h1>{articleTitle}</h1>
              <p>{articleExcerpt}</p>
            </div>
            {image && (
              <figure data-reveal>
                <SiteImage src={image} alt={localized(item.image_alt, locale, articleTitle)} priority />
              </figure>
            )}
          </div>
        </section>
        <section className="journal-detail__body">
          <div className="shell">
            <div
              className="content-rich"
              dangerouslySetInnerHTML={{ __html: cleanHtml(localized(item.content, locale, articleExcerpt)) }}
            />
          </div>
        </section>
      </article>
    </>
  );
}
