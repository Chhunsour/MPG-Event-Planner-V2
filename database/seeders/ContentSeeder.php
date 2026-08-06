<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Moves the content that used to be hardcoded in the Next.js app into the
 * database, so switching the frontend to the API changes nothing visible.
 *
 * Idempotent: re-running updates the same slugs rather than duplicating them,
 * and it never overwrites an image an admin has since uploaded.
 */
class ContentSeeder extends Seeder
{
    /** Photographs shipped with the frontend, copied into storage on first run. */
    private const FRONTEND_IMAGES = __DIR__.'/../../../public/images/mpg';

    public function run(): void
    {
        $services = [
            [
                'slug' => 'grand-opening',
                'image' => 'hero-main.webp',
                'is_featured' => true,
                'title' => ['en' => 'Grand Opening Ceremony', 'km' => 'ពិធីបើកសម្ពោធជាផ្លូវការ', 'zh' => '开业典礼'],
                'short' => [
                    'en' => 'Ribbon cutting, stage, decoration and full ceremony production.',
                    'km' => 'ការកាត់ខ្សែបូ ឆាក ការតុបតែង និងផលិតកម្មពិធីពេញលេញ។',
                    'zh' => '剪彩、舞台、装饰与整场典礼制作。',
                ],
                'description' => [
                    'en' => 'Complete production, VIP protocol, ribbon-cutting setup, custom decoration, and stage choreography.',
                    'km' => 'ផលិតកម្មពេញលេញ ពិធីការភ្ញៀវកិត្តិយស ការរៀបចំកាត់ខ្សែបូ ការតុបតែងតាមតម្រូវការ និងការរៀបចំឆាក។',
                    'zh' => '全案制作、贵宾礼仪、剪彩布置、定制装饰与舞台流程编排。',
                ],
                'capabilities' => [
                    ['en' => 'Entrance arch & backdrop', 'km' => 'ខ្លោងទ្វារ និងផ្ទាំងខាងក្រោយ', 'zh' => '入口拱门与背景板'],
                    ['en' => 'Ribbon-cutting setup', 'km' => 'ការរៀបចំកាត់ខ្សែបូ', 'zh' => '剪彩布置'],
                    ['en' => 'Sound & stage lighting', 'km' => 'សំឡេង និងពន្លឺឆាក', 'zh' => '音响与舞台灯光'],
                    ['en' => 'Guest & VIP coordination', 'km' => 'ការទទួលភ្ញៀវកិត្តិយស', 'zh' => '来宾与贵宾接待'],
                ],
            ],
            [
                'slug' => 'product-launch',
                'image' => 'project-5.webp',
                'title' => ['en' => 'Product & Sales Launching', 'km' => 'ការបើកដំណើរការផលិតផល', 'zh' => '新品与销售发布会'],
                'short' => [
                    'en' => 'Launch stages, LED screens and press-ready presentation setups.',
                    'km' => 'ឆាកបើកដំណើរការ អេក្រង់ LED និងការរៀបចំសម្រាប់សារព័ត៌មាន។',
                    'zh' => '发布舞台、LED 屏幕与媒体发布布置。',
                ],
                'description' => [
                    'en' => 'Impactful launch campaigns, experiential setups, and creative media events to boost market entry.',
                    'km' => 'យុទ្ធនាការបើកដំណើរការដ៏មានឥទ្ធិពល ការរៀបចំបទពិសោធន៍ និងកម្មវិធីប្រព័ន្ធផ្សព្វផ្សាយ។',
                    'zh' => '具有影响力的发布活动、体验式布置与创意媒体活动，助力产品进入市场。',
                ],
                'capabilities' => [
                    ['en' => 'Launch stage & reveal', 'km' => 'ឆាក និងការបង្ហាញផលិតផល', 'zh' => '发布舞台与揭幕'],
                    ['en' => 'LED screen & visuals', 'km' => 'អេក្រង់ LED និងរូបភាព', 'zh' => 'LED 屏幕与视觉'],
                    ['en' => 'Presentation sound', 'km' => 'សំឡេងសម្រាប់បទបង្ហាញ', 'zh' => '演讲音响'],
                    ['en' => 'Press & media setup', 'km' => 'ការរៀបចំសារព័ត៌មាន', 'zh' => '媒体接待布置'],
                ],
            ],
            [
                'slug' => 'groundbreaking',
                'image' => 'service-groundbreaking.webp',
                'title' => ['en' => 'Groundbreaking Ceremony', 'km' => 'ពិធីជ្រលងគ្រឹះ', 'zh' => '奠基仪式'],
                'short' => [
                    'en' => 'Outdoor ceremony builds for construction and development milestones.',
                    'km' => 'ការរៀបចំពិធីនៅខាងក្រៅសម្រាប់គម្រោងសំណង់ និងអភិវឌ្ឍន៍។',
                    'zh' => '面向工程与开发项目的户外仪式搭建。',
                ],
                'description' => [
                    'en' => 'Professional logistics for construction milestone ceremonies, complete with safety measures and stage building.',
                    'km' => 'ការរៀបចំដឹកជញ្ជូនប្រកបដោយវិជ្ជាជីវៈសម្រាប់ពិធីសម្គាល់គម្រោងសំណង់។',
                    'zh' => '为工程节点仪式提供专业统筹，包含安全措施与舞台搭建。',
                ],
                'capabilities' => [
                    ['en' => 'Outdoor canopy & seating', 'km' => 'តង់ និងកៅអីខាងក្រៅ', 'zh' => '户外篷房与座位'],
                    ['en' => 'Ceremonial sand & shovels', 'km' => 'ខ្សាច់ និងចបពិធីការ', 'zh' => '礼仪沙堆与铁锹'],
                    ['en' => 'Power & sound on site', 'km' => 'ចរន្តអគ្គិសនី និងសំឡេង', 'zh' => '现场供电与音响'],
                    ['en' => 'Provincial logistics', 'km' => 'ការដឹកជញ្ជូនតាមខេត្ត', 'zh' => '各省物流运输'],
                ],
            ],
            [
                'slug' => 'roadshow-exhibition',
                'image' => 'service-roadshow.webp',
                'title' => ['en' => 'Roadshow & Exhibition', 'km' => 'រ៉ូដសូ និងពិព័រណ៍', 'zh' => '路演与展览'],
                'short' => [
                    'en' => 'Booth construction, activations and multi-city roadshow support.',
                    'km' => 'ការសាងសង់ស្តង់ សកម្មភាពផ្សព្វផ្សាយ និងរ៉ូដសូតាមទីក្រុងច្រើន។',
                    'zh' => '展位搭建、商场活动与多城市路演支持。',
                ],
                'description' => [
                    'en' => 'Custom exhibition booth construction, mall activations, and roadshow coordination across major provinces.',
                    'km' => 'ការសាងសង់ស្តង់ពិព័រណ៍តាមតម្រូវការ សកម្មភាពនៅផ្សារទំនើប និងការសម្របសម្រួលរ៉ូដសូ។',
                    'zh' => '定制展位搭建、商场活动，以及覆盖主要省份的路演统筹。',
                ],
                'capabilities' => [
                    ['en' => 'Custom booth build', 'km' => 'ការសាងសង់ស្តង់', 'zh' => '定制展位搭建'],
                    ['en' => 'Branded displays', 'km' => 'ការបង្ហាញម៉ាកយីហោ', 'zh' => '品牌展示'],
                    ['en' => 'Sound & presentation', 'km' => 'សំឡេង និងបទបង្ហាញ', 'zh' => '音响与演示'],
                    ['en' => 'Transport between cities', 'km' => 'ការដឹកជញ្ជូនរវាងទីក្រុង', 'zh' => '城市间运输'],
                ],
            ],
            [
                'slug' => 'seminar-corporate',
                'image' => 'service-seminar.webp',
                'title' => ['en' => 'Seminar & Corporate Event', 'km' => 'សិក្ខាសាលា និងកម្មវិធីសាជីវកម្ម', 'zh' => '研讨会与企业活动'],
                'short' => [
                    'en' => 'Conferences, annual meetings, gala dinners and award nights.',
                    'km' => 'សន្និសីទ អង្គប្រជុំប្រចាំឆ្នាំ ពិធីជប់លៀង និងពិធីប្រគល់រង្វាន់។',
                    'zh' => '会议、年会、晚宴与颁奖典礼。',
                ],
                'description' => [
                    'en' => 'Conferences, annual general meetings, gala dinners, team building, and business forums.',
                    'km' => 'សន្និសីទ អង្គប្រជុំសាមញ្ញប្រចាំឆ្នាំ ពិធីជប់លៀង និងវេទិកាអាជីវកម្ម។',
                    'zh' => '会议、股东年会、晚宴、团队建设与商务论坛。',
                ],
                'capabilities' => [
                    ['en' => 'Stage & podium setup', 'km' => 'ឆាក និងវេទិកា', 'zh' => '舞台与演讲台'],
                    ['en' => 'Conference sound', 'km' => 'សំឡេងសម្រាប់សន្និសីទ', 'zh' => '会议音响'],
                    ['en' => 'Screen & projection', 'km' => 'អេក្រង់ និងការបញ្ចាំង', 'zh' => '屏幕与投影'],
                    ['en' => 'Programme management', 'km' => 'ការគ្រប់គ្រងកម្មវិធី', 'zh' => '流程管理'],
                ],
            ],
            [
                'slug' => 'equipment-rental',
                'image' => 'service-rental.webp',
                'title' => ['en' => 'Event Equipment Rental', 'km' => 'ការជួលឧបករណ៍កម្មវិធី', 'zh' => '活动设备租赁'],
                'short' => [
                    'en' => 'Staging, truss, sound, lighting and LED screens with our crew.',
                    'km' => 'ឆាក ដែក សំឡេង ពន្លឺ និងអេក្រង់ LED ជាមួយក្រុមការងាររបស់យើង។',
                    'zh' => '舞台、桁架、音响、灯光与 LED 屏幕，含操作团队。',
                ],
                'description' => [
                    'en' => 'LED walls, professional sound and lighting rigs, stage structures, VIP seating, and tents.',
                    'km' => 'អេក្រង់ LED គុណភាពខ្ពស់ ប្រព័ន្ធសំឡេង និងពន្លឺជាអាជីព រចនាសម្ព័ន្ធឆាក និងតង់។',
                    'zh' => '高清 LED 屏幕、专业音响与灯光设备、舞台结构、贵宾座椅与篷房。',
                ],
                'capabilities' => [
                    ['en' => 'Stage & truss structures', 'km' => 'រចនាសម្ព័ន្ធឆាក និងដែក', 'zh' => '舞台与桁架结构'],
                    ['en' => 'Sound systems', 'km' => 'ប្រព័ន្ធសំឡេង', 'zh' => '音响系统'],
                    ['en' => 'Stage lighting', 'km' => 'ពន្លឺឆាក', 'zh' => '舞台灯光'],
                    ['en' => 'LED screens', 'km' => 'អេក្រង់ LED', 'zh' => 'LED 屏幕'],
                ],
            ],
        ];

        foreach ($services as $index => $row) {
            $service = Service::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'title_en' => $row['title']['en'],
                    'title_km' => $row['title']['km'],
                    'title_zh' => $row['title']['zh'],
                    'short_description_en' => $row['short']['en'],
                    'short_description_km' => $row['short']['km'],
                    'short_description_zh' => $row['short']['zh'],
                    'description_en' => $row['description']['en'],
                    'description_km' => $row['description']['km'],
                    'description_zh' => $row['description']['zh'],
                    'display_order' => $index,
                    'is_featured' => $row['is_featured'] ?? false,
                    'is_published' => true,
                ]
            );

