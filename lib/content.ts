import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Locale, LocalizedText, BlogPost, Project, Service } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

export function localized(value: unknown, locale: Locale, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  const map = value as LocalizedText;
  return map[locale] || map.en || Object.values(map).find((item) => item?.trim()) || fallback;
}

function publishedNow<T extends { is_published: boolean; published_at: string | null }>(row: T) {
  return row.is_published && (!row.published_at || new Date(row.published_at).getTime() <= Date.now());
}

export function publicImageUrl(client: SupabaseClient<Database>, bucket: string, path: string | null) {
  if (!path) return null;
  if (path.startsWith('/')) return path;
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export type SiteSettings = {
  company_email: string;
  phone: string;
  telegram: string;
  instagram: string;
  facebook: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = { company_email: 'hello@mpgeventplanner.com', phone: '', telegram: '', instagram: '', facebook: '' };
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').select('key,value');
  if (error || !data) return defaults;
  const values = Object.fromEntries(data.map((row) => [row.key, typeof row.value === 'string' ? row.value : '']));
  return { ...defaults, ...values };
}

export async function getPublicContent() {
  const supabase = await createClient();
  const [services, projects, blog] = await Promise.all([
    supabase.from('services').select('*').eq('is_published', true).order('display_order').order('id'),
    supabase.from('projects').select('*').eq('is_published', true).order('display_order').order('id'),
    supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }).order('id', { ascending: false }),
  ]);

  if (services.error) throw services.error;
  if (projects.error) throw projects.error;
  if (blog.error) throw blog.error;

  return {
    services: (services.data ?? []).filter(publishedNow),
    projects: (projects.data ?? []).filter(publishedNow),
    blog: (blog.data ?? []).filter(publishedNow),
  } as { services: Service[]; projects: Project[]; blog: BlogPost[] };
}

export async function getService(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data && publishedNow(data) ? data : null;
}

export async function getProject(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data && publishedNow(data) ? data : null;
}

export async function getBlogPost(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data && publishedNow(data) ? data : null;
}
