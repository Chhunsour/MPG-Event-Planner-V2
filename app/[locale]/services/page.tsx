import type { Metadata } from 'next';
import { ContentCard } from '@/components/site/content-card';
import { PageIntro } from '@/components/site/page-intro';
import { FaqSection } from '@/components/site/faq-section';
import { getPublicContent } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  const titles: Record<Locale, string> = {
    en: 'Event Planning Services & Production Capabilities in Cambodia',
    km: 'សេវាកម្មរៀបចំកម្មវិធី និងផលិតកម្មនៅកម្ពុជា',
    zh: '柬埔寨专业活动策划与舞台制作服务能力',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Explore MPG Event Planner services: grand opening ceremony management, corporate galas, stage design & AV tech, exhibition booths, and full event production in Phnom Penh, Cambodia.',
    km: 'ស្វែងយល់ពីសេវាកម្មរបស់ MPG Event Planner៖ ពិធីបើកសម្ពោធ កម្មវិធីសាជីវកម្ម ការរចនាឆាក អេក្រង់ LED និងការគ្រប់គ្រងកម្មវិធីនៅភ្នំពេញ និងទូទាំងកម្ពុជា។',
    zh: '探索 MPG 活动策划服务：企业开业典礼、周年晚会、舞台设计与灯光音响、展会搭建及全案活动执行。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}/services`,
    locale,
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const { services } = await getPublicContent();
  const labels = ui[locale];
  const copy = messages[locale].services;

  const faqs = locale === 'km' ? [
    {
      question: 'តើការរៀបចំពិធីបើកសម្ពោធរួមបញ្ចូលអ្វីខ្លះ?',
      answer: 'រួមបញ្ចូលការរចនាឆាក ការដំឡើងអំពូលភ្លើង អេក្រង់ LED ប្រព័ន្ធសំឡេង ការរៀបចំខ្សែបូរកាត់ និងក្រុមការងារគ្រប់គ្រងកម្មវិធីទាំងមូល។',
    },
    {
      question: 'តើ MPG អាចផ្តល់ឧបករណ៍សំឡេង និងភ្លើងសម្រាប់កម្មវិធីធំៗបានទេ?',
      answer: 'បាទ/ចាស យើងខ្ញុំមានឧបករណ៍បច្ចេកវិទ្យាទំនើបពេញលេញសម្រាប់ការសម្តែងផ្ទាល់ កម្មវិធីសាជីវកម្ម និងពិធីការធំៗ។',
    },
  ] : locale === 'zh' ? [
    {
      question: '开业典礼策划包含哪些具体内容？',
      answer: '包含舞台设计搭建、LED大屏与音响灯光系统、剪彩仪式道具筹备、主持与演艺人员协调及全程活动控场。',
    },
    {
      question: '你们能否承接大型大型展会与大型舞台制作？',
      answer: '可以。我们拥有成熟的施工团队与专业级视听设备，能够高效高质量完成大型展会与专业舞台搭建。',
    },
  ] : [
    {
      question: 'What is included in your Grand Opening ceremony management?',
      answer: 'Our grand opening service includes complete stage fabrication, red ribbon cutting setup, LED screen displays, professional sound and lighting, RSVP management, and on-site event coordination.',
    },
    {
      question: 'Do you provide full Audio-Visual (AV) equipment and stage fabrication?',
      answer: 'Yes, MPG Event Planner owns and operates professional concert-grade sound systems, indoor/outdoor LED screens, moving intelligent lighting, and custom stage structures.',
    },
  ];

  return (
    <>
      <PageIntro eyebrow={copy.label || labels.services} title={copy.title} description={copy.subtitle} />
      <section className="collection-section">
        <div className="shell collection-grid collection-grid--services">
          {services.map((item, index) => (
            <ContentCard key={item.id} item={item} locale={locale} type="service" index={index} />
          ))}
        </div>
      </section>
      <FaqSection title={locale === 'km' ? 'សំណួរទាក់ទងនឹងសេវាកម្ម' : locale === 'zh' ? '服务相关常见问题' : 'Service FAQs'} faqs={faqs} />
    </>
  );
}
