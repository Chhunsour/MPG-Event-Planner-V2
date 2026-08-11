import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Locale, BlogPost, Project, Service } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { localized } from '@/lib/i18n';

export { localized };


function publishedNow<T extends { is_published: boolean; published_at: string | null }>(row: T) {
  return row.is_published && (!row.published_at || new Date(row.published_at).getTime() <= Date.now());
}

export function publicImageUrl(client: SupabaseClient<Database>, bucket: string, path: string | null) {
  if (!path) return null;
  if (path.startsWith('/')) return path;
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export type SiteSettings = {
  company_name: string;
  company_email: string;
  phone: string;
  phone_secondary: string;
  office_address: string;
  working_hours: string;
  telegram: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  site_title: string;
  site_description: string;
  inquiry_notification_email: string;
  google_analytics_id: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    company_name: 'MPG Event Planner',
    company_email: 'hello@mpgeventplanner.com',
    phone: '',
    phone_secondary: '',
    office_address: 'Phnom Penh, Cambodia',
    working_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    telegram: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    site_title: 'MPG Event Planner — Professional Event Planning in Cambodia',
    site_description: 'Grand openings, corporate events, product launches, exhibitions and complete event production across Cambodia.',
    inquiry_notification_email: '',
    google_analytics_id: '',
  };
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').select('key,value');
  if (error || !data) return defaults;
  const values = Object.fromEntries(data.map((row) => [row.key, typeof row.value === 'string' ? row.value : '']));
  return { ...defaults, ...values };
}

export type Announcement = {
  id: string;
  title: { en?: string; km?: string; zh?: string };
  link: string;
  is_active: boolean;
};

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('announcements').select('*').eq('is_active', true).limit(1).maybeSingle();
  if (error || !data) {
    return {
      id: 'default',
      title: {
        en: 'Booking open for 2026 Corporate Ceremonies & Grand Openings across Cambodia!',
        km: 'បើកទទួលការកក់សម្រាប់ការរៀបចំកម្មវិធី និងពិធីបើកសម្ពោធឆ្នាំ ២០២៦!',
        zh: '2026年柬埔寨企业典礼与开业仪式策划现已全面开放预订！',
      },
      link: '/contact',
      is_active: true,
    };
  }

  const rawTitle = data.title && typeof data.title === 'object' && !Array.isArray(data.title)
    ? (data.title as Record<string, string>)
    : {};

  return {
    id: data.id,
    title: {
      en: String(rawTitle.en ?? ''),
      km: String(rawTitle.km ?? ''),
      zh: String(rawTitle.zh ?? ''),
    },
    link: data.link || '/contact',
    is_active: data.is_active ?? true,
  };
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
