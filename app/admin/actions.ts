'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireCrewRole, requireOwner, requireAdmin } from '@/lib/auth';
import { translateWithGoogle } from '@/lib/translation';
import { cleanHtml } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';
import { logActivity } from '@/lib/activity-logger';

const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();
const optional = (formData: FormData, name: string) => text(formData, name) || null;

const sanitizeLanguages = (formData: FormData, field: string) => ({
  en: cleanHtml(text(formData, field + '_en')),
  km: cleanHtml(text(formData, field + '_km')),
  zh: cleanHtml(text(formData, field + '_zh')),
});

const languages = (formData: FormData, field: string) => ({
  en: text(formData, field + '_en'),
  km: text(formData, field + '_km'),
  zh: text(formData, field + '_zh'),
});

function slugify(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function fallbackLocalized(value: ReturnType<typeof languages>, fallback: ReturnType<typeof languages>) {
  return { en: value.en || fallback.en, km: value.km || fallback.km, zh: value.zh || fallback.zh };
}

async function uploadFile(file: File, bucket: string, flat = false) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedMimeTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
    throw new Error('Images must be JPG, PNG, SVG or WebP files under 10 MB.');
  }

  const extension = file.type === 'image/png'
    ? 'png'
    : file.type === 'image/webp'
    ? 'webp'
    : file.type === 'image/svg+xml'
    ? 'svg'
    : file.type === 'image/gif'
    ? 'gif'
    : 'jpg';

  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = (flat ? '' : new Date().toISOString().slice(0, 10) + '/') + crypto.randomUUID() + '-' + safeFileName;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;
  return path;
}

async function uploadImage(formData: FormData, field: string, bucket: string, flat = false) {
  const file = formData.get(field);
  return file instanceof File && file.size > 0 ? uploadFile(file, bucket, flat) : null;
}

async function uploadImages(formData: FormData, field: string, bucket: string) {
  return Promise.all(
    formData.getAll(field).filter((file): file is File => file instanceof File && file.size > 0).map((file) => uploadFile(file, bucket))
  );
}

