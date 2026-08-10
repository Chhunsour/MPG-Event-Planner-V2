import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/lib/content';
import { locales } from '@/lib/types';
import { siteUrl } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const routes = locales.flatMap((locale) => [`/${locale}`, `/${locale}/about`, `/${locale}/services`, `/${locale}/projects`, `/${locale}/blog`, `/${locale}/contact`, `/${locale}/privacy`].map((path) => ({ url: base + path, lastModified: new Date() })));
  try { const content = await getPublicContent(); return routes.concat(locales.flatMap((locale) => [...content.services.map((item) => ({ url: `${base}/${locale}/services/${item.slug}`, lastModified: new Date(item.updated_at) })), ...content.projects.map((item) => ({ url: `${base}/${locale}/projects/${item.slug}`, lastModified: new Date(item.updated_at) })), ...content.blog.map((item) => ({ url: `${base}/${locale}/blog/${item.slug}`, lastModified: new Date(item.updated_at) }))])); } catch { return routes; }
}
