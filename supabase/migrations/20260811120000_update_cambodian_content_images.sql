-- Migration: Update Services, Projects, and Blog Posts with Authentic Cambodian Event Photography & Galleries
-- File: supabase/migrations/20260811120000_update_cambodian_content_images.sql
-- Description: Run this SQL directly in the Supabase SQL Editor to update all content cover images, galleries, and inline figure sections.

-- 1. UPDATE SERVICES
insert into public.services (
  slug, title, description, content, cover_image, gallery, display_order,
  is_published, published_at, image_alt
)
values
  (
    'grand-opening',
    '{"en":"Grand Opening Ceremony","km":"ពិធីបើកសម្ពោធជាផ្លូវការ","zh":"开业典礼"}'::jsonb,
    '{"en":"Complete production, VIP protocol, ribbon-cutting setup, custom decoration, and stage choreography.","km":"ផលិតកម្មពេញលេញ ពិធីការភ្ញៀវកិត្តិយស ការរៀបចំកាត់ខ្សែបូ ការតុបតែងតាមតម្រូវការ និងការរៀបចំឆាក។","zh":"全案制作、贵宾礼仪、剪彩布置、定制装饰与舞台流程编排。"}'::jsonb,
    '{"en":"<h2>Grand Opening Ceremony in Cambodia</h2><p>Complete production, VIP protocol, ribbon-cutting setup, custom decoration, and stage choreography tailored for Phnom Penh landmarks and nationwide venues.</p><figure><img src=\"/images/mpg/grand-opening-feature.png\" alt=\"VIP Ribbon Cutting Setup in Phnom Penh\" /><figcaption>VIP Ribbon Cutting & Protocol Setup, Phnom Penh</figcaption></figure>","km":"<h2>ពិធីបើកសម្ពោធជាផ្លូវការនៅកម្ពុជា</h2><p>ផលិតកម្មពេញលេញ ពិធីការភ្ញៀវកិត្តិយស ការរៀបចំកាត់ខ្សែបូ ការតុបតែងតាមតម្រូវការ និងការរៀបចំឆាក។</p>","zh":"<h2>柬埔寨开业剪彩典礼全案制作</h2><p>全案制作、贵宾礼仪、剪彩布置、定制装饰与舞台流程编排。</p>"}'::jsonb,
    '/images/mpg/grand-opening-editorial-v2.png',
    array['/images/mpg/grand-opening-feature.png', '/images/mpg/project-1.png', '/images/mpg/project-2.png'],
    0, true, '2026-08-01T00:00:00Z',
    '{"en":"Grand Opening Ceremony in Phnom Penh","km":"ពិធីបើកសម្ពោធជាផ្លូវការ","zh":"开业典礼"}'::jsonb
  ),
  (
    'product-launch',
    '{"en":"Product & Sales Launching","km":"ការបើកដំណើរការផលិតផល","zh":"新品与销售发布会"}'::jsonb,
    '{"en":"Impactful launch campaigns, experiential setups, and creative media events to boost market entry.","km":"យុទ្ធនាការបើកដំណើរការដ៏មានឥទ្ធិពល ការរៀបចំបទពិសោធន៍ និងកម្មវិធីប្រព័ន្ធផ្សព្វផ្សាយប្រកបដោយភាពច្នៃប្រឌិត។","zh":"具有影响力的发布活动、体验式布置与创意媒体活动，助力产品进入市场。"}'::jsonb,
    '{"en":"<h2>Product & Sales Launch Events</h2><p>Impactful launch campaigns, experiential setups, and creative media events to boost market entry in Phnom Penh and major provinces.</p><figure><img src=\"/images/mpg/project-5.png\" alt=\"Product Launch Stage Screen Installation\" /><figcaption>LED Screen & Presentation Stage Fabrication, Phnom Penh</figcaption></figure>","km":"<h2>ការបើកដំណើរការផលិតផល</h2><p>យុទ្ធនាការបើកដំណើរការដ៏មានឥទ្ធិពល ការរៀបចំបទពិសោធន៍ និងកម្មវិធីប្រព័ន្ធផ្សព្វផ្សាយប្រកបដោយភាពច្នៃប្រឌិត។</p>","zh":"<h2>新品与销售发布会</h2><p>具有影响力的发布活动、体验式布置与创意媒体活动，助力产品进入市场。</p>"}'::jsonb,
    '/images/mpg/service-product-launch.png',
    array['/images/mpg/project-5.png', '/images/mpg/project-3.png', '/images/mpg/project-4.png'],
    1, true, '2026-08-01T00:00:00Z',
    '{"en":"Product Launch Event in Cambodia","km":"ការបើកដំណើរការផលិតផល","zh":"新品与销售发布会"}'::jsonb
  ),
  (
    'groundbreaking',
    '{"en":"Groundbreaking Ceremony","km":"ពិធីជ្រលងគ្រឹះ","zh":"奠基仪式"}'::jsonb,
    '{"en":"Professional logistics for construction milestone ceremonies, complete with safety protocols and grand stage building.","km":"ការរៀបចំដឹកជញ្ជូនប្រកបដោយវិជ្ជាជីវៈសម្រាប់ពិធីសម្គាល់គម្រោងសំណង់ ព្រមទាំងវិធានការសុវត្ថិភាព និងការសាងសង់ឆាក។","zh":"为工程节点仪式提供专业统筹，包含安全措施与舞台搭建。"}'::jsonb,
    '{"en":"<h2>Groundbreaking Ceremony Logistics</h2><p>Professional logistics for construction milestone ceremonies, complete with safety protocols and grand stage building across Cambodia.</p><figure><img src=\"/images/mpg/hero-backstage-v2.png\" alt=\"Cambodian Event Production Crew Backstage\" /><figcaption>On-site Rigging & Marquee Structure Building, Cambodia</figcaption></figure>","km":"<h2>ពិធីជ្រលងគ្រឹះ</h2><p>ការរៀបចំដឹកជញ្ជូនប្រកបដោយវិជ្ជាជីវៈសម្រាប់ពិធីសម្គាល់គម្រោងសំណង់ ព្រមទាំងវិធានការសុវត្ថិភាព និងការសាងសង់ឆាក។</p>","zh":"<h2>奠基仪式</h2><p>为工程节点仪式提供专业统筹，包含安全措施与舞台搭建。</p>"}'::jsonb,
    '/images/mpg/service-groundbreaking.webp',
    array['/images/mpg/service-groundbreaking.webp', '/images/mpg/hero-backstage-v2.png', '/images/mpg/project-6.png'],
    2, true, '2026-08-01T00:00:00Z',
    '{"en":"Groundbreaking Ceremony in Cambodia","km":"ពិធីជ្រលងគ្រឹះ","zh":"奠基仪式"}'::jsonb
  ),
  (
    'roadshow-exhibition',
    '{"en":"Roadshow & Exhibition","km":"រ៉ូដសូ និងពិព័រណ៍","zh":"路演与展览"}'::jsonb,
    '{"en":"Custom exhibition booth construction, mall activations, and mobile roadshow coordination across major provinces.","km":"ការសាងសង់ស្តង់ពិព័រណ៍តាមតម្រូវការ សកម្មភាពនៅផ្សារទំនើប និងការសម្របសម្រួលរ៉ូដសូតាមខេត្តសំខាន់ៗ។","zh":"定制展位搭建、商场活动，以及覆盖主要省份的路演统筹。"}'::jsonb,
    '{"en":"<h2>Roadshow & Exhibition Production</h2><p>Custom exhibition booth construction, mall activations, and mobile roadshow coordination across major provinces in Cambodia.</p><figure><img src=\"/images/mpg/project-8.png\" alt=\"Exhibition Booth Fabrication\" /><figcaption>Custom Trade Exhibition Booth Fabrication, Phnom Penh</figcaption></figure>","km":"<h2>រ៉ូដសូ និងពិព័រណ៍</h2><p>ការសាងសង់ស្តង់ពិព័រណ៍តាមតម្រូវការ សកម្មភាពនៅផ្សារទំនើប និងការសម្របសម្រួលរ៉ូដសូតាមខេត្តសំខាន់ៗ។</p>","zh":"<h2>路演与展览</h2><p>定制展位搭建、商场活动，以及覆盖主要省份的路演统筹。</p>"}'::jsonb,
    '/images/mpg/service-roadshow.webp',
    array['/images/mpg/service-roadshow.webp', '/images/mpg/project-8.png', '/images/mpg/project-4.png'],
    3, true, '2026-08-01T00:00:00Z',
    '{"en":"Exhibition Booth Production in Cambodia","km":"រ៉ូដសូ និងពិព័រណ៍","zh":"路演与展览"}'::jsonb
  ),
  (
    'seminar-corporate',
    '{"en":"Seminar & Corporate Event","km":"សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម","zh":"研讨会与企业活动"}'::jsonb,
    '{"en":"Conferences, annual general meetings, gala dinners, team building, and professional business forums.","km":"សន្និសីទ អង្គប្រជុំសាមញ្ញប្រចាំឆ្នាំ ពិធីជប់លៀងអាហារពេលល្ងាច សកម្មភាពស្អាងក្រុម និងវេទិកាអាជីវកម្ម។","zh":"会议、股东年会、晚宴、团队建设与商务论坛。"}'::jsonb,
    '{"en":"<h2>Seminar & Corporate Event Planning</h2><p>Conferences, annual general meetings, gala dinners, team building, and professional business forums in Phnom Penh.</p><figure><img src=\"/images/mpg/cambodia-business-summit.png\" alt=\"Cambodia Business Leaders Forum Phnom Penh\" /><figcaption>Cambodia Business Leaders Forum & Executive Banquet, Phnom Penh</figcaption></figure>","km":"<h2>សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម</h2><p>សន្និសីទ អង្គប្រជុំសាមញ្ញប្រចាំឆ្នាំ ពិធីជប់លៀងអាហារពេលល្ងាច សកម្មភាពស្អាងក្រុម និងវេទិកាអាជីវកម្ម។</p>","zh":"<h2>研讨会与企业活动</h2><p>会议、股东年会、晚宴、团队建设与商务论坛。</p>"}'::jsonb,
    '/images/mpg/cambodia-business-summit.png',
    array['/images/mpg/cambodia-business-summit.png', '/images/mpg/project-7.png', '/images/mpg/about-team.png'],
    4, true, '2026-08-01T00:00:00Z',
    '{"en":"Corporate Seminar & Business Forum in Phnom Penh","km":"សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម","zh":"研讨会与企业活动"}'::jsonb
  ),
  (
    'equipment-rental',
    '{"en":"Event Equipment Rental","km":"ការជួលឧបករណ៍កម្មវិធី","zh":"活动设备租赁"}'::jsonb,
    '{"en":"Premium LED walls, professional sound and lighting rigs, stage structures, VIP seating, and tents.","km":"អេក្រង់ LED គុណភាពខ្ពស់ ប្រព័ន្ធសំឡេង និងពន្លឺជាអាជីព រចនាសម្ព័ន្ធឆាក កៅអីភ្ញៀវកិត្តិយស និងតង់។","zh":"高清 LED 屏幕、专业音响与灯光设备、舞台结构、贵宾座椅与篷房。"}'::jsonb,
    '{"en":"<h2>Event AV Equipment Rental in Cambodia</h2><p>Premium indoor/outdoor LED walls, concert-grade line array sound systems, intelligent lighting rigs, stage structures, and VIP tents.</p><figure><img src=\"/images/mpg/project-3.png\" alt=\"Concert Sound and Lighting Rigging\" /><figcaption>Line Array Sound & Intelligent Lighting Truss Setup, Cambodia</figcaption></figure>","km":"<h2>ការជួលឧបករណ៍កម្មវិធី</h2><p>អេក្រង់ LED គុណភាពខ្ពស់ ប្រព័ន្ធសំឡេង និងពន្លឺជាអាជីព រចនាសម្ព័ន្ធឆាក កៅអីភ្ញៀវកិត្តិយស និងតង់។</p>","zh":"<h2>活动设备租赁</h2><p>高清 LED 屏幕、专业音响与灯光设备、舞台结构、贵宾座椅与篷房。</p>"}'::jsonb,
    '/images/mpg/service-rental.webp',
    array['/images/mpg/service-rental.webp', '/images/mpg/project-3.png', '/images/mpg/project-5.png'],
    5, true, '2026-08-01T00:00:00Z',
    '{"en":"Event AV Rental Equipment in Cambodia","km":"ការជួលឧបករណ៍កម្មវិធី","zh":"活动设备租赁"}'::jsonb
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  content = excluded.content,
  cover_image = excluded.cover_image,
  gallery = excluded.gallery,
  image_alt = excluded.image_alt;

-- 2. UPDATE PROJECTS
insert into public.projects (
  slug, title, description, content, category, location, cover_image, gallery,
  display_order, is_featured, is_published, published_at, image_alt
)
values
  ('outdoor-grand-opening',
   '{"en":"Outdoor Grand Opening Ceremony","km":"ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ","zh":"户外开业剪彩典礼"}'::jsonb,
   '{"en":"Entrance arch, red carpet, ribbon cutting, guest seating and sound","km":"ខ្លោងទ្វារចូល ព្រំក្រហម ការកាត់ខ្សែបូ កៅអីភ្ញៀវ និងសំឡេង","zh":"入口拱门、红毯、剪彩、来宾座位与音响"}'::jsonb,
   '{"en":"<h2>Outdoor Grand Opening Ceremony Production</h2><p>Entrance arch, red carpet, ribbon cutting, guest seating and sound system in Phnom Penh.</p><figure><img src=\"/images/mpg/grand-opening-feature.png\" alt=\"Grand Opening Entrance Arch\" /><figcaption>Grand Opening Entrance Arch & Red Carpet Pathway, Phnom Penh</figcaption></figure>","km":"<h2>ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ</h2><p>ខ្លោងទ្វារចូល ព្រំក្រហម ការកាត់ខ្សែបូ កៅអីភ្ញៀវ និងសំឡេង</p>","zh":"<h2>户外开业剪彩典礼</h2><p>入口拱门、红毯、剪彩、来宾座位与音响</p>"}'::jsonb,
   'Grand opening', 'Cambodia', '/images/mpg/grand-opening-editorial-v2.png',
   array['/images/mpg/grand-opening-feature.png', '/images/mpg/project-1.png', '/images/mpg/project-2.png'],
   0, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Outdoor Grand Opening Ceremony in Phnom Penh","km":"ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ","zh":"户外开业剪彩典礼"}'::jsonb),
  ('corporate-headquarters-opening',
   '{"en":"Corporate Headquarters Opening","km":"ពិធីបើកសម្ពោធការិយាល័យកណ្តាល","zh":"企业总部开业典礼"}'::jsonb,
   '{"en":"Stage backdrop, floral arch, ribbon-cutting setup and guest seating","km":"ផ្ទាំងឆាក ខ្លោងទ្វារផ្កា ការរៀបចំកាត់ខ្សែបូ និងកៅអីភ្ញៀវ","zh":"舞台背景板、花艺拱门、剪彩布置与来宾座位"}'::jsonb,
   '{"en":"<h2>Corporate Headquarters Opening Ceremony</h2><p>Stage backdrop, floral arch, ribbon-cutting setup and guest seating in Phnom Penh business tower.</p><figure><img src=\"/images/mpg/project-2.png\" alt=\"Corporate Entrance Backdrop\" /><figcaption>Custom Branded Floral Portal & Backdrop, Phnom Penh</figcaption></figure>","km":"<h2>ពិធីបើកសម្ពោធការិយាល័យកណ្តាល</h2><p>ផ្ទាំងឆាក ខ្លោងទ្វារផ្កា ការរៀបចំកាត់ខ្សែបូ និងកៅអីភ្ញៀវ</p>","zh":"<h2>企业总部开业典礼</h2><p>舞台背景板、花艺拱门、剪彩布置与来宾座位</p>"}'::jsonb,
   'Grand opening', 'Cambodia', '/images/mpg/grand-opening-feature.png',
   array['/images/mpg/grand-opening-editorial-v2.png', '/images/mpg/project-2.png', '/images/mpg/project-3.png'],
   1, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Corporate Headquarters Opening in Phnom Penh","km":"ពិធីបើកសម្ពោធការិយាល័យកណ្តាល","zh":"企业总部开业典礼"}'::jsonb),
  ('corporate-ceremony',
   '{"en":"Corporate Ceremony & Awards Night","km":"ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់","zh":"企业典礼与颁奖之夜"}'::jsonb,
   '{"en":"Stage build, lighting design, sound and programme management","km":"ការសាងសង់ឆាក ការរចនាពន្លឺ សំឡេង និងការគ្រប់គ្រងកម្មវិធី","zh":"舞台搭建、灯光设计、音响与流程管理"}'::jsonb,
   '{"en":"<h2>Corporate Ceremony & Awards Night</h2><p>Stage build, lighting design, sound and programme management in Phnom Penh ballroom.</p><figure><img src=\"/images/mpg/cambodia-business-summit.png\" alt=\"Cambodia Corporate Gala Dinner & Awards\" /><figcaption>Cambodia Corporate Awards Gala Dinner & Executive Seating, Phnom Penh</figcaption></figure>","km":"<h2>ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់</h2><p>ការសាងសង់ឆាក ការរចនាពន្លឺ សំឡេង និងការគ្រប់គ្រងកម្មវិធី</p>","zh":"<h2>企业典礼与颁奖之夜</h2><p>舞台搭建、灯光设计、音响与流程管理</p>"}'::jsonb,
   'Corporate', 'Cambodia', '/images/mpg/cambodia-business-summit.png',
   array['/images/mpg/cambodia-business-summit.png', '/images/mpg/project-7.png', '/images/mpg/about-team.png'],
   2, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Corporate Ceremony & Awards Night in Phnom Penh","km":"ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់","zh":"企业典礼与颁奖之夜"}'::jsonb),
  ('product-launch-stage',
   '{"en":"Product Launch Stage","km":"ឆាកបើកដំណើរការផលិតផល","zh":"新品发布舞台"}'::jsonb,
   '{"en":"Launch stage, LED wall, lighting and presentation sound","km":"ឆាកបើកដំណើរការ អេក្រង់ LED ពន្លឺ និងសំឡេងបទបង្ហាញ","zh":"发布舞台、LED 屏幕、灯光与演讲音响"}'::jsonb,
   '{"en":"<h2>Product Launch Stage Build</h2><p>Launch stage, LED wall, lighting and presentation sound in Phnom Penh.</p><figure><img src=\"/images/mpg/project-5.png\" alt=\"High Tech Product Launch Screen Setup\" /><figcaption>Interactive Product Launch Stage & LED Screen Installation</figcaption></figure>","km":"<h2>ឆាកបើកដំណើរការផលិតផល</h2><p>ឆាកបើកដំណើរការ អេក្រង់ LED ពន្លឺ និងសំឡេងបទបង្ហាញ</p>","zh":"<h2>新品发布舞台</h2><p>发布舞台、LED 屏幕、灯光与演讲音响</p>"}'::jsonb,
   'Product launch', 'Cambodia', '/images/mpg/project-5.webp',
   array['/images/mpg/project-5.png', '/images/mpg/service-product-launch.png', '/images/mpg/project-4.png'],
   3, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Product Launch Stage Build in Phnom Penh","km":"ឆាកបើកដំណើរការផលិតផល","zh":"新品发布舞台"}'::jsonb),
  ('conference-summit',
   '{"en":"Conference & Business Summit","km":"សន្និសីទ និងវេទិកាអាជីវកម្ម","zh":"会议与商务峰会"}'::jsonb,
   '{"en":"Wide LED screen, stage lighting, conference sound and seating","km":"អេក្រង់ LED ធំ ពន្លឺឆាក សំឡេងសន្និសីទ និងកៅអី","zh":"宽幅 LED 屏幕、舞台灯光、会议音响与座位"}'::jsonb,
   '{"en":"<h2>Conference & Business Summit Production</h2><p>Wide LED screen, stage lighting, conference sound and seating in Phnom Penh.</p><figure><img src=\"/images/mpg/cambodia-business-summit.png\" alt=\"Cambodia Business Leaders Summit Phnom Penh\" /><figcaption>Cambodia Business Leaders Forum Keynote Stage, Phnom Penh</figcaption></figure>","km":"<h2>សន្និសីទ និងវេទិកាអាជីវកម្ម</h2><p>អេក្រង់ LED ធំ ពន្លឺឆាក សំឡេងសន្និសីទ និងកៅអី</p>","zh":"<h2>会议与商务峰会</h2><p>宽幅 LED 屏幕、舞台灯光、会议音响与座位</p>"}'::jsonb,
   'Corporate', 'Cambodia', '/images/mpg/cambodia-business-summit.png',
   array['/images/mpg/cambodia-business-summit.png', '/images/mpg/service-seminar.webp', '/images/mpg/about-team.png'],
   4, false, true, '2026-08-01T00:00:00Z',
   '{"en":"Conference & Business Summit in Phnom Penh","km":"សន្និសីទ និងវេទិកាអាជីវកម្ម","zh":"会议与商务峰会"}'::jsonb),
  ('exhibition-build',
   '{"en":"Exhibition Booth Build","km":"ការសាងសង់ស្តង់ពិព័រណ៍","zh":"展览展位搭建"}'::jsonb,
   '{"en":"Custom booth construction, LED banner, displays and branding","km":"ការសាងសង់ស្តង់តាមតម្រូវការ បដា LED ការតាំងបង្ហាញ និងម៉ាកយីហោ","zh":"定制展位搭建、LED 横幅、展示与品牌视觉"}'::jsonb,
   '{"en":"<h2>Exhibition Booth Fabrication</h2><p>Custom booth construction, LED banner, displays and branding in Phnom Penh trade halls.</p><figure><img src=\"/images/mpg/project-8.png\" alt=\"Exhibition Pavilion Build\" /><figcaption>Custom Double-sided Exhibition Booth Build, Phnom Penh</figcaption></figure>","km":"<h2>ការសាងសង់ស្តង់ពិព័រណ៍</h2><p>ការសាងសង់ស្តង់តាមតម្រូវការ បដា LED ការតាំងបង្ហាញ និងម៉ាកយីហោ</p>","zh":"<h2>展览展位搭建</h2><p>定制展位搭建、LED 横幅、展示与品牌视觉</p>"}'::jsonb,
   'Exhibition', 'Cambodia', '/images/mpg/service-roadshow.webp',
   array['/images/mpg/service-roadshow.webp', '/images/mpg/project-8.png', '/images/mpg/project-4.png'],
   5, false, true, '2026-08-01T00:00:00Z',
   '{"en":"Exhibition Booth Build in Phnom Penh","km":"ការសាងសង់ស្តង់ពិព័រណ៍","zh":"展览展位搭建"}'::jsonb)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  content = excluded.content,
  cover_image = excluded.cover_image,
  gallery = excluded.gallery,
  image_alt = excluded.image_alt;

-- 3. UPDATE BLOG POSTS
insert into public.blog_posts (
  slug, title, excerpt, content, cover_image, category, author_name,
  is_published, published_at, image_alt
)
values
  (
    'planning-a-landmark-grand-opening',
    '{"en":"Planning a landmark grand opening in Phnom Penh","km":"ការរៀបចំពិធីបើកសម្ពោធដ៏សំខាន់នៅភ្នំពេញ","zh":"如何在金边策划一场标志性的开业典礼"}'::jsonb,
    '{"en":"The practical decisions behind guest flow, ribbon cutting, stage sightlines and a calm show day.","km":"ការសម្រេចចិត្តសំខាន់ៗសម្រាប់លំហូរភ្ញៀវ ការកាត់ខ្សែបូ ឆាក និងថ្ងៃកម្មវិធីដ៏រលូន។","zh":"从宾客动线、剪彩到舞台视线，拆解一场从容活动日背后的关键决策。"}'::jsonb,
    '{"en":"<h2>Planning a Landmark Grand Opening in Phnom Penh</h2><p>The practical decisions behind guest flow, ribbon cutting, stage sightlines and a calm show day.</p><figure><img src=\"/images/mpg/grand-opening-editorial-v2.png\" alt=\"Phnom Penh Grand Opening Event Management\" /><figcaption>Stage Sightlines & Guest Flow Coordination, Phnom Penh</figcaption></figure><p>From VIP arrivals to speech timing and ribbon-cutting synchronization, careful planning ensures an effortless experience for honored guests and media representatives alike.</p>","km":"<h2>ការរៀបចំពិធីបើកសម្ពោធដ៏សំខាន់នៅភ្នំពេញ</h2><p>ការសម្រេចចិត្តសំខាន់ៗសម្រាប់លំហូរភ្ញៀវ ការកាត់ខ្សែបូ ឆាក និងថ្ងៃកម្មវិធីដ៏រលូន។</p>","zh":"<h2>如何在金边策划一场标志性的开业典礼</h2><p>从宾客动线、剪彩到舞台视线，拆解一场从容活动日背后的关键决策。</p>"}'::jsonb,
    '/images/mpg/project-1.webp', 'Planning', 'MPG Production Team', true, '2026-08-03T00:00:00Z',
    '{"en":"Planning a landmark grand opening in Phnom Penh","km":"ការរៀបចំពិធីបើកសម្ពោធដ៏សំខាន់នៅភ្នំពេញ","zh":"如何在金边策划一场标志性的开业典礼"}'::jsonb
  ),
  (
    'lighting-sound-and-the-room',
    '{"en":"How lighting and sound change the room","km":"របៀបដែលពន្លឺ និងសំឡេងផ្លាស់ប្តូរបរិយាកាស","zh":"灯光与声音如何改变整个空间"}'::jsonb,
    '{"en":"A field guide to clear speech, deliberate lighting cues and production that supports the programme.","km":"មគ្គុទ្ទេសក៍សម្រាប់សំឡេងច្បាស់ ពន្លឺត្រឹមត្រូវ និងផលិតកម្មដែលគាំទ្រកម្មវិធី។","zh":"一份关于清晰扩声、精准灯光提示与流程配合的现场指南。"}'::jsonb,
    '{"en":"<h2>How Lighting and Sound Change the Room</h2><p>A field guide to clear speech, deliberate lighting cues and production that supports the programme.</p><figure><img src=\"/images/mpg/project-3.png\" alt=\"Sound Rigs and Lighting Control in Cambodia\" /><figcaption>Concert Sound Console & Moving Head Lighting Calibration</figcaption></figure><p>Proper acoustic tuning and warm ambient lighting create an engaging atmosphere that reinforces key messaging throughout corporate keynotes and award presentations.</p>","km":"<h2>របៀបដែលពន្លឺ និងសំឡេងផ្លាស់ប្តូរបរិយាកាស</h2><p>មគ្គុទ្ទេសក៍សម្រាប់សំឡេងច្បាស់ ពន្លឺត្រឹមត្រូវ និងផលិតកម្មដែលគាំទ្រកម្មវិធី។</p>","zh":"<h2>灯光与声音如何改变整个空间</h2><p>一份关于清晰扩声、精准灯光提示与流程配合的现场指南。</p>"}'::jsonb,
    '/images/mpg/service-rental.webp', 'Production', 'MPG Production Team', true, '2026-08-02T00:00:00Z',
    '{"en":"How lighting and sound change the room","km":"របៀបដែលពន្លឺ និងសំឡេងផ្លាស់ប្តូរបរិយាកាស","zh":"灯光与声音如何改变整个空间"}'::jsonb
  ),
  (
    'taking-an-event-beyond-phnom-penh',
    '{"en":"Taking an event beyond Phnom Penh","km":"ការរៀបចំព្រឹត្តិការណ៍ក្រៅរាជធានីភ្នំពេញ","zh":"把活动带到金边以外"}'::jsonb,
    '{"en":"What changes when the crew, stage and equipment need to move across Cambodia.","km":"អ្វីដែលត្រូវរៀបចំ នៅពេលក្រុមការងារ ឆាក និងឧបករណ៍ត្រូវធ្វើដំណើរទូទាំងកម្ពុជា។","zh":"当团队、舞台和设备需要走遍柬埔寨时，制作方案会有哪些变化。"}'::jsonb,
    '{"en":"<h2>Taking an Event Beyond Phnom Penh</h2><p>What changes when the crew, stage and equipment need to move across Cambodia.</p><figure><img src=\"/images/mpg/hero-backstage-v2.png\" alt=\"Cambodian Production Logistics and Mobile Rigging\" /><figcaption>Mobile Rigging & Production Crew Deployment, Siem Reap & Provinces</figcaption></figure><p>Deploying technical teams and heavy equipment across Siem Reap, Sihanoukville, and Battambang requires robust transportation logistics and power redundancy.</p>","km":"<h2>ការរៀបចំព្រឹត្តិការណ៍ក្រៅរាជធានីភ្នំពេញ</h2><p>អ្វីដែលត្រូវរៀបចំ នៅពេលក្រុមការងារ ឆាក និងឧបករណ៍ត្រូវធ្វើដំណើរទូទាំងកម្ពុជា។</p>","zh":"<h2>把活动带到金边以外</h2><p>当团队、舞台和设备需要走遍柬埔寨时，制作方案会有哪些变化。</p>"}'::jsonb,
    '/images/mpg/hero-backstage-v2.png', 'Field notes', 'MPG Production Team', true, '2026-08-01T00:00:00Z',
    '{"en":"Taking an event beyond Phnom Penh","km":"ការរៀបចំព្រឹត្តិការណ៍ក្រៅរាជធានីភ្នំពេញ","zh":"把活动带到金边以外"}'::jsonb
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  content = excluded.content,
  cover_image = excluded.cover_image,
  image_alt = excluded.image_alt;