            if (! $service->image) {
                $service->update(['image' => $this->copyImage($row['image'], 'services')]);
            }

            $service->capabilities()->delete();
            foreach ($row['capabilities'] as $order => $capability) {
                $service->capabilities()->create([
                    'label_en' => $capability['en'],
                    'label_km' => $capability['km'],
                    'label_zh' => $capability['zh'],
                    'display_order' => $order,
                ]);
            }
        }

        $projects = [
            ['slug' => 'outdoor-grand-opening-ceremony', 'service' => 'grand-opening', 'image' => 'project-1.webp', 'featured' => true,
                'title' => ['en' => 'Outdoor Grand Opening Ceremony', 'km' => 'ពិធីបើកសម្ពោធជាផ្លូវការនៅខាងក្រៅ', 'zh' => '户外开业剪彩典礼'],
                'desc' => ['en' => 'Entrance arch, red carpet, ribbon cutting, guest seating and sound.', 'km' => 'ខ្លោងទ្វារចូល ព្រំក្រហម ការកាត់ខ្សែបូ កៅអីភ្ញៀវ និងសំឡេង។', 'zh' => '入口拱门、红毯、剪彩、来宾座位与音响。']],
            ['slug' => 'corporate-headquarters-opening', 'service' => 'grand-opening', 'image' => 'hero-main.webp',
                'title' => ['en' => 'Corporate Headquarters Opening', 'km' => 'ពិធីបើកសម្ពោធការិយាល័យកណ្តាល', 'zh' => '企业总部开业典礼'],
                'desc' => ['en' => 'Stage backdrop, floral arch, ribbon-cutting setup and guest seating.', 'km' => 'ផ្ទាំងឆាក ខ្លោងទ្វារផ្កា ការរៀបចំកាត់ខ្សែបូ និងកៅអីភ្ញៀវ។', 'zh' => '舞台背景板、花艺拱门、剪彩布置与来宾座位。']],
            ['slug' => 'corporate-ceremony-awards-night', 'service' => 'seminar-corporate', 'image' => 'contact-quote.webp', 'featured' => true,
                'title' => ['en' => 'Corporate Ceremony & Awards Night', 'km' => 'ពិធីសាជីវកម្ម និងរាត្រីប្រគល់រង្វាន់', 'zh' => '企业典礼与颁奖之夜'],
                'desc' => ['en' => 'Stage build, lighting design, sound and programme management.', 'km' => 'ការសាងសង់ឆាក ការរចនាពន្លឺ សំឡេង និងការគ្រប់គ្រងកម្មវិធី។', 'zh' => '舞台搭建、灯光设计、音响与流程管理。']],
            ['slug' => 'product-launch-stage', 'service' => 'product-launch', 'image' => 'project-5.webp',
                'title' => ['en' => 'Product Launch Stage', 'km' => 'ឆាកបើកដំណើរការផលិតផល', 'zh' => '新品发布舞台'],
                'desc' => ['en' => 'Launch stage, LED wall, lighting and presentation sound.', 'km' => 'ឆាកបើកដំណើរការ អេក្រង់ LED ពន្លឺ និងសំឡេងបទបង្ហាញ។', 'zh' => '发布舞台、LED 屏幕、灯光与演讲音响。']],
            ['slug' => 'conference-business-summit', 'service' => 'seminar-corporate', 'image' => 'service-seminar.webp',
                'title' => ['en' => 'Conference & Business Summit', 'km' => 'សន្និសីទ និងវេទិកាអាជីវកម្ម', 'zh' => '会议与商务峰会'],
                'desc' => ['en' => 'Wide LED screen, stage lighting, conference sound and seating.', 'km' => 'អេក្រង់ LED ធំ ពន្លឺឆាក សំឡេងសន្និសីទ និងកៅអី។', 'zh' => '宽幅 LED 屏幕、舞台灯光、会议音响与座位。']],
            ['slug' => 'exhibition-booth-build', 'service' => 'roadshow-exhibition', 'image' => 'service-roadshow.webp',
                'title' => ['en' => 'Exhibition Booth Build', 'km' => 'ការសាងសង់ស្តង់ពិព័រណ៍', 'zh' => '展览展位搭建'],
                'desc' => ['en' => 'Custom booth construction, LED banner, displays and branding.', 'km' => 'ការសាងសង់ស្តង់តាមតម្រូវការ បដា LED ការតាំងបង្ហាញ និងម៉ាកយីហោ។', 'zh' => '定制展位搭建、LED 横幅、展示与品牌视觉。']],
            ['slug' => 'groundbreaking-ceremony-project', 'service' => 'groundbreaking', 'image' => 'service-groundbreaking.webp',
                'title' => ['en' => 'Groundbreaking Ceremony', 'km' => 'ពិធីជ្រលងគ្រឹះ', 'zh' => '奠基仪式'],
                'desc' => ['en' => 'Outdoor canopy, ceremonial sand and shovels, seating and sound.', 'km' => 'តង់ខាងក្រៅ ខ្សាច់ និងចបពិធីការ កៅអី និងសំឡេង។', 'zh' => '户外篷房、礼仪沙堆与铁锹、座位与音响。']],
            ['slug' => 'event-production-equipment', 'service' => 'equipment-rental', 'image' => 'service-rental.webp',
                'title' => ['en' => 'Event Production & Equipment', 'km' => 'ផលិតកម្មកម្មវិធី និងឧបករណ៍', 'zh' => '活动制作与设备'],
                'desc' => ['en' => 'Truss structure, line array sound, stage lighting and LED wall.', 'km' => 'រចនាសម្ព័ន្ធដែក ប្រព័ន្ធសំឡេង ពន្លឺឆាក និងអេក្រង់ LED។', 'zh' => '桁架结构、线阵音响、舞台灯光与 LED 屏幕。']],
        ];

        $serviceIds = Service::pluck('id', 'slug');

        foreach ($projects as $index => $row) {
            $project = Project::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'title_en' => $row['title']['en'],
                    'title_km' => $row['title']['km'],
                    'title_zh' => $row['title']['zh'],
                    'description_en' => $row['desc']['en'],
                    'description_km' => $row['desc']['km'],
                    'description_zh' => $row['desc']['zh'],
                    'service_id' => $serviceIds[$row['service']] ?? null,
                    'display_order' => $index,
                    'is_featured' => $row['featured'] ?? false,
                    'is_published' => true,
                    // client_name, location, event_date and year stay null: the
                    // real records have not been supplied, and inventing them
                    // would put false claims on a live marketing site.
                ]
            );

            if (! $project->cover_image) {
                $project->update(['cover_image' => $this->copyImage($row['image'], 'projects')]);
            }
        }

        $blogPosts = [
            [
                'slug' => 'maximizing-trade-show-roi-exhibition-booths',
                'image' => 'hero-main.webp',
                'title' => [
                    'en' => 'Maximizing Trade Show ROI with Modular Exhibition Booth Builds',
                    'km' => 'ការបង្កើនប្រសិទ្ធភាពពិព័រណ៍ពាណិជ្ជកម្មជាមួយការសាងសង់ស្តង់បែបម៉ូឌុល',
                    'zh' => '通过模块化展位搭建最大化展会投资回报',
                ],
                'excerpt' => [
                    'en' => 'How custom illumination, interactive layouts, and modern architecture draw foot traffic to your exhibit booth.',
                    'km' => 'របៀបដែលភ្លើងច្នៃប្រឌិត ប្លង់អន្តរកម្ម និងរចនាសម្ព័ន្ធទំនើប ទាក់ទាញភ្ញៀវមកកាន់ស្តង់ពិព័រណ៍របស់អ្នក។',
                    'zh' => '定制照明、互动布局与现代建筑如何吸引人流前往您的展位。',
                ],
            ],
            [
                'slug' => 'designing-high-impact-corporate-summits',
                'image' => 'service-seminar.webp',
                'title' => [
                    'en' => 'Designing High-Impact Corporate Summits and VIP Conferences',
                    'km' => 'ការរចនាសន្និសីទ និងវេទិកាអាជីវកម្មកម្រិត VIP ដ៏មានឥទ្ធិពល',
                    'zh' => '打造高影响力企业峰会与 VIP 会议',
                ],
                'excerpt' => [
                    'en' => 'A guide to stage lighting, acoustic control, and seamless audience engagement at regional corporate events.',
                    'km' => 'មគ្គុទ្ទេសក៍ពន្លឺឆាក ការគ្រប់គ្រងសំឡេង និងការចូលរួមរបស់ទស្សនិកជនក្នុងកម្មវិធីសាជីវកម្ម។',
                    'zh' => '区域企业活动中的舞台灯光、声学控制与观众互动指南。',
                ],
            ],
            [
                'slug' => 'key-strategies-grand-opening-phnom-penh',
                'image' => 'project-1.webp',
                'title' => [
                    'en' => 'Key Strategies for Planning a Landmark Grand Opening in Phnom Penh',
                    'km' => 'យុទ្ធសាស្ត្រសំខាន់ៗសម្រាប់រៀបចំពិធីបើកសម្ពោធដ៏ធំនៅភ្នំពេញ',
                    'zh' => '金边大型开业剪彩典礼策划的关键策略',
                ],
                'excerpt' => [
                    'en' => 'Discover how high-impact ribbon cutting ceremonies and VIP staging drive media coverage and corporate presence.',
                    'km' => 'ស្វែងយល់អំពីរបៀបដែលពិធីកាត់ខ្សែបូ និងឆាក VIP បង្កើនការចាប់អារម្មណ៍ពីប្រព័ន្ធផ្សព្វផ្សាយ។',
                    'zh' => '了解高规格剪彩仪式与 VIP 舞台如何提升媒体曝光与企业形象。',
                ],
            ],
            [
                'slug' => 'mastering-event-lighting-audio-acoustics',
                'image' => 'service-rental.webp',
                'title' => [
                    'en' => 'Mastering Event Lighting, Audio & Stage Acoustics',
                    'km' => 'ការគ្រប់គ្រងពន្លឺ សំឡេង និងសូរស័ព្ទឆាកកម្មវិធី',
                    'zh' => '掌握活动灯光、音响与舞台声学',
                ],
                'excerpt' => [
                    'en' => 'Essential technical insights on rigging truss structures, line-array speaker positioning, and LED screen visual synchronization for seamless corporate productions.',
                    'km' => 'ការយល់ដឹងអំពីបច្ចេកទេសសំខាន់ៗលើការដំឡើងរចនាសម្ព័ន្ធដែក ការកំណត់ទីតាំងសំឡេង និងការធ្វើសមកាលកម្មអេក្រង់ LED សម្រាប់កម្មវិធីសាជីវកម្ម។',
                    'zh' => '关于桁架结构搭建、线阵音响定位与 LED 屏幕视觉同步的关键技术指南，助力无缝企业级活动制作。',
                ],
            ],
        ];

        foreach ($blogPosts as $index => $row) {
            $post = BlogPost::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'title_en' => $row['title']['en'],
                    'title_km' => $row['title']['km'],
                    'title_zh' => $row['title']['zh'],
                    'excerpt_en' => $row['excerpt']['en'],
                    'excerpt_km' => $row['excerpt']['km'],
                    'excerpt_zh' => $row['excerpt']['zh'],
                    'content_en' => "<p>{$row['excerpt']['en']}</p>",
                    'content_km' => "<p>{$row['excerpt']['km']}</p>",
                    'content_zh' => "<p>{$row['excerpt']['zh']}</p>",
                    'is_published' => true,
                    'published_at' => now()->subDays($index * 2),
                ]
            );

            if (! $post->cover_image) {
                $post->update(['cover_image' => $this->copyImage($row['image'], 'blog')]);
            }
        }
    }

    /**
     * Copy a frontend photograph into storage so the DB owns its own copy.
     * Returns null when the source is missing, leaving the record image-less
     * rather than pointing at a path that will 404.
     */
    private function copyImage(string $filename, string $directory): ?string
    {
        $source = self::FRONTEND_IMAGES.'/'.$filename;

        if (! File::exists($source)) {
            $this->command?->warn("Seed image not found, skipping: {$filename}");

            return null;
        }

        $target = "{$directory}/seed-{$filename}";

        if (! Storage::disk('public')->exists($target)) {
            Storage::disk('public')->put($target, File::get($source));
        }

        return $target;
    }
}
