import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Locale, BlogPost, Project, Service } from '@/lib/types';
import { createPublicClient } from '@/lib/supabase/public';
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
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  footer_text: { en: string; km: string; zh: string };
};

export const defaultSettings: SiteSettings = {
  company_name: 'MPG Event Planner',
  company_email: 'hello@mpgeventplanner.com',
  phone: '+855 12 345 678',
  phone_secondary: '+855 98 765 432',
  office_address: 'Phnom Penh, Cambodia',
  working_hours: 'Monday – Saturday: 8:00 AM – 6:00 PM',
  telegram: 'https://t.me/mpgeventplanner',
  facebook: 'https://facebook.com/mpgeventplanner',
  instagram: 'https://instagram.com/mpgeventplanner',
  tiktok: 'https://tiktok.com/@mpgeventplanner',
  linkedin: 'https://linkedin.com/company/mpgeventplanner',
  footer_text: {
    en: 'Professional event planning, grand opening ceremonies, corporate events, and venue production in Phnom Penh, Cambodia.',
    km: 'សេវាកម្មរៀបចំកម្មវិធី សាជីវកម្ម ពិធីបើកសម្ពោធ ការដំឡើងឆាក និងឧបករណ៍បច្ចេកវិទ្យាគ្រប់ប្រភេទនៅកម្ពុជា។',
    zh: '金边及柬埔寨全国首选的企业活动策划、开业典礼、舞台设计与音响灯光设备租赁服务。',
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('site_settings').select('key,value');
  if (error || !data) return defaultSettings;
  const values = Object.fromEntries(data.map((row) => [row.key, typeof row.value === 'string' ? row.value : '']));
  return { ...defaultSettings, ...values };
}

export type Announcement = {
  id: string | number;
  title: { en?: string; km?: string; zh?: string };
  link: string;
  is_active: boolean;
};

export async function getAnnouncement(): Promise<Announcement | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('announcements').select('*').eq('is_active', true).maybeSingle();
  if (error || !data) return null;
  const rawTitle = (data.title || {}) as Record<string, string>;
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
  const supabase = createPublicClient();
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
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data && publishedNow(data) ? data : null;
}

export async function getProject(slug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data && publishedNow(data) ? data : null;
}

export async function getBlogPost(slug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data && publishedNow(data) ? data : null;
}
