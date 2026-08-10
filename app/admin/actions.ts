'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { translateWithGoogle } from '@/lib/translation';
import type { Json } from '@/lib/types';

const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();
const optional = (formData: FormData, name: string) => text(formData, name) || null;
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
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error('Images must be JPG, PNG or WebP files under 10 MB.');
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = (flat ? '' : new Date().toISOString().slice(0, 10) + '/') + crypto.randomUUID() + '.' + extension;
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
  if (error) throw error;
  return path;
}

async function uploadImage(formData: FormData, field: string, bucket: string, flat = false) {
  const file = formData.get(field);
  return file instanceof File && file.size > 0 ? uploadFile(file, bucket, flat) : null;
}

async function uploadImages(formData: FormData, field: string, bucket: string) {
  return Promise.all(formData.getAll(field).filter((file): file is File => file instanceof File && file.size > 0).map((file) => uploadFile(file, bucket)));
}

export async function login(_previous: { error?: string }, formData: FormData) {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse({ email: text(formData, 'email'), password: String(formData.get('password') ?? '') });
  if (!parsed.success) return { error: 'Enter a valid email and password.' };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: 'Those credentials do not match an admin account.' };
  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function saveService(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const id = text(formData, 'id');
  const existing = id ? await supabase.from('services').select('cover_image,gallery,published_at').eq('id', Number(id)).maybeSingle() : { data: null };
  const cover = await uploadImage(formData, 'cover_image', 'services');
  const gallery = [...(existing.data?.gallery ?? []), ...await uploadImages(formData, 'gallery_images', 'services')];
  const title = languages(formData, 'title');
  const description = languages(formData, 'description');
  const content = languages(formData, 'content');
  const seoTitle = fallbackLocalized(languages(formData, 'seo_title'), title);
  const seoDescription = fallbackLocalized(languages(formData, 'seo_description'), description);
  const isPublished = formData.get('is_published') === 'on';
  const record = { slug: slugify(text(formData, 'slug') || title.en), title, description, content, cover_image: cover ?? existing.data?.cover_image ?? null, gallery, display_order: Number(text(formData, 'display_order') || 0), is_published: isPublished, published_at: isPublished ? existing.data?.published_at ?? new Date().toISOString() : null, seo_title: seoTitle, seo_description: seoDescription, image_alt: languages(formData, 'image_alt'), tags: text(formData, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean) };
  const result = id ? await supabase.from('services').update(record).eq('id', Number(id)) : await supabase.from('services').insert(record);
  if (result.error) throw result.error;
  if (cover && existing.data?.cover_image) await supabase.storage.from('services').remove([existing.data.cover_image]);
  void user;
  redirect('/admin/services');
}

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = text(formData, 'id');
  const existing = id ? await supabase.from('projects').select('cover_image,gallery,published_at').eq('id', Number(id)).maybeSingle() : { data: null };
  const cover = await uploadImage(formData, 'cover_image', 'projects');
  const gallery = [...(existing.data?.gallery ?? []), ...await uploadImages(formData, 'gallery_images', 'projects')];
  const title = languages(formData, 'title');
  const description = languages(formData, 'description');
  const seoTitle = fallbackLocalized(languages(formData, 'seo_title'), title);
  const seoDescription = fallbackLocalized(languages(formData, 'seo_description'), description);
  const isPublished = formData.get('is_published') === 'on';
  const record = { slug: slugify(text(formData, 'slug') || title.en), title, description, content: languages(formData, 'content'), category: optional(formData, 'category'), client_name: optional(formData, 'client_name'), location: optional(formData, 'location'), event_date: optional(formData, 'event_date'), cover_image: cover ?? existing.data?.cover_image ?? null, gallery, display_order: Number(text(formData, 'display_order') || 0), is_featured: formData.get('is_featured') === 'on', is_published: isPublished, published_at: isPublished ? existing.data?.published_at ?? new Date().toISOString() : null, seo_title: seoTitle, seo_description: seoDescription, image_alt: languages(formData, 'image_alt'), tags: text(formData, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean) };
  const result = id ? await supabase.from('projects').update(record).eq('id', Number(id)) : await supabase.from('projects').insert(record);
  if (result.error) throw result.error;
  if (cover && existing.data?.cover_image) await supabase.storage.from('projects').remove([existing.data.cover_image]);
  redirect('/admin/projects');
}

