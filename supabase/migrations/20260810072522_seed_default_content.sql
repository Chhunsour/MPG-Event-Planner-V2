-- Promote the built-in public fallbacks to editable CMS records.
-- ON CONFLICT keeps this safe for installations that already have content.

insert into public.services (
  slug, title, description, content, cover_image, display_order,
  is_published, published_at, image_alt
)
values
  (
    'grand-opening',
    '{"en":"Grand Opening Ceremony","km":"ពិធីបើកសម្ពោធជាផ្លូវការ","zh":"开业典礼"}'::jsonb,
    '{"en":"Complete production, VIP protocol, ribbon-cutting setup, custom decoration, and stage choreography.","km":"ផលិតកម្មពេញលេញ ពិធីការភ្ញៀវកិត្តិយស ការរៀបចំកាត់ខ្សែបូ ការតុបតែងតាមតម្រូវការ និងការរៀបចំឆាក។","zh":"全案制作、贵宾礼仪、剪彩布置、定制装饰与舞台流程编排。"}'::jsonb,
    '{"en":"<h2>Grand Opening Ceremony</h2><p>Complete production, VIP protocol, ribbon-cutting setup, custom decoration, and stage choreography.</p>","km":"<h2>ពិធីបើកសម្ពោធជាផ្លូវការ</h2><p>ផលិតកម្មពេញលេញ ពិធីការភ្ញៀវកិត្តិយស ការរៀបចំកាត់ខ្សែបូ ការតុបតែងតាមតម្រូវការ និងការរៀបចំឆាក។</p>","zh":"<h2>开业典礼</h2><p>全案制作、贵宾礼仪、剪彩布置、定制装饰与舞台流程编排。</p>"}'::jsonb,
    '/images/mpg/grand-opening-editorial-v2.png', 0, true, '2026-08-01T00:00:00Z',
    '{"en":"Grand Opening Ceremony","km":"ពិធីបើកសម្ពោធជាផ្លូវការ","zh":"开业典礼"}'::jsonb
  ),
  (
    'product-launch',
    '{"en":"Product & Sales Launching","km":"ការបើកដំណើរការផលិតផល","zh":"新品与销售发布会"}'::jsonb,
    '{"en":"Impactful launch campaigns, experiential setups, and creative media events to boost market entry.","km":"យុទ្ធនាការបើកដំណើរការដ៏មានឥទ្ធិពល ការរៀបចំបទពិសោធន៍ និងកម្មវិធីប្រព័ន្ធផ្សព្វផ្សាយប្រកបដោយភាពច្នៃប្រឌិត។","zh":"具有影响力的发布活动、体验式布置与创意媒体活动，助力产品进入市场。"}'::jsonb,
    '{"en":"<h2>Product & Sales Launching</h2><p>Impactful launch campaigns, experiential setups, and creative media events to boost market entry.</p>","km":"<h2>ការបើកដំណើរការផលិតផល</h2><p>យុទ្ធនាការបើកដំណើរការដ៏មានឥទ្ធិពល ការរៀបចំបទពិសោធន៍ និងកម្មវិធីប្រព័ន្ធផ្សព្វផ្សាយប្រកបដោយភាពច្នៃប្រឌិត។</p>","zh":"<h2>新品与销售发布会</h2><p>具有影响力的发布活动、体验式布置与创意媒体活动，助力产品进入市场。</p>"}'::jsonb,
    '/images/mpg/service-product-launch.png', 1, true, '2026-08-01T00:00:00Z',
    '{"en":"Product & Sales Launching","km":"ការបើកដំណើរការផលិតផល","zh":"新品与销售发布会"}'::jsonb
  ),
  (
    'groundbreaking',
    '{"en":"Groundbreaking Ceremony","km":"ពិធីជ្រលងគ្រឹះ","zh":"奠基仪式"}'::jsonb,
    '{"en":"Professional logistics for construction milestone ceremonies, complete with safety protocols and grand stage building.","km":"ការរៀបចំដឹកជញ្ជូនប្រកបដោយវិជ្ជាជីវៈសម្រាប់ពិធីសម្គាល់គម្រោងសំណង់ ព្រមទាំងវិធានការសុវត្ថិភាព និងការសាងសង់ឆាក។","zh":"为工程节点仪式提供专业统筹，包含安全措施与舞台搭建。"}'::jsonb,
    '{"en":"<h2>Groundbreaking Ceremony</h2><p>Professional logistics for construction milestone ceremonies, complete with safety protocols and grand stage building.</p>","km":"<h2>ពិធីជ្រលងគ្រឹះ</h2><p>ការរៀបចំដឹកជញ្ជូនប្រកបដោយវិជ្ជាជីវៈសម្រាប់ពិធីសម្គាល់គម្រោងសំណង់ ព្រមទាំងវិធានការសុវត្ថិភាព និងការសាងសង់ឆាក។</p>","zh":"<h2>奠基仪式</h2><p>为工程节点仪式提供专业统筹，包含安全措施与舞台搭建。</p>"}'::jsonb,
    '/images/mpg/service-groundbreaking.webp', 2, true, '2026-08-01T00:00:00Z',
    '{"en":"Groundbreaking Ceremony","km":"ពិធីជ្រលងគ្រឹះ","zh":"奠基仪式"}'::jsonb
  ),
  (
    'roadshow-exhibition',
    '{"en":"Roadshow & Exhibition","km":"រ៉ូដសូ និងពិព័រណ៍","zh":"路演与展览"}'::jsonb,
    '{"en":"Custom exhibition booth construction, mall activations, and mobile roadshow coordination across major provinces.","km":"ការសាងសង់ស្តង់ពិព័រណ៍តាមតម្រូវការ សកម្មភាពនៅផ្សារទំនើប និងការសម្របសម្រួលរ៉ូដសូតាមខេត្តសំខាន់ៗ។","zh":"定制展位搭建、商场活动，以及覆盖主要省份的路演统筹。"}'::jsonb,
    '{"en":"<h2>Roadshow & Exhibition</h2><p>Custom exhibition booth construction, mall activations, and mobile roadshow coordination across major provinces.</p>","km":"<h2>រ៉ូដសូ និងពិព័រណ៍</h2><p>ការសាងសង់ស្តង់ពិព័រណ៍តាមតម្រូវការ សកម្មភាពនៅផ្សារទំនើប និងការសម្របសម្រួលរ៉ូដសូតាមខេត្តសំខាន់ៗ។</p>","zh":"<h2>路演与展览</h2><p>定制展位搭建、商场活动，以及覆盖主要省份的路演统筹。</p>"}'::jsonb,
    '/images/mpg/service-roadshow.webp', 3, true, '2026-08-01T00:00:00Z',
    '{"en":"Roadshow & Exhibition","km":"រ៉ូដសូ និងពិព័រណ៍","zh":"路演与展览"}'::jsonb
  ),
  (
    'seminar-corporate',
    '{"en":"Seminar & Corporate Event","km":"សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម","zh":"研讨会与企业活动"}'::jsonb,
    '{"en":"Conferences, annual general meetings, gala dinners, team building, and professional business forums.","km":"សន្និសីទ អង្គប្រជុំសាមញ្ញប្រចាំឆ្នាំ ពិធីជប់លៀងអាហារពេលល្ងាច សកម្មភាពស្អាងក្រុម និងវេទិកាអាជីវកម្ម។","zh":"会议、股东年会、晚宴、团队建设与商务论坛。"}'::jsonb,
    '{"en":"<h2>Seminar & Corporate Event</h2><p>Conferences, annual general meetings, gala dinners, team building, and professional business forums.</p>","km":"<h2>សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម</h2><p>សន្និសីទ អង្គប្រជុំសាមញ្ញប្រចាំឆ្នាំ ពិធីជប់លៀងអាហារពេលល្ងាច សកម្មភាពស្អាងក្រុម និងវេទិកាអាជីវកម្ម។</p>","zh":"<h2>研讨会与企业活动</h2><p>Conferences, annual general meetings, gala dinners, team building, and professional business forums.</p>"}'::jsonb,
    '/images/mpg/service-seminar.webp', 4, true, '2026-08-01T00:00:00Z',
    '{"en":"Seminar & Corporate Event","km":"សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម","zh":"研讨会与企业活动"}'::jsonb
  ),
  (
    'equipment-rental',
    '{"en":"Event Equipment Rental","km":"ការជួលឧបករណ៍កម្មវិធី","zh":"活动设备租赁"}'::jsonb,
    '{"en":"Premium LED walls, professional sound and lighting rigs, stage structures, VIP seating, and tents.","km":"អេក្រង់ LED គុណភាពខ្ពស់ ប្រព័ន្ធសំឡេង និងពន្លឺជាអាជីព រចនាសម្ព័ន្ធឆាក កៅអីភ្ញៀវកិត្តិយស និងតង់។","zh":"高清 LED 屏幕、专业音响与灯光设备、舞台结构、贵宾座椅与篷房。"}'::jsonb,
    '{"en":"<h2>Event Equipment Rental</h2><p>Premium LED walls, professional sound and lighting rigs, stage structures, VIP seating, and tents.</p>","km":"<h2>ការជួលឧបករណ៍កម្មវិធី</h2><p>អេក្រង់ LED គុណភាពខ្ពស់ ប្រព័ន្ធសំឡេង និងពន្លឺជាអាជីព រចនាសម្ព័ន្ធឆាក កៅអីភ្ញៀវកិត្តិយស និងតង់។</p>","zh":"<h2>活动设备租赁</h2><p>高清 LED 屏幕、专业音响与灯光设备、舞台结构、贵宾座椅与篷房。</p>"}'::jsonb,
    '/images/mpg/service-rental.webp', 5, true, '2026-08-01T00:00:00Z',
    '{"en":"Event Equipment Rental","km":"ការជួលឧបករណ៍កម្មវិធី","zh":"活动设备租赁"}'::jsonb
  )
