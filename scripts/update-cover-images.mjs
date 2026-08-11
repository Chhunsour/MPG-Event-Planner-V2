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
  console.log('Updating database records with authentic Cambodian MPG event photography...');

  const services = [
    { slug: 'grand-opening', cover_image: '/images/mpg/grand-opening-editorial-v2.png' },
    { slug: 'product-launch', cover_image: '/images/mpg/service-product-launch.png' },
    { slug: 'groundbreaking', cover_image: '/images/mpg/service-groundbreaking.webp' },
    { slug: 'roadshow-exhibition', cover_image: '/images/mpg/service-roadshow.webp' },
    { slug: 'seminar-corporate', cover_image: '/images/mpg/service-seminar.webp' },
    { slug: 'equipment-rental', cover_image: '/images/mpg/service-rental.webp' },
  ];

  const projects = [
    { slug: 'outdoor-grand-opening', cover_image: '/images/mpg/grand-opening-editorial-v2.png' },
    { slug: 'corporate-headquarters-opening', cover_image: '/images/mpg/grand-opening-feature.png' },
    { slug: 'corporate-ceremony', cover_image: '/images/mpg/contact-quote.webp' },
    { slug: 'product-launch-stage', cover_image: '/images/mpg/project-5.webp' },
    { slug: 'conference-summit', cover_image: '/images/mpg/service-seminar.webp' },
    { slug: 'exhibition-build', cover_image: '/images/mpg/service-roadshow.webp' },
  ];

  const blogPosts = [
    { slug: 'planning-a-landmark-grand-opening', cover_image: '/images/mpg/project-1.webp' },
    { slug: 'lighting-sound-and-the-room', cover_image: '/images/mpg/service-rental.webp' },
    { slug: 'taking-an-event-beyond-phnom-penh', cover_image: '/images/mpg/hero-backstage-v2.png' },
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

  console.log('Database records updated with authentic Cambodian photography successfully!');
}

main().catch(err => console.error(err));