export async function saveBlog(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = text(formData, 'id');
  const existing = id ? await supabase.from('blog_posts').select('cover_image,published_at').eq('id', Number(id)).maybeSingle() : { data: null };
  const cover = await uploadImage(formData, 'cover_image', 'blog');
  const title = languages(formData, 'title');
  const excerpt = languages(formData, 'excerpt');
  const content = languages(formData, 'content');
  const seoTitle = fallbackLocalized(languages(formData, 'seo_title'), title);
  const seoDescription = fallbackLocalized(languages(formData, 'seo_description'), excerpt);
  const isPublished = formData.get('is_published') === 'on';
  const record = { slug: slugify(text(formData, 'slug') || title.en), title, excerpt, content, category: optional(formData, 'category'), tags: text(formData, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean), author_name: optional(formData, 'author_name'), cover_image: cover ?? existing.data?.cover_image ?? null, is_published: isPublished, published_at: isPublished ? existing.data?.published_at ?? new Date().toISOString() : null, seo_title: seoTitle, seo_description: seoDescription, image_alt: languages(formData, 'image_alt') };
  const result = id ? await supabase.from('blog_posts').update(record).eq('id', Number(id)) : await supabase.from('blog_posts').insert(record);
  if (result.error) throw result.error;
  if (cover && existing.data?.cover_image) await supabase.storage.from('blog').remove([existing.data.cover_image]);
  redirect('/admin/blog');
}

export async function removeContent(table: 'services' | 'projects' | 'blog_posts', id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const bucket = table === 'blog_posts' ? 'blog' : table;
  const existing = table === 'services' ? await supabase.from('services').select('cover_image,gallery').eq('id', Number(id)).maybeSingle() : table === 'projects' ? await supabase.from('projects').select('cover_image,gallery').eq('id', Number(id)).maybeSingle() : await supabase.from('blog_posts').select('cover_image').eq('id', Number(id)).maybeSingle();
  const result = table === 'services' ? await supabase.from('services').delete().eq('id', Number(id)) : table === 'projects' ? await supabase.from('projects').delete().eq('id', Number(id)) : await supabase.from('blog_posts').delete().eq('id', Number(id));
  if (result.error) throw result.error;
  const existingData = existing.data as { cover_image: string | null; gallery?: string[] } | null;
  const files = [existingData?.cover_image, ...(existingData?.gallery ?? [])].filter((file): file is string => Boolean(file));
  if (files.length) await supabase.storage.from(bucket).remove(files);
  redirect('/admin/' + (table === 'blog_posts' ? 'blog' : table));
}

export async function updateQuotation(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('quotations').update({ status: text(formData, 'status') as 'new' | 'contacted' | 'completed' | 'archived', internal_notes: optional(formData, 'internal_notes'), is_read: true }).eq('id', id);
  if (error) throw error;
  redirect('/admin/quotations');
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const values: Record<string, Json> = { company_email: text(formData, 'company_email'), phone: text(formData, 'phone'), telegram: text(formData, 'telegram'), instagram: text(formData, 'instagram'), facebook: text(formData, 'facebook') };
  const { error } = await supabase.from('site_settings').upsert(Object.entries(values).map(([key, value]) => ({ key, value })));
  if (error) throw error;
  redirect('/admin/settings');
}

export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  await uploadImage(formData, 'file', 'cms-media', true);
  redirect('/admin/media');
}

export async function deleteMedia(path: string) {
  await requireAdmin();
  const { error } = await (await createClient()).storage.from('cms-media').remove([path]);
  if (error) throw error;
  redirect('/admin/media');
}

export async function translateField(source: string, target: 'km' | 'zh', format: 'text' | 'html') {
  await requireAdmin();
  if (!source.trim()) return { value: '' };
  const supabase = await createClient();
  const cacheKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode([source, target, format].join('\n'))).then((bytes) => Buffer.from(bytes).toString('hex'));
  const cached = await supabase.from('translation_cache').select('translated_text').eq('cache_key', cacheKey).maybeSingle();
  if (cached.data?.translated_text) return { value: cached.data.translated_text };
  const translated = await translateWithGoogle(source, target, format);
  await supabase.from('translation_cache').upsert({ cache_key: cacheKey, source_text: source, translated_text: translated, target_locale: target, format });
  return { value: translated };
}
