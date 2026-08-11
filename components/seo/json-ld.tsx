import React from 'react';
import { getAbsoluteUrl } from '@/lib/seo';
import type { SiteSettings } from '@/lib/content';

export function OrganizationJsonLd({ settings }: { settings?: SiteSettings | null }) {
  const companyName = settings?.company_name || 'MPG Event Planner';
  const companyEmail = settings?.company_email || 'hello@mpgeventplanner.com';
  const companyPhone = settings?.phone || '+855 12 345 678';
  const address = settings?.office_address || 'Phnom Penh, Cambodia';

  const socialLinks = [
    settings?.telegram || 'https://t.me/mpgeventplanner',
    settings?.facebook || 'https://facebook.com/mpgeventplanner',
    settings?.instagram || 'https://instagram.com/mpgeventplanner',
    settings?.tiktok || 'https://tiktok.com/@mpgeventplanner',
    settings?.linkedin || 'https://linkedin.com/company/mpgeventplanner',
  ].filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['EventPlanner', 'LocalBusiness', 'Organization'],
    '@id': getAbsoluteUrl('#organization'),
    name: companyName,
    url: getAbsoluteUrl(),
    logo: getAbsoluteUrl('/images/mpg-logo.png'),
    image: getAbsoluteUrl('/images/mpg/hero-backstage-v2.png'),
    description: 'Premier event planning, corporate ceremonies, grand openings, stage design and production agency in Phnom Penh, Cambodia.',
    email: companyEmail,
    telephone: companyPhone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Phnom Penh',
      addressCountry: 'KH',
      streetAddress: address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '11.5564',
      longitude: '104.9282',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Cambodia',
      },
      {
        '@type': 'City',
        name: 'Phnom Penh',
      },
      {
        '@type': 'City',
        name: 'Siem Reap',
      },
      {
        '@type': 'City',
        name: 'Sihanoukville',
      },
    ],
    priceRange: '$$$',
    sameAs: socialLinks,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: companyPhone,
      contactType: 'customer service',
      email: companyEmail,
      areaServed: 'KH',
      availableLanguage: ['English', 'Khmer', 'Chinese'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': getAbsoluteUrl('#website'),
    url: getAbsoluteUrl(),
    name: 'MPG Event Planner',
    alternateName: ['MPG Event Planner Cambodia', 'MPG Events'],
    publisher: {
      '@id': getAbsoluteUrl('#organization'),
    },
    inLanguage: ['en-US', 'km-KH', 'zh-CN'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function BreadcrumbsJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : getAbsoluteUrl(item.url),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: url.startsWith('http') ? url : getAbsoluteUrl(url),
    provider: {
      '@type': 'LocalBusiness',
      name: 'MPG Event Planner',
      url: getAbsoluteUrl(),
    },
    areaServed: {
      '@type': 'Country',
      name: 'Cambodia',
    },
    ...(image ? { image: image.startsWith('http') ? image : getAbsoluteUrl(image) } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProjectJsonLd({
  name,
  description,
  url,
  image,
  category,
  eventDate,
  location,
}: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  category?: string | null;
  eventDate?: string | null;
  location?: string | null;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: url.startsWith('http') ? url : getAbsoluteUrl(url),
    genre: category || 'Event Production',
    locationCreated: {
      '@type': 'Place',
      name: location || 'Phnom Penh, Cambodia',
    },
    ...(eventDate ? { dateCreated: eventDate } : {}),
    ...(image ? { image: image.startsWith('http') ? image : getAbsoluteUrl(image) } : {}),
    author: {
      '@type': 'Organization',
      name: 'MPG Event Planner',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
}) {
  const fullUrl = url.startsWith('http') ? url : getAbsoluteUrl(url);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    headline: title,
    description,
    url: fullUrl,
    image: image ? (image.startsWith('http') ? image : getAbsoluteUrl(image)) : getAbsoluteUrl('/images/mpg/hero-backstage-v2.png'),
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || datePublished || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'MPG Event Planner Editorial Team',
      url: getAbsoluteUrl(),
    },
    publisher: {
      '@type': 'Organization',
      name: 'MPG Event Planner',
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteUrl('/images/mpg-logo.png'),
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
