import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and temporary SUPABASE_SERVICE_ROLE_KEY.');

const root = process.cwd();
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const rows = (table) => JSON.parse(execFileSync('sqlite3', ['-json', path.join(root, 'database/database.sqlite'), `select * from ${table};`], { encoding: 'utf8' }));
const localized = (row, prefix) => ({ en: row[`${prefix}_en`] || '', km: row[`${prefix}_km`] || '', zh: row[`${prefix}_zh`] || '' });
const array = (value) => { try { return value ? JSON.parse(value) : []; } catch { return []; } };
const assetNames = {
  'grand_opening.png': 'service-grand-opening.png',
  '01KZB15AZXVTFFD2CV6ZRJSTZX.webp': 'service-product-launch.webp',
  'groundbreaking.png': 'service-groundbreaking.png', '01KZB0YWJ9XAVG25ZTDN6CRRFF.webp': 'service-roadshow.webp', 'seminar.png': 'service-seminar.png', 'equipment.png': 'service-rental.png',
  'project_1.png': 'project-1.png', 'project_2.png': 'project-2.png', 'project_3.png': 'project-3.png', 'project_4.png': 'project-4.png',
  'project_5.png': 'project-5.png', 'project_6.png': 'project-6.png', 'project_7.png': 'project-7.png', 'project_8.png': 'project-8.png', '01KZB1FG35W4Z660KJE9QTF65H.webp': 'project-7.png',
  '01KZB0TB8SDW0TSCNBF0NKAF3Y.webp': 'hero-main.webp', 'post_1.png': 'project-1.webp', 'post_2.png': 'service-seminar.png', 'post_3.png': 'service-roadshow.png', 'post_4.png': 'service-rental.png',
};

async function upload(bucket, legacyPath) {
  const filename = assetNames[path.basename(legacyPath || '')] || path.basename(legacyPath || '');
  if (!filename) return null;
  const file = path.join(root, 'public/images/mpg', filename);
  try { const body = await readFile(file); const extension = path.extname(filename).toLowerCase(); const type = extension === '.webp' ? 'image/webp' : extension === '.png' ? 'image/png' : 'image/jpeg'; const storagePath = 'legacy/' + filename; const result = await supabase.storage.from(bucket).upload(storagePath, body, { contentType: type, upsert: true }); if (result.error) throw result.error; return storagePath; } catch { return null; }
}

async function main() {
  for (const row of rows('services')) {
    const cover = await upload('services', row.image);
    const record = { slug: row.slug, title: localized(row, 'title'), description: localized(row, 'short_description'), content: localized(row, 'description'), cover_image: cover, gallery: [], display_order: row.display_order || 0, is_published: Boolean(row.is_published), published_at: row.published_at, seo_title: localized(row, 'seo_title'), seo_description: localized(row, 'seo_description'), image_alt: localized(row, 'image_alt'), tags: array(row.tags) };
    const { error } = await supabase.from('services').upsert(record, { onConflict: 'slug' }); if (error) throw error;
  }
  for (const row of rows('projects')) {
    const cover = await upload('projects', row.cover_image);
    const record = { slug: row.slug, title: localized(row, 'title'), description: localized(row, 'short_description'), content: localized(row, 'description'), category: row.category || row.event_type, client_name: row.client_name || null, location: row.location || null, event_date: row.event_date || null, cover_image: cover, gallery: [], display_order: row.display_order || 0, is_featured: Boolean(row.is_featured), is_published: Boolean(row.is_published), published_at: row.published_at, seo_title: localized(row, 'seo_title'), seo_description: localized(row, 'seo_description'), image_alt: localized(row, 'cover_image_alt'), tags: array(row.tags) };
    const { error } = await supabase.from('projects').upsert(record, { onConflict: 'slug' }); if (error) throw error;
  }
  for (const row of rows('blog_posts')) {
    const cover = await upload('blog', row.cover_image);
    const record = { slug: row.slug, title: localized(row, 'title'), excerpt: localized(row, 'excerpt'), content: localized(row, 'body'), cover_image: cover, category: row.category || null, tags: array(row.tags), author_name: row.author_name || null, is_published: Boolean(row.is_published), published_at: row.published_at, seo_title: localized(row, 'seo_title'), seo_description: localized(row, 'seo_description'), image_alt: localized(row, 'cover_image_alt') };
    const { error } = await supabase.from('blog_posts').upsert(record, { onConflict: 'slug' }); if (error) throw error;
  }
  for (const row of rows('quotation_requests')) {
    if (/test|example\.com/i.test(`${row.customer_name} ${row.email || ''} ${row.additional_information || ''}`)) continue;
    const record = { customer_name: row.customer_name, company_name: row.company_name || null, phone: row.phone, email: row.email || null, preferred_contact_method: row.preferred_contact_method, event_type: row.event_type, event_date: row.event_date || null, event_location: row.event_location, estimated_guests: row.estimated_guests || null, estimated_budget: row.estimated_budget || null, required_services: array(row.required_services), additional_information: row.additional_information || null, language: ['en', 'km', 'zh'].includes(row.language) ? row.language : 'en', status: ['new', 'contacted', 'completed', 'archived'].includes(row.status) ? row.status : 'new', is_read: Boolean(row.is_read), internal_notes: row.internal_notes || null, created_at: row.created_at, updated_at: row.updated_at };
    const { error } = await supabase.from('quotations').insert(record); if (error) throw error;
  }
  console.log('Imported legacy services, projects, blog posts, quotations, and available local media.');
}

await main();