on conflict (slug) do update set
  cover_image = excluded.cover_image;

insert into public.projects (
  slug, title, description, content, category, location, cover_image,
  display_order, is_featured, is_published, published_at, image_alt
)
values
  ('outdoor-grand-opening',
   '{"en":"Outdoor Grand Opening Ceremony","km":"ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ","zh":"户外开业剪彩典礼"}'::jsonb,
   '{"en":"Entrance arch, red carpet, ribbon cutting, guest seating and sound","km":"ខ្លោងទ្វារចូល ព្រំក្រហម ការកាត់ខ្សែបូ កៅអីភ្ញៀវ និងសំឡេង","zh":"入口拱门、红毯、剪彩、来宾座位与音响"}'::jsonb,
   '{"en":"<h2>Outdoor Grand Opening Ceremony</h2><p>Entrance arch, red carpet, ribbon cutting, guest seating and sound</p>","km":"<h2>ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ</h2><p>ខ្លោងទ្វារចូល ព្រំក្រហម ការកាត់ខ្សែបូ កៅអីភ្ញៀវ និងសំឡេង</p>","zh":"<h2>户外开业剪彩典礼</h2><p>入口拱门、红毯、剪彩、来宾座位与音响</p>"}'::jsonb,
   'Grand opening', 'Cambodia', '/images/mpg/grand-opening-editorial-v2.png', 0, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Outdoor Grand Opening Ceremony","km":"ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ","zh":"户外开业剪彩典礼"}'::jsonb),
  ('corporate-headquarters-opening',
   '{"en":"Corporate Headquarters Opening","km":"ពិធីបើកសម្ពោធការិយាល័យកណ្តាល","zh":"企业总部开业典礼"}'::jsonb,
   '{"en":"Stage backdrop, floral arch, ribbon-cutting setup and guest seating","km":"ផ្ទាំងឆាក ខ្លោងទ្វារផ្កា ការរៀបចំកាត់ខ្សែបូ និងកៅអីភ្ញៀវ","zh":"舞台背景板、花艺拱门、剪彩布置与来宾座位"}'::jsonb,
   '{"en":"<h2>Corporate Headquarters Opening</h2><p>Stage backdrop, floral arch, ribbon-cutting setup and guest seating</p>","km":"<h2>ពិធីបើកសម្ពោធការិយាល័យកណ្តាល</h2><p>ផ្ទាំងឆាក ខ្លោងទ្វារផ្កា ការរៀបចំកាត់ខ្សែបូ និងកៅអីភ្ញៀវ</p>","zh":"<h2>企业总部开业典礼</h2><p>舞台背景板、花艺拱门、剪彩布置与来宾座位</p>"}'::jsonb,
   'Grand opening', 'Cambodia', '/images/mpg/grand-opening-feature.png', 1, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Corporate Headquarters Opening","km":"ពិធីបើកសម្ពោធការិយាល័យកណ្តាល","zh":"企业总部开业典礼"}'::jsonb),
  ('corporate-ceremony',
   '{"en":"Corporate Ceremony & Awards Night","km":"ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់","zh":"企业典礼与颁奖之夜"}'::jsonb,
   '{"en":"Stage build, lighting design, sound and programme management","km":"ការសាងសង់ឆាក ការរចនាពន្លឺ សំឡេង និងការគ្រប់គ្រងកម្មវិធី","zh":"舞台搭建、灯光设计、音响与流程管理"}'::jsonb,
   '{"en":"<h2>Corporate Ceremony & Awards Night</h2><p>Stage build, lighting design, sound and programme management</p>","km":"<h2>ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់</h2><p>ការសាងសង់ឆាក ការរចនាពន្លឺ សំឡេង និងការគ្រប់គ្រងកម្មវិធី</p>","zh":"<h2>企业典礼与颁奖之夜</h2><p>舞台搭建、灯光设计、音响与流程管理</p>"}'::jsonb,
   'Corporate', 'Cambodia', '/images/mpg/contact-quote.webp', 2, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Corporate Ceremony & Awards Night","km":"ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់","zh":"企业典礼与颁奖之夜"}'::jsonb),
  ('product-launch-stage',
   '{"en":"Product Launch Stage","km":"ឆាកបើកដំណើរការផលិតផល","zh":"新品发布舞台"}'::jsonb,
   '{"en":"Launch stage, LED wall, lighting and presentation sound","km":"ឆាកបើកដំណើរការ អេក្រង់ LED ពន្លឺ និងសំឡេងបទបង្ហាញ","zh":"发布舞台、LED 屏幕、灯光与演讲音响"}'::jsonb,
   '{"en":"<h2>Product Launch Stage</h2><p>Launch stage, LED wall, lighting and presentation sound</p>","km":"<h2>ឆាកបើកដំណើរការផលិតផល</h2><p>ឆាកបើកដំណើរការ អេក្រង់ LED ពន្លឺ និងសំឡេងបទបង្ហាញ</p>","zh":"<h2>新品发布舞台</h2><p>发布舞台、LED 屏幕、灯光与演讲音响</p>"}'::jsonb,
   'Product launch', 'Cambodia', '/images/mpg/project-5.webp', 3, true, true, '2026-08-01T00:00:00Z',
   '{"en":"Product Launch Stage","km":"ឆាកបើកដំណើរការផលិតផល","zh":"新品发布舞台"}'::jsonb),
  ('conference-summit',
   '{"en":"Conference & Business Summit","km":"សន្និសីទ និងវេទិកាអាជីវកម្ម","zh":"会议与商务峰会"}'::jsonb,
   '{"en":"Wide LED screen, stage lighting, conference sound and seating","km":"អេក្រង់ LED ធំ ពន្លឺឆាក សំឡេងសន្និសីទ និងកៅអី","zh":"宽幅 LED 屏幕、舞台灯光、会议音响与座位"}'::jsonb,
   '{"en":"<h2>Conference & Business Summit</h2><p>Wide LED screen, stage lighting, conference sound and seating</p>","km":"<h2>សន្និសីទ និងវេទិកាអាជីវកម្ម</h2><p>អេក្រង់ LED ធំ ពន្លឺឆាក សំឡេងសន្និសីទ និងកៅអី</p>","zh":"<h2>会议与商务峰会</h2><p>宽幅 LED 屏幕、舞台灯光、会议音响与座位</p>"}'::jsonb,
   'Corporate', 'Cambodia', '/images/mpg/service-seminar.webp', 4, false, true, '2026-08-01T00:00:00Z',
   '{"en":"Conference & Business Summit","km":"សន្និសីទ និងវេទិកាអាជីវកម្ម","zh":"会议与商务峰会"}'::jsonb),
  ('exhibition-build',
   '{"en":"Exhibition Booth Build","km":"ការសាងសង់ស្តង់ពិព័រណ៍","zh":"展览展位搭建"}'::jsonb,
   '{"en":"Custom booth construction, LED banner, displays and branding","km":"ការសាងសង់ស្តង់តាមតម្រូវការ បដា LED ការតាំងបង្ហាញ និងម៉ាកយីហោ","zh":"定制展位搭建、LED 横幅、展示与品牌视觉"}'::jsonb,
   '{"en":"<h2>Exhibition Booth Build</h2><p>Custom booth construction, LED banner, displays and branding</p>","km":"<h2>ការសាងសង់ស្តង់ពិព័រណ៍</h2><p>ការសាងសង់ស្តង់តាមតម្រូវការ បដា LED ការតាំងបង្ហាញ និងម៉ាកយីហោ</p>","zh":"<h2>展览展位搭建</h2><p>定制展位搭建、LED 横幅、展示与品牌视觉</p>"}'::jsonb,
   'Exhibition', 'Cambodia', '/images/mpg/service-roadshow.webp', 5, false, true, '2026-08-01T00:00:00Z',
   '{"en":"Exhibition Booth Build","km":"ការសាងសង់ស្តង់ពិព័រណ៍","zh":"展览展位搭建"}'::jsonb)
on conflict (slug) do update set
  cover_image = excluded.cover_image;

insert into public.blog_posts (
  slug, title, excerpt, content, cover_image, category, author_name,
  is_published, published_at, image_alt
)
values
  (
    'planning-a-landmark-grand-opening',
    '{"en":"Planning a landmark grand opening in Phnom Penh","km":"ការរៀបចំពិធីបើកសម្ពោធដ៏សំខាន់នៅភ្នំពេញ","zh":"如何在金边策划一场标志性的开业典礼"}'::jsonb,
    '{"en":"The practical decisions behind guest flow, ribbon cutting, stage sightlines and a calm show day.","km":"ការសម្រេចចិត្តសំខាន់ៗសម្រាប់លំហូរភ្ញៀវ ការកាត់ខ្សែបូ ឆាក និងថ្ងៃកម្មវិធីដ៏រលូន។","zh":"从宾客动线、剪彩到舞台视线，拆解一场从容活动日背后的关键决策。"}'::jsonb,
    '{"en":"The practical decisions behind guest flow, ribbon cutting, stage sightlines and a calm show day.","km":"ការសម្រេចចិត្តសំខាន់ៗសម្រាប់លំហូរភ្ញៀវ ការកាត់ខ្សែបូ ឆាក និងថ្ងៃកម្មវិធីដ៏រលូន។","zh":"从宾客动线、剪彩到舞台视线，拆解一场从容活动日背后的关键决策。"}'::jsonb,
    '/images/mpg/project-1.webp', 'Planning', 'MPG Production Team', true, '2026-08-03T00:00:00Z',
    '{"en":"Planning a landmark grand opening in Phnom Penh","km":"ការរៀបចំពិធីបើកសម្ពោធដ៏សំខាន់នៅភ្នំពេញ","zh":"如何在金边策划一场标志性的开业典礼"}'::jsonb
  ),
  (
    'lighting-sound-and-the-room',
    '{"en":"How lighting and sound change the room","km":"របៀបដែលពន្លឺ និងសំឡេងផ្លាស់ប្តូរបរិយាកាស","zh":"灯光与声音如何改变整个空间"}'::jsonb,
    '{"en":"A field guide to clear speech, deliberate lighting cues and production that supports the programme.","km":"មគ្គុទ្ទេសក៍សម្រាប់សំឡេងច្បាស់ ពន្លឺត្រឹមត្រូវ និងផលិតកម្មដែលគាំទ្រកម្មវិធី។","zh":"一份关于清晰扩声、精准灯光提示与流程配合的现场指南。"}'::jsonb,
    '{"en":"A field guide to clear speech, deliberate lighting cues and production that supports the programme.","km":"មគ្គុទ្ទេសក៍សម្រាប់សំឡេងច្បាស់ ពន្លឺត្រឹមត្រូវ និងផលិតកម្មដែលគាំទ្រកម្មវិធី។","zh":"一份关于清晰扩声、精准灯光提示与流程配合的现场指南。"}'::jsonb,
    '/images/mpg/service-rental.webp', 'Production', 'MPG Production Team', true, '2026-08-02T00:00:00Z',
    '{"en":"How lighting and sound change the room","km":"របៀបដែលពន្លឺ និងសំឡេងផ្លាស់ប្តូរបរិយាកាស","zh":"灯光与声音如何改变整个空间"}'::jsonb
  ),
  (
    'taking-an-event-beyond-phnom-penh',
    '{"en":"Taking an event beyond Phnom Penh","km":"ការរៀបចំព្រឹត្តិការណ៍ក្រៅរាជធានីភ្នំពេញ","zh":"把活动带到金边以外"}'::jsonb,
    '{"en":"What changes when the crew, stage and equipment need to move across Cambodia.","km":"អ្វីដែលត្រូវរៀបចំ នៅពេលក្រុមការងារ ឆាក និងឧបករណ៍ត្រូវធ្វើដំណើរទូទាំងកម្ពុជា។","zh":"当团队、舞台和设备需要走遍柬埔寨时，制作方案会有哪些变化。"}'::jsonb,
    '{"en":"What changes when the crew, stage and equipment need to move across Cambodia.","km":"អ្វីដែលត្រូវរៀបចំ នៅពេលក្រុមការងារ ឆាក និងឧបករណ៍ត្រូវធ្វើដំណើរទូទាំងកម្ពុជា។","zh":"当团队、舞台和设备需要走遍柬埔寨时，制作方案会有哪些变化。"}'::jsonb,
    '/images/mpg/hero-backstage-v2.png', 'Field notes', 'MPG Production Team', true, '2026-08-01T00:00:00Z',
    '{"en":"Taking an event beyond Phnom Penh","km":"ការរៀបចំព្រឹត្តិការណ៍ក្រៅរាជធានីភ្នំពេញ","zh":"把活动带到金边以外"}'::jsonb
  )
on conflict (slug) do update set
  cover_image = excluded.cover_image;
