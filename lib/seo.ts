import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/types';
import { siteUrl } from '@/lib/env';

export { siteUrl };

export function getAbsoluteUrl(path: string = ''): string {
  const base = siteUrl().replace(/\/+$/, '');
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${base}${cleanPath}`;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.replace(/^\/(en|km|zh)(?=\/|$)/, '');
  const suffix = cleanPath.startsWith('/') ? cleanPath : cleanPath ? `/${cleanPath}` : '';
  return `/${locale}${suffix}`;
}

export function getAlternateLanguages(pathWithoutLocale: string = '') {
  const cleanPath = pathWithoutLocale.replace(/^\/(en|km|zh)(?=\/|$)/, '');
  const suffix = cleanPath.startsWith('/') ? cleanPath : cleanPath ? `/${cleanPath}` : '';
  
  const languages: Record<string, string> = {
    'x-default': getAbsoluteUrl(`/en${suffix}`),
  };

  locales.forEach((loc) => {
    languages[loc] = getAbsoluteUrl(`/${loc}${suffix}`);
  });

  return languages;
}

export function getCanonicalUrl(pathname: string): string {
  return getAbsoluteUrl(pathname);
}

export type BuildPageMetadataOptions = {
  title: string;
  description: string;
  pathname: string;
  locale: Locale;
  image?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  noindex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  pathname,
  locale,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noindex = false,
}: BuildPageMetadataOptions): Metadata {
  const canonicalUrl = getCanonicalUrl(pathname);
  const alternates = getAlternateLanguages(pathname);
  
  const defaultOgImage = getAbsoluteUrl('/images/mpg/hero-backstage-v2.png');
  const ogImage = image ? (image.startsWith('http') ? image : getAbsoluteUrl(image)) : defaultOgImage;

  const brandSuffix = locale === 'km' ? 'MPG Event Planner កម្ពុជា' : locale === 'zh' ? 'MPG 柬埔寨活动策划' : 'MPG Event Planner';
  const fullTitle = title.includes('MPG Event Planner') ? title : `${title} | ${brandSuffix}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl()),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'MPG Event Planner',
      locale: locale === 'km' ? 'km_KH' : locale === 'zh' ? 'zh_CN' : 'en_US',
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@mpgeventplanner',
    },
  };
}
