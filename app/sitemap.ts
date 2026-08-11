import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/lib/content';
import { locales } from '@/lib/types';
import { siteUrl } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl().replace(/\/+$/, '');
  const now = new Date();

  const staticPaths = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }))
  );

  try {
    const { services, projects, blog } = await getPublicContent();

    const dynamicEntries: MetadataRoute.Sitemap = locales.flatMap((locale) => [
      ...services.map((item) => ({
        url: `${base}/${locale}/services/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...projects.map((item) => ({
        url: `${base}/${locale}/projects/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...blog.map((item) => ({
        url: `${base}/${locale}/blog/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]);

    return [...staticEntries, ...dynamicEntries];
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
    return staticEntries;
  }
}
