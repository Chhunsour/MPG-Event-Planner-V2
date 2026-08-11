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
  console.log('Updating database records with Cambodian event photo galleries and rich section content...');

  const services = [
    {
      slug: 'grand-opening',
      gallery: ['/images/mpg/grand-opening-feature.png', '/images/mpg/project-1.png', '/images/mpg/project-2.png'],
      content: {
        en: '<h2>Grand Opening Ceremony in Cambodia</h2><p>Complete production, VIP protocol, ribbon-cutting setup, custom decoration, and stage choreography tailored for Phnom Penh landmarks and nationwide venues.</p><figure><img src="/images/mpg/grand-opening-feature.png" alt="VIP Ribbon Cutting Setup in Phnom Penh" /><figcaption>VIP Ribbon Cutting & Protocol Setup, Phnom Penh</figcaption></figure>',
        km: '<h2>ពិធីបើកសម្ពោធជាផ្លូវការនៅកម្ពុជា</h2><p>ផលិតកម្មពេញលេញ ពិធីការភ្ញៀវកិត្តិយស ការរៀបចំកាត់ខ្សែបូ ការតុបតែងតាមតម្រូវការ និងការរៀបចំឆាក។</p>',
        zh: '<h2>柬埔寨开业剪彩典礼全案制作</h2><p>全案制作、贵宾礼仪、剪彩布置、定制装饰与舞台流程编排。</p>'
      }
    },
    {
      slug: 'product-launch',
      gallery: ['/images/mpg/project-5.png', '/images/mpg/project-3.png', '/images/mpg/project-4.png'],
      content: {
        en: '<h2>Product & Sales Launch Events</h2><p>Impactful launch campaigns, experiential setups, and creative media events to boost market entry in Phnom Penh and major provinces.</p><figure><img src="/images/mpg/project-5.png" alt="Product Launch Stage Screen Installation" /><figcaption>LED Screen & Presentation Stage Fabrication, Phnom Penh</figcaption></figure>',
        km: '<h2>ការបើកដំណើរការផលិតផល</h2><p>យុទ្ធនាការបើកដំណើរការដ៏មានឥទ្ធិពល ការរៀបចំបទពិសោធន៍ និងកម្មវិធីប្រព័ន្ធផ្សព្វផ្សាយប្រកបដោយភាពច្នៃប្រឌិត។</p>',
        zh: '<h2>新品与销售发布会</h2><p>具有影响力的发布活动、体验式布置与创意媒体活动，助力产品进入市场。</p>'
      }
    },
    {
      slug: 'groundbreaking',
      gallery: ['/images/mpg/service-groundbreaking.webp', '/images/mpg/hero-backstage-v2.png', '/images/mpg/project-6.png'],
      content: {
        en: '<h2>Groundbreaking Ceremony Logistics</h2><p>Professional logistics for construction milestone ceremonies, complete with safety protocols and grand stage building across Cambodia.</p><figure><img src="/images/mpg/hero-backstage-v2.png" alt="Cambodian Event Production Crew Backstage" /><figcaption>On-site Rigging & Marquee Structure Building, Cambodia</figcaption></figure>',
        km: '<h2>ពិធីជ្រលងគ្រឹះ</h2><p>ការរៀបចំដឹកជញ្ជូនប្រកបដោយវិជ្ជាជីវៈសម្រាប់ពិធីសម្គាល់គម្រោងសំណង់ ព្រមទាំងវិធានការសុវត្ថិភាព និងការសាងសង់ឆាក។</p>',
        zh: '<h2>奠基仪式</h2><p>为工程节点仪式提供专业统筹，包含安全措施与舞台搭建。</p>'
      }
    },
    {
      slug: 'roadshow-exhibition',
      gallery: ['/images/mpg/service-roadshow.webp', '/images/mpg/project-8.png', '/images/mpg/project-4.png'],
      content: {
        en: '<h2>Roadshow & Exhibition Production</h2><p>Custom exhibition booth construction, mall activations, and mobile roadshow coordination across major provinces in Cambodia.</p><figure><img src="/images/mpg/project-8.png" alt="Exhibition Booth Fabrication" /><figcaption>Custom Trade Exhibition Booth Fabrication, Phnom Penh</figcaption></figure>',
        km: '<h2>រ៉ូដសូ និងពិព័រណ៍</h2><p>ការសាងសង់ស្តង់ពិព័រណ៍តាមតម្រូវការ សកម្មភាពនៅផ្សារទំនើប និងការសម្របសម្រួលរ៉ូដសូតាមខេត្តសំខាន់ៗ។</p>',
        zh: '<h2>路演与展览</h2><p>定制展位搭建、商场活动，以及覆盖主要省份的路演统筹。</p>'
      }
    },
    {
      slug: 'seminar-corporate',
      gallery: ['/images/mpg/service-seminar.webp', '/images/mpg/project-7.png', '/images/mpg/about-team.png'],
      content: {
        en: '<h2>Seminar & Corporate Event Planning</h2><p>Conferences, annual general meetings, gala dinners, team building, and professional business forums in Phnom Penh.</p><figure><img src="/images/mpg/project-7.png" alt="Corporate Gala Dinner Setup" /><figcaption>Corporate Banquet & Gala Stage Production, Phnom Penh</figcaption></figure>',
        km: '<h2>សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម</h2><p>សន្និសីទ អង្គប្រជុំសាមញ្ញប្រចាំឆ្នាំ ពិធីជប់លៀងអាហារពេលល្ងាច សកម្មភាពស្អាងក្រុម និងវេទិកាអាជីវកម្ម។</p>',
        zh: '<h2>研讨会与企业活动</h2><p>会议、股东年会、晚宴、团队建设与商务论坛。</p>'
      }
    },
    {
      slug: 'equipment-rental',
      gallery: ['/images/mpg/service-rental.webp', '/images/mpg/project-3.png', '/images/mpg/project-5.png'],
      content: {
        en: '<h2>Event AV Equipment Rental in Cambodia</h2><p>Premium indoor/outdoor LED walls, concert-grade line array sound systems, intelligent lighting rigs, stage structures, and VIP tents.</p><figure><img src="/images/mpg/project-3.png" alt="Concert Sound and Lighting Rigging" /><figcaption>Line Array Sound & Intelligent Lighting Truss Setup, Cambodia</figcaption></figure>',
        km: '<h2>ការជួលឧបករណ៍កម្មវិធី</h2><p>អេក្រង់ LED គុណភាពខ្ពស់ ប្រព័ន្ធសំឡេង និងពន្លឺជាអាជីព រចនាសម្ព័ន្ធឆាក កៅអីភ្ញៀវកិត្តិយស និងតង់។</p>',
        zh: '<h2>活动设备租赁</h2><p>高清 LED 屏幕、专业音响与灯光设备、舞台结构、贵宾座椅与篷房。</p>'
      }
    }
  ];

  for (const s of services) {
    const { error } = await supabase.from('services').update({ gallery: s.gallery, content: s.content }).eq('slug', s.slug);
    if (error) console.error(`Error updating service ${s.slug}:`, error.message);
  }

  const projects = [
    {
      slug: 'outdoor-grand-opening',
      gallery: ['/images/mpg/grand-opening-feature.png', '/images/mpg/project-1.png', '/images/mpg/project-2.png'],
      content: {
        en: '<h2>Outdoor Grand Opening Ceremony Production</h2><p>Entrance arch, red carpet, ribbon cutting, guest seating and sound system in Phnom Penh.</p><figure><img src="/images/mpg/grand-opening-feature.png" alt="Grand Opening Entrance Arch" /><figcaption>Grand Opening Entrance Arch & Red Carpet Pathway, Phnom Penh</figcaption></figure>',
        km: '<h2>ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ</h2><p>ខ្លោងទ្វារចូល ព្រំក្រហម ការកាត់ខ្សែបូ កៅអីភ្ញៀវ និងសំឡេង</p>',
        zh: '<h2>户外开业剪彩典礼</h2><p>入口拱门、红毯、剪彩、来宾座位与音响</p>'
      }
    },
    {
      slug: 'corporate-headquarters-opening',
      gallery: ['/images/mpg/grand-opening-editorial-v2.png', '/images/mpg/project-2.png', '/images/mpg/project-3.png'],
      content: {
        en: '<h2>Corporate Headquarters Opening Ceremony</h2><p>Stage backdrop, floral arch, ribbon-cutting setup and guest seating in Phnom Penh business tower.</p><figure><img src="/images/mpg/project-2.png" alt="Corporate Entrance Backdrop" /><figcaption>Custom Branded Floral Portal & Backdrop, Phnom Penh</figcaption></figure>',
        km: '<h2>ពិធីបើកសម្ពោធការិយាល័យកណ្តាល</h2><p>ផ្ទាំងឆាក ខ្លោងទ្វារផ្កា ការរៀបចំកាត់ខ្សែបូ និងកៅអីភ្ញៀវ</p>',
        zh: '<h2>企业总部开业典礼</h2><p>舞台背景板、花艺拱门、剪彩布置与来宾座位</p>'
      }
    },
    {
      slug: 'corporate-ceremony',
      gallery: ['/images/mpg/project-7.png', '/images/mpg/contact-quote.webp', '/images/mpg/about-team.png'],
      content: {
        en: '<h2>Corporate Ceremony & Awards Night</h2><p>Stage build, lighting design, sound and programme management in Phnom Penh ballroom.</p><figure><img src="/images/mpg/project-7.png" alt="Corporate Gala Stage Lighting" /><figcaption>Corporate Awards Gala Dinner Stage & Lighting, Phnom Penh</figcaption></figure>',
        km: '<h2>ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់</h2><p>ការសាងសង់ឆាក ការរចនាពន្លឺ សំឡេង និងការគ្រប់គ្រងកម្មវិធី</p>',
        zh: '<h2>企业典礼与颁奖之夜</h2><p>舞台搭建、灯光设计、音响与流程管理</p>'
      }
    },
    {
      slug: 'product-launch-stage',
      gallery: ['/images/mpg/project-5.png', '/images/mpg/service-product-launch.png', '/images/mpg/project-4.png'],
      content: {
        en: '<h2>Product Launch Stage Build</h2><p>Launch stage, LED wall, lighting and presentation sound in Phnom Penh.</p><figure><img src="/images/mpg/project-5.png" alt="High Tech Product Launch Screen Setup" /><figcaption>Interactive Product Launch Stage & LED Screen Installation</figcaption></figure>',
        km: '<h2>ឆាកបើកដំណើរការផលិតផល</h2><p>ឆាកបើកដំណើរការ អេក្រង់ LED ពន្លឺ និងសំឡេងបទបង្ហាញ</p>',
        zh: '<h2>新品发布舞台</h2><p>发布舞台、LED 屏幕、灯光与演讲音响</p>'
      }
    },
    {
      slug: 'conference-summit',
      gallery: ['/images/mpg/service-seminar.webp', '/images/mpg/project-6.png', '/images/mpg/about-team.png'],
      content: {
        en: '<h2>Conference & Business Summit Production</h2><p>Wide LED screen, stage lighting, conference sound and seating in Phnom Penh.</p><figure><img src="/images/mpg/service-seminar.webp" alt="Business Conference Stage Presentation" /><figcaption>Business Forum Keynote Stage & Sound Setup, Phnom Penh</figcaption></figure>',
        km: '<h2>សន្និសីទ និងវេទិកាអាជីវកម្ម</h2><p>អេក្រង់ LED ធំ ពន្លឺឆាក សំឡេងសន្និសីទ និងកៅអី</p>',
        zh: '<h2>会议与商务峰会</h2><p>宽幅 LED 屏幕、舞台灯光、会议音响与座位</p>'
      }
    },
    {
      slug: 'exhibition-build',
      gallery: ['/images/mpg/service-roadshow.webp', '/images/mpg/project-8.png', '/images/mpg/project-4.png'],
      content: {
        en: '<h2>Exhibition Booth Fabrication</h2><p>Custom booth construction, LED banner, displays and branding in Phnom Penh trade halls.</p><figure><img src="/images/mpg/project-8.png" alt="Exhibition Pavilion Build" /><figcaption>Custom Double-sided Exhibition Booth Build, Phnom Penh</figcaption></figure>',
        km: '<h2>ការសាងសង់ស្តង់ពិព័រណ៍</h2><p>ការសាងសង់ស្តង់តាមតម្រូវការ បដា LED ការតាំងបង្ហាញ និងម៉ាកយីហោ</p>',
        zh: '<h2>展览展位搭建</h2><p>定制展位搭建、LED 横幅、展示与品牌视觉</p>'
      }
    }
  ];

  for (const p of projects) {
    const { error } = await supabase.from('projects').update({ gallery: p.gallery, content: p.content }).eq('slug', p.slug);
    if (error) console.error(`Error updating project ${p.slug}:`, error.message);
  }

  const blogPosts = [
    {
      slug: 'planning-a-landmark-grand-opening',
      content: {
        en: '<h2>Planning a Landmark Grand Opening in Phnom Penh</h2><p>The practical decisions behind guest flow, ribbon cutting, stage sightlines and a calm show day.</p><figure><img src="/images/mpg/grand-opening-editorial-v2.png" alt="Phnom Penh Grand Opening Event Management" /><figcaption>Stage Sightlines & Guest Flow Coordination, Phnom Penh</figcaption></figure><p>From VIP arrivals to speech timing and ribbon-cutting synchronization, careful planning ensures an effortless experience for honored guests and media representatives alike.</p>',
        km: '<h2>ការរៀបចំពិធីបើកសម្ពោធដ៏សំខាន់នៅភ្នំពេញ</h2><p>ការសម្រេចចិត្តសំខាន់ៗសម្រាប់លំហូរភ្ញៀវ ការកាត់ខ្សែបូ ឆាក និងថ្ងៃកម្មវិធីដ៏រលូន។</p>',
        zh: '<h2>如何在金边策划一场标志性的开业典礼</h2><p>从宾客动线、剪彩到舞台视线，拆解一场从容活动日背后的关键决策。</p>'
      }
    },
    {
      slug: 'lighting-sound-and-the-room',
      content: {
        en: '<h2>How Lighting and Sound Change the Room</h2><p>A field guide to clear speech, deliberate lighting cues and production that supports the programme.</p><figure><img src="/images/mpg/project-3.png" alt="Sound Rigs and Lighting Control in Cambodia" /><figcaption>Concert Sound Console & Moving Head Lighting Calibration</figcaption></figure><p>Proper acoustic tuning and warm ambient lighting create an engaging atmosphere that reinforces key messaging throughout corporate keynotes and award presentations.</p>',
        km: '<h2>របៀបដែលពន្លឺ និងសំឡេងផ្លាស់ប្តូរបរិយាកាស</h2><p>មគ្គុទ្ទេសក៍សម្រាប់សំឡេងច្បាស់ ពន្លឺត្រឹមត្រូវ និងផលិតកម្មដែលគាំទ្រកម្មវិធី។</p>',
        zh: '<h2>灯光与声音如何改变整个空间</h2><p>一份关于清晰扩声、精准灯光提示与流程配合的现场指南。</p>'
      }
    },
    {
      slug: 'taking-an-event-beyond-phnom-penh',
      content: {
        en: '<h2>Taking an Event Beyond Phnom Penh</h2><p>What changes when the crew, stage and equipment need to move across Cambodia.</p><figure><img src="/images/mpg/hero-backstage-v2.png" alt="Cambodian Production Logistics and Mobile Rigging" /><figcaption>Mobile Rigging & Production Crew Deployment, Siem Reap & Provinces</figcaption></figure><p>Deploying technical teams and heavy equipment across Siem Reap, Sihanoukville, and Battambang requires robust transportation logistics and power redundancy.</p>',
        km: '<h2>ការរៀបចំព្រឹត្តិការណ៍ក្រៅរាជធានីភ្នំពេញ</h2><p>អ្វីដែលត្រូវរៀបចំ នៅពេលក្រុមការងារ ឆាក និងឧបករណ៍ត្រូវធ្វើដំណើរទូទាំងកម្ពុជា។</p>',
        zh: '<h2>把活动带到金边以外</h2><p>当团队、舞台和设备需要走遍柬埔寨时，制作方案会有哪些变化。</p>'
      }
    }
  ];

  for (const b of blogPosts) {
    const { error } = await supabase.from('blog_posts').update({ content: b.content }).eq('slug', b.slug);
    if (error) console.error(`Error updating blog post ${b.slug}:`, error.message);
  }

  console.log('Galleries and section content updated with authentic Cambodian photography successfully!');
}

main().catch(err => console.error(err));
