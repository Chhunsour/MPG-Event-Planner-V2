import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { siteConfig, ogLocale, type Locale } from "@/config/site";

interface SeoMetaProps {
  title: string;
  description?: string;
  image?: string;
  locale: Locale;
  path?: string;
  type?: "website" | "article";
  publishedAt?: string;
  noindex?: boolean;
  children?: ReactNode;
}

export default function SeoMeta({
  title,
  description,
  image,
  locale,
  path,
  type = "website",
  publishedAt,
  noindex = false,
  children,
}: SeoMetaProps) {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const canonical = path ? `${baseUrl}/${locale}${path}` : `${baseUrl}/${locale}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image}`
    : `${baseUrl}/images/mpg/hero-main.webp`;
  const ogImageAlt = title;
  const siteName = siteConfig.name[locale];

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Hreflang alternates */}
      {siteConfig.locales.map((alt) => (
        <link
          key={alt}
          rel="alternate"
          hrefLang={alt}
          href={path ? `${baseUrl}/${alt}${path}` : `${baseUrl}/${alt}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/en`}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale[locale]} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* Article metadata */}
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}

      {children}
    </Head>
  );
}