export async function login(_previous: { error?: string }, formData: FormData) {
  const email = text(formData, 'email').toLowerCase();
  const password = String(formData.get('password') ?? '');

  const rateCheck = rateLimit({ key: `login:${email}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rateCheck.success) {
    return { error: 'Too many failed login attempts. Please try again in 15 minutes.' };
  }

  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse({ email, password });
  if (!parsed.success) return { error: 'Invalid email address or password format.' };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: 'Invalid login credentials or unauthorized account.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile || profile.status === 'disabled') {
    await supabase.auth.signOut();
    return { error: 'Account has been disabled or is no longer active.' };
  }

  await logActivity({
    action: 'login',
    targetType: 'user',
    targetId: data.user.id,
  });

  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await logActivity({
      action: 'logout',
      targetType: 'user',
      targetId: user.id,
    });
  }
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function saveService(formData: FormData) {
  const { user, profile } = await requireCrewRole(['owner', 'admin', 'editor']);
  const supabase = await createClient();
  const id = text(formData, 'id');

  const existing = id ? await supabase.from('services').select('cover_image,gallery,published_at').eq('id', Number(id)).maybeSingle() : { data: null };
  const cover = await uploadImage(formData, 'cover_image', 'services');
  const gallery = [...(existing.data?.gallery ?? []), ...(await uploadImages(formData, 'gallery_images', 'services'))];
  const title = languages(formData, 'title');
  const description = languages(formData, 'description');
  const content = sanitizeLanguages(formData, 'content');
  const seoTitle = fallbackLocalized(languages(formData, 'seo_title'), title);
  const seoDescription = fallbackLocalized(languages(formData, 'seo_description'), description);
  const isPublished = formData.get('is_published') === 'on';

  const record = {
    slug: slugify(text(formData, 'slug') || title.en),
    title,
    description,
    content,
    cover_image: cover ?? existing.data?.cover_image ?? null,
    gallery,
    display_order: Number(text(formData, 'display_order') || 0),
    is_published: isPublished,
    published_at: isPublished ? existing.data?.published_at ?? new Date().toISOString() : null,
    seo_title: seoTitle,
    seo_description: seoDescription,
    image_alt: languages(formData, 'image_alt'),
    tags: text(formData, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean),
  };

  const result = id ? await supabase.from('services').update(record).eq('id', Number(id)) : await supabase.from('services').insert(record);
  if (result.error) throw result.error;

  if (cover && existing.data?.cover_image) await supabase.storage.from('services').remove([existing.data.cover_image]);

  await logActivity({
    action: id ? 'update_service' : 'create_service',
    targetType: 'service',
    targetId: id || undefined,
    details: { slug: record.slug, is_published: isPublished },
  });

  redirect('/admin/services');
}

export async function saveProject(formData: FormData) {
  const { user } = await requireCrewRole(['owner', 'admin', 'editor']);
  const supabase = await createClient();
  const id = text(formData, 'id');

  const existing = id ? await supabase.from('projects').select('cover_image,gallery,published_at').eq('id', Number(id)).maybeSingle() : { data: null };
  const cover = await uploadImage(formData, 'cover_image', 'projects');
  const gallery = [...(existing.data?.gallery ?? []), ...(await uploadImages(formData, 'gallery_images', 'projects'))];
  const title = languages(formData, 'title');
  const description = languages(formData, 'description');
  const content = sanitizeLanguages(formData, 'content');
  const seoTitle = fallbackLocalized(languages(formData, 'seo_title'), title);
  const seoDescription = fallbackLocalized(languages(formData, 'seo_description'), description);
  const isPublished = formData.get('is_published') === 'on';

  const record = {
    slug: slugify(text(formData, 'slug') || title.en),
    title,
    description,
    content,
    category: optional(formData, 'category'),
    client_name: optional(formData, 'client_name'),
    location: optional(formData, 'location'),
    event_date: optional(formData, 'event_date'),
    cover_image: cover ?? existing.data?.cover_image ?? null,
    gallery,
    display_order: Number(text(formData, 'display_order') || 0),
    is_featured: formData.get('is_featured') === 'on',
    is_published: isPublished,
    published_at: isPublished ? existing.data?.published_at ?? new Date().toISOString() : null,
    seo_title: seoTitle,
    seo_description: seoDescription,
    image_alt: languages(formData, 'image_alt'),
    tags: text(formData, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean),
  };

  const result = id ? await supabase.from('projects').update(record).eq('id', Number(id)) : await supabase.from('projects').insert(record);
  if (result.error) throw result.error;

  if (cover && existing.data?.cover_image) await supabase.storage.from('projects').remove([existing.data.cover_image]);

  await logActivity({
    action: id ? 'update_project' : 'create_project',
    targetType: 'project',
    targetId: id || undefined,
    details: { slug: record.slug, is_published: isPublished },
  });

  redirect('/admin/projects');
}

export async function saveBlog(formData: FormData) {
  const { user } = await requireCrewRole(['owner', 'admin', 'editor']);
  const supabase = await createClient();
  const id = text(formData, 'id');

  const existing = id ? await supabase.from('blog_posts').select('cover_image,published_at').eq('id', Number(id)).maybeSingle() : { data: null };
  const cover = await uploadImage(formData, 'cover_image', 'blog');
  const title = languages(formData, 'title');
  const excerpt = languages(formData, 'excerpt');
  const content = sanitizeLanguages(formData, 'content');
  const seoTitle = fallbackLocalized(languages(formData, 'seo_title'), title);
  const seoDescription = fallbackLocalized(languages(formData, 'seo_description'), excerpt);
  const isPublished = formData.get('is_published') === 'on';

  const record = {
    slug: slugify(text(formData, 'slug') || title.en),
    title,
    excerpt,
    content,
    category: optional(formData, 'category'),
    tags: text(formData, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean),
    author_name: optional(formData, 'author_name'),
    cover_image: cover ?? existing.data?.cover_image ?? null,
    is_published: isPublished,
    published_at: isPublished ? existing.data?.published_at ?? new Date().toISOString() : null,
    seo_title: seoTitle,
    seo_description: seoDescription,
    image_alt: languages(formData, 'image_alt'),
  };

  const result = id ? await supabase.from('blog_posts').update(record).eq('id', Number(id)) : await supabase.from('blog_posts').insert(record);
  if (result.error) throw result.error;

  if (cover && existing.data?.cover_image) await supabase.storage.from('blog').remove([existing.data.cover_image]);

  await logActivity({
    action: id ? 'update_blog' : 'create_blog',
    targetType: 'blog_post',
    targetId: id || undefined,
    details: { slug: record.slug, is_published: isPublished },
  });

  redirect('/admin/blog');
}

export async function removeContent(table: 'services' | 'projects' | 'blog_posts', id: string) {
  await requireCrewRole(['owner', 'admin', 'editor']);
  const supabase = await createClient();
  const bucket = table === 'blog_posts' ? 'blog' : table;

  const existing = table === 'services'
    ? await supabase.from('services').select('cover_image,gallery').eq('id', Number(id)).maybeSingle()
    : table === 'projects'
    ? await supabase.from('projects').select('cover_image,gallery').eq('id', Number(id)).maybeSingle()
    : await supabase.from('blog_posts').select('cover_image').eq('id', Number(id)).maybeSingle();

  const result = table === 'services'
    ? await supabase.from('services').delete().eq('id', Number(id))
    : table === 'projects'
    ? await supabase.from('projects').delete().eq('id', Number(id))
    : await supabase.from('blog_posts').delete().eq('id', Number(id));

  if (result.error) throw result.error;

  const existingData = existing.data as { cover_image: string | null; gallery?: string[] } | null;
  const files = [existingData?.cover_image, ...(existingData?.gallery ?? [])].filter((file): file is string => Boolean(file));
  if (files.length) await supabase.storage.from(bucket).remove(files);

  await logActivity({
    action: 'delete_content',
    targetType: table,
    targetId: id,
  });

  redirect('/admin/' + (table === 'blog_posts' ? 'blog' : table));
}

export async function updateQuotation(id: string, formData: FormData) {
  await requireCrewRole(['owner', 'admin', 'editor', 'viewer']);
  const supabase = await createClient();

  const status = text(formData, 'status') as 'new' | 'contacted' | 'completed' | 'archived';
  const internal_notes = optional(formData, 'internal_notes');

  const { error } = await supabase.from('quotations').update({
    status,
    internal_notes,
    is_read: true,
  }).eq('id', id);

  if (error) throw error;

  await logActivity({
    action: 'update_quotation',
    targetType: 'quotation',
    targetId: id,
    details: { status },
  });

  redirect('/admin/quotations');
}

export async function saveSettings(formData: FormData) {
  await requireCrewRole(['owner', 'admin']);
  const supabase = await createClient();

  const keys = [
    'company_name',
    'company_email',
    'phone',
    'phone_secondary',
    'office_address',
    'working_hours',
    'telegram',
    'facebook',
    'instagram',
    'tiktok',
    'linkedin',
    'youtube',
    'site_title',
    'site_description',
    'inquiry_notification_email',
    'google_analytics_id',
  ];

  const entries = keys.map((key) => ({ key, value: text(formData, key) }));
  const { error } = await supabase.from('site_settings').upsert(entries);
  if (error) throw error;

  await logActivity({
    action: 'update_settings',
    targetType: 'site_settings',
  });

  redirect('/admin/settings');
}

export async function saveAnnouncement(formData: FormData) {
  await requireCrewRole(['owner', 'admin']);
  const supabase = await createClient();

  const title = languages(formData, 'title');
  const link = text(formData, 'link') || '/contact';
  const is_active = formData.get('is_active') === 'on';

  const { data: existing } = await supabase.from('announcements').select('id').limit(1).maybeSingle();
  const id = existing?.id || crypto.randomUUID();

  const { error } = await supabase.from('announcements').upsert({
    id,
    title,
    link,
    is_active,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;

  await logActivity({
    action: 'update_announcement',
    targetType: 'announcement',
    targetId: id,
    details: { is_active },
  });

  redirect('/admin/announcements');
}

export async function toggleAnnouncement(id: string, active: boolean) {
  await requireCrewRole(['owner', 'admin']);
  const supabase = await createClient();

  const { error } = await supabase.from('announcements').update({ is_active: active }).eq('id', id);
  if (error) throw error;

  await logActivity({
    action: 'toggle_announcement',
    targetType: 'announcement',
    targetId: id,
    details: { active },
  });

  redirect('/admin/announcements');
}

export async function uploadMedia(formData: FormData) {
  await requireCrewRole(['owner', 'admin', 'editor']);
  const path = await uploadImage(formData, 'file', 'cms-media', true);

  await logActivity({
    action: 'upload_media',
    targetType: 'media',
    details: { path },
  });

  redirect('/admin/media');
}

export async function deleteMedia(path: string) {
  await requireCrewRole(['owner', 'admin', 'editor']);
  const { error } = await (await createClient()).storage.from('cms-media').remove([path]);
  if (error) throw error;

  await logActivity({
    action: 'delete_media',
    targetType: 'media',
    details: { path },
  });

  redirect('/admin/media');
}

export async function translateField(source: string, target: 'km' | 'zh', format: 'text' | 'html') {
  await requireCrewRole(['owner', 'admin', 'editor']);
  if (!source.trim()) return { value: '' };

  const supabase = await createClient();
  const cacheKey = await crypto.subtle
    .digest('SHA-256', new TextEncoder().encode([source, target, format].join('\n')))
    .then((bytes) => Buffer.from(bytes).toString('hex'));

  const cached = await supabase.from('translation_cache').select('translated_text').eq('cache_key', cacheKey).maybeSingle();
  if (cached.data?.translated_text) return { value: cached.data.translated_text };

  const translated = await translateWithGoogle(source, target, format);
  await supabase.from('translation_cache').upsert({
    cache_key: cacheKey,
    source_text: source,
    translated_text: translated,
    target_locale: target,
    format,
  });

  return { value: translated };
}
