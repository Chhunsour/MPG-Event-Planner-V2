import type { FaqItem } from '@/components/seo/json-ld';

export function getFaqs(locale: string): FaqItem[] {
  if (locale === 'km') {
    return [
      {
        question: 'តើ MPG Event Planner ផ្តល់សេវាកម្មរៀបចំកម្មវិធីអ្វីខ្លះនៅកម្ពុជា?',
        answer: 'MPG Event Planner ផ្តល់សេវាកម្មរៀបចំកម្មវិធីពេញលេញ រួមមាន ពិធីបើកសម្ពោធ កម្មវិធីសាជីវកម្ម ការរៀបចំឆាក ភ្លើង សំឡេង អេក្រង់ LED និងការគ្រប់គ្រងកម្មវិធីទូទាំងប្រទេសកម្ពុជា។',
      },
      {
        question: 'តើ MPG Event Planner ផ្តល់សេវាកម្មនៅខេត្តណាខ្លះ?',
        answer: 'ទីស្នាក់ការកណ្តាលរបស់យើងស្ថិតនៅរាជធានីភ្នំពេញ ហើយយើងខ្ញុំផ្តល់សេវាកម្មរៀបចំកម្មវិធីទូទាំង ២៥ រាជធានី-ខេត្ត ក្នុងព្រះរាជាណាចក្រកម្ពុជា រួមមាន សៀមរាប ព្រះសីហនុ បាត់ដំបង និងកំពត។',
      },
      {
        question: 'តើការរៀបចំកម្មវិធីគួរកក់ទុកមុនប៉ុន្មានថ្ងៃ?',
        answer: 'យើងខ្ញុំអនុសាសន៍ឱ្យកក់ទុកមុនពី ២ ទៅ ៦ សប្តាហ៍ សម្រាប់កម្មវិធីសាជីវកម្ម និងពិធីបើកសម្ពោធធំៗ ដើម្បីមានពេលគ្រប់គ្រាន់ក្នុងការរចនា និងរៀបចំ។',
      },
      {
        question: 'តើ MPG Event Planner ផ្តល់សេវាជួលឆាក អេក្រង់ LED ភ្លើង និងសំឡេងផ្ទាល់ខ្លួនឬទេ?',
        answer: 'បាទ/ចាស MPG Event Planner មានឧបករណ៍បច្ចេកវិទ្យា និងសំឡេង-ពន្លឺផ្ទាល់ខ្លួន ដូចជា អេក្រង់ LED P2.5/P3.9 ប្រព័ន្ធសំឡេងកម្រិតប្រគំតន្ត្រី ភ្លើងអាជីព រចនាសម្ព័ន្ធឆាក និងក្រុមបច្ចេកទេសជំនាញ។',
      },
      {
        question: 'តើក្រុមហ៊ុនមានជួយសម្រួលឯកសារអនុញ្ញាត និងពិធីការភ្ញៀវកិត្តិយស (VIP) ដែរឬទេ?',
        answer: 'ពិតប្រាកដណាស់! យើងខ្ញុំផ្តល់សេវាកម្មសម្របសម្រួលលិខិតអនុញ្ញាតពីអាជ្ញាធរមូលដ្ឋាន ពិធីការកាត់ខ្សែបូ VIP អ្នកសម្របសម្រួលកម្មវិធី (MC) ច្រើនភាសា (ខ្មែរ អង់គ្លេស ចិន) និងការគ្រប់គ្រងសន្តិសុខ។',
      },
      {
        question: 'តើការគិតថ្លៃសេវាកម្ម និងការជួលឧបករណ៍មានទម្រង់បែបណា?',
        answer: 'តម្លៃត្រូវបានគណនាតាមទំហំកម្មវិធី ទីតាំង និងតម្រូវការបច្ចេកទេសជាក់ស្តែង។ យើងខ្ញុំផ្តល់ជូននូវសម្រង់តម្លៃច្បាស់លាស់ ដោយគ្មានការចំណាយលាក់កំបាំងឡើយ។',
      },
      {
        question: 'តើខ្ញុំអាចស្នើសុំសម្រង់តម្លៃ (Quotation) យ៉ាងដូចម្តេច?',
        answer: 'លោកអ្នកអាចផ្ញើព័ត៌មានកម្មវិធីតាមរយៈទម្រង់ទំនាក់ទំនងនៅលើគេហទំព័រ ឬអ៊ីមែល hello@mpgeventplanner.com។ ក្រុមការងារនឹងឆ្លើយតបក្នុងរង្វង់ ២៤ ម៉ោង។',
      },
    ];
  }

  if (locale === 'zh') {
    return [
      {
        question: 'MPG Event Planner 在柬埔寨提供哪些活动策划服务？',
        answer: '我们提供一站式活动策划服务，包括企业开业典礼、周年庆典、产品发布会、舞台与音响灯光设计搭建以及全国性的活动制作。',
      },
      {
        question: '服务范围是否涵盖金边以外的城市？',
        answer: '我们的总部位于金边，服务范围覆盖柬埔寨全境，包括暹粒、西哈努克港、马德望及贡布等城市。',
      },
      {
        question: '需要提前多久预订活动策划服务？',
        answer: '建议提前 2 至 6 周进行预订，以便我们的专业团队有充裕时间完成场地设计、审批流程、设备准备与彩排。',
      },
      {
        question: 'MPG Event Planner 是否拥有自己的舞台、LED 屏幕及音响灯光设备？',
        answer: '是的，我们拥有全套高规格音响系统、P2.5/P3.9 室内外 LED 显示屏、智能灯光系统及定制桁架，并配备经验丰富的现场技术人员。',
      },
      {
        question: '是否协助办理柬埔寨当地政府批文及贵宾（VIP）礼仪接待？',
        answer: '是的。我们提供全方位的活动统筹服务，包括当地政府部门报备批文、VIP 剪彩礼仪流程、多语种主持（中/英/高棉语）及现场安保协调。',
      },
      {
        question: '活动策划与设备租赁的报价方式是怎样的？',
        answer: '我们根据活动规模、场地条件和技术要求进行定制化精细报价，明码标价，无任何隐形消费，涵盖从单项设备租赁到全案统筹策划。',
      },
      {
        question: '如何获取活动制作与策划的详细报价单？',
        answer: '您可以随时通过网站在线表格提交需求，或发送邮件至 hello@mpgeventplanner.com，我们的专业团队将在 24 小时内为您提供定制化方案与详细报价。',
      },
    ];
  }

  return [
    {
      question: 'What event planning services does MPG Event Planner provide in Cambodia?',
      answer: 'MPG Event Planner provides end-to-end event planning, stage design, LED screen and audio-visual rentals, grand opening ceremonies, corporate galas, product launches, exhibitions, and venue production across Phnom Penh and all provinces in Cambodia.',
    },
    {
      question: 'Where is MPG Event Planner located and what areas do you serve?',
      answer: 'Our headquarters is located in Phnom Penh, Cambodia. We service corporate and private events nationwide across Cambodia, including Siem Reap, Sihanoukville, Battambang, and Kampot.',
    },
    {
      question: 'How early should we book an event planner for a corporate event or grand opening?',
      answer: 'We recommend booking 2 to 6 weeks in advance for corporate ceremonies and major exhibitions to allow adequate time for concept approval, permits, stage fabrication, and technical rehearsals.',
    },
    {
      question: 'Does MPG Event Planner handle custom stage design, lighting, sound system, and LED screen rentals in-house?',
      answer: 'Yes, MPG Event Planner manages all audiovisual production in-house. We own and operate concert-grade sound rigs, P2.5/P3.9 indoor and outdoor LED video walls, intelligent moving head lighting systems, custom truss structures, and VIP staging equipment with dedicated technical crew and sound engineers.',
    },
    {
      question: 'Do you assist with local municipal permits, venue permissions, and VIP protocol for official events in Phnom Penh?',
      answer: 'Absolutely. We provide comprehensive event coordination in Cambodia, including local authority permits, traffic and security coordination, VIP ribbon-cutting protocol, multi-lingual MC sourcing (Khmer, English, Chinese), and red-carpet guest management.',
    },
    {
      question: 'How is pricing structured for corporate events, grand openings, and equipment rentals?',
      answer: 'Our pricing is fully customized based on event scale, venue size, technical requirements, and production specs. We provide itemized, transparent quotations with no hidden costs—ranging from modular equipment rental packages to turnkey multi-day corporate production.',
    },
    {
      question: 'How can I request a quotation for event production?',
      answer: 'You can submit your event brief via our online Contact & Quotation form, or email hello@mpgeventplanner.com. Our team responds within 24 hours with a custom proposal and cost estimate.',
    },
  ];
}
