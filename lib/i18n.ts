import type { Locale } from '@/lib/types';
import enMessages from './locales/en.json';
import kmMessages from './locales/km.json';
import zhMessages from './locales/zh.json';

export const messages = { en: enMessages, km: kmMessages, zh: zhMessages } as const;

export const ui: Record<Locale, {
  home: string;
  about: string;
  services: string;
  projects: string;
  journal: string;
  contact: string;
  enquire: string;
  viewAll: string;
  readMore: string;
  language: string;
  allWork: string;
  getStarted: string;
  quotationTitle: string;
  quotationIntro: string;
  submit: string;
  submitting: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  message: string;
  success: string;
  footer: string;
}> = {
  en: {
    home: 'Home', about: 'About', services: 'Services', projects: 'Projects', journal: 'Journal',
    contact: 'Contact', enquire: 'Start a conversation', viewAll: 'View all', readMore: 'Read story',
    language: 'Language', allWork: 'All work', getStarted: 'Get a quotation',
    quotationTitle: 'Tell us what you are building.',
    quotationIntro: 'Share the shape of your event. We will come back with a clear production plan.',
    submit: 'Send enquiry', submitting: 'Sending…', name: 'Your name', company: 'Company',
    phone: 'Phone / Telegram', email: 'Email', eventType: 'Event type', eventDate: 'Event date',
    location: 'Event location', message: 'What should we know?', success: 'Thanks — your enquiry is with the MPG team.',
    footer: 'Event planning, production and a good reason to gather.',
  },
  km: {
    home: 'ទំព័រដើម', about: 'អំពីយើង', services: 'សេវាកម្ម', projects: 'គម្រោង', journal: 'អត្ថបទ',
    contact: 'ទំនាក់ទំនង', enquire: 'ចាប់ផ្តើមការសន្ទនា', viewAll: 'មើលទាំងអស់', readMore: 'អានបន្ថែម',
    language: 'ភាសា', allWork: 'ការងារទាំងអស់', getStarted: 'ស្នើសុំតម្លៃ',
    quotationTitle: 'ប្រាប់យើងអំពីអ្វីដែលអ្នកកំពុងរៀបចំ។',
    quotationIntro: 'ចែករំលែកព័ត៌មានអំពីព្រឹត្តិការណ៍របស់អ្នក។ យើងនឹងត្រឡប់មកជាមួយផែនការច្បាស់លាស់។',
    submit: 'ផ្ញើសំណើ', submitting: 'កំពុងផ្ញើ…', name: 'ឈ្មោះរបស់អ្នក', company: 'ក្រុមហ៊ុន',
    phone: 'ទូរស័ព្ទ / Telegram', email: 'អ៊ីមែល', eventType: 'ប្រភេទព្រឹត្តិការណ៍',
    eventDate: 'កាលបរិច្ឆេទ', location: 'ទីតាំង', message: 'ព័ត៌មានបន្ថែម', success: 'អរគុណ — ក្រុមការងារ MPG បានទទួលសំណើរបស់អ្នក។',
    footer: 'ការរៀបចំ និងផលិតព្រឹត្តិការណ៍សម្រាប់មនុស្សដែលចង់ជួបជុំ។',
  },
  zh: {
    home: '首页', about: '关于我们', services: '服务', projects: '项目', journal: '文章',
    contact: '联系', enquire: '开始沟通', viewAll: '查看全部', readMore: '阅读文章',
    language: '语言', allWork: '全部项目', getStarted: '获取报价',
    quotationTitle: '告诉我们你正在打造什么。',
    quotationIntro: '分享你的活动方向，我们会带着清晰的制作方案回来。',
    submit: '发送咨询', submitting: '发送中…', name: '姓名', company: '公司',
    phone: '电话 / Telegram', email: '邮箱', eventType: '活动类型', eventDate: '活动日期',
    location: '活动地点', message: '还有什么需要了解？', success: '谢谢 — MPG 团队已收到你的咨询。',
    footer: '活动策划、制作，以及一个值得相聚的理由。',
  },
};

export function localeFromParam(value: string): Locale {
  return value === 'km' || value === 'zh' ? value : 'en';
}
