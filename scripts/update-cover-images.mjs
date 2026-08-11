import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        process.env[k] = v;
      }
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log('No Supabase credentials in .env.local, skipping DB update.');
  process.exit(0);
}

const supabase = createClient(url, key);

async function main() {
  console.log('Updating database records with new high-quality cover images...');

  const services = [
    { slug: 'grand-opening', cover_image: '/images/mpg/service-grand-opening.png' },
    { slug: 'product-launch', cover_image: '/images/mpg/service-product-launch.png' },
    { slug: 'groundbreaking', cover_image: '/images/mpg/service-groundbreaking.png' },
    { slug: 'roadshow-exhibition', cover_image: '/images/mpg/service-roadshow.png' },
    { slug: 'seminar-corporate', cover_image: '/images/mpg/service-seminar.png' },
    { slug: 'equipment-rental', cover_image: '/images/mpg/service-rental.png' },
  ];

  const projects = [
    { slug: 'outdoor-grand-opening', cover_image: '/images/mpg/project-outdoor-grand-opening.png' },
    { slug: 'corporate-headquarters-opening', cover_image: '/images/mpg/project-corporate-hq-opening.png' },
    { slug: 'corporate-ceremony', cover_image: '/images/mpg/project-corporate-ceremony.png' },
    { slug: 'product-launch-stage', cover_image: '/images/mpg/project-product-launch-stage.png' },
    { slug: 'conference-summit', cover_image: '/images/mpg/project-conference-summit.png' },
    { slug: 'exhibition-build', cover_image: '/images/mpg/project-exhibition-build.png' },
  ];

  const blogPosts = [
    { slug: 'planning-a-landmark-grand-opening', cover_image: '/images/mpg/blog-landmark-grand-opening.png' },
    { slug: 'lighting-sound-and-the-room', cover_image: '/images/mpg/blog-lighting-sound.png' },
    { slug: 'taking-an-event-beyond-phnom-penh', cover_image: '/images/mpg/blog-beyond-phnom-penh.png' },
  ];

  for (const s of services) {
    const { error } = await supabase.from('services').update({ cover_image: s.cover_image }).eq('slug', s.slug);
    if (error) console.error(`Error updating service ${s.slug}:`, error.message);
  }

  for (const p of projects) {
    const { error } = await supabase.from('projects').update({ cover_image: p.cover_image }).eq('slug', p.slug);
    if (error) console.error(`Error updating project ${p.slug}:`, error.message);
  }

  for (const b of blogPosts) {
    const { error } = await supabase.from('blog_posts').update({ cover_image: b.cover_image }).eq('slug', b.slug);
    if (error) console.error(`Error updating blog post ${b.slug}:`, error.message);
  }

  console.log('Database cover images updated successfully!');
}

main().catch(err => console.error(err));
