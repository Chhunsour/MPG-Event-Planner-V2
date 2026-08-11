import type { Metadata } from 'next';
import { PageIntro } from '@/components/site/page-intro';
import { LocationMapCard } from '@/components/site/location-map-card';
import { QuotationForm } from '@/components/site/quotation-form';
import { FaqSection } from '@/components/site/faq-section';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { getSiteSettings } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  const titles: Record<Locale, string> = {
    en: 'Contact & Event Quotation Request — MPG Event Planner Phnom Penh',
    km: 'ទំនាក់ទំនង និងស្វែងរកការសម្រង់តម្លៃ — MPG Event Planner ភ្នំពេញ',
    zh: '联系我们与获取活动预算报价 — MPG 活动策划 金边',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Contact MPG Event Planner in Phnom Penh, Cambodia. Request a free quotation for your grand opening, corporate ceremony, stage design, or equipment rentals.',
    km: 'ទាក់ទងមក MPG Event Planner នៅភ្នំពេញ កម្ពុជា។ ស្វែងរកការសម្រង់តម្លៃដោយឥតគិតថ្លៃសម្រាប់ពិធីបើកសម្ពោធ កម្មវិធីសាជីវកម្ម និងការដំឡើងឆាក។',
    zh: '联系金边 MPG 活动策划团队。即刻在线提交您的活动需求，免费获取开业典礼、企业盛典及舞美设备定制报价。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}/contact`,
    locale,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const labels = ui[locale];
  const settings = await getSiteSettings();
  const copy = messages[locale].contact_form;
  const detailLabels = locale === 'km'
    ? { brief: 'ព័ត៌មានកម្មវិធី', email: 'អ៊ីមែល', response: 'ការឆ្លើយតប' }
    : locale === 'zh'
    ? { brief: '活动需求', email: '邮箱', response: '回复时间' }
    : { brief: 'Event brief', email: 'Email', response: 'Response' };

  const contactFaqs = locale === 'km' ? [
    {
      question: 'តើខ្ញុំទទួលបានការសម្រង់តម្លៃលឿនប៉ុណ្ណា?',
      answer: 'ក្រុមការងាររបស់យើងខ្ញុំនឹងឆ្លើយតប និងផ្ញើលិខិតសម្រង់តម្លៃក្នុងរយៈពេល ២៤ ម៉ោង បន្ទាប់ពីទទួលបានព័ត៌មានកម្មវិធី។',
    },
    {
      question: 'តើការពិភាក្សាដំបូងមានគិតថ្លៃដែរឬទេ?',
      answer: 'ការពិភាក្សាដំបូង និងការស្វែងយល់ពីតម្រូវការកម្មវិធីគឺឥតគិតថ្លៃទាំងអស់។',
    },
  ] : locale === 'zh' ? [
    {
      question: '提交表单后多久能收到活动方案与报价？',
      answer: '我们的项目经理将在 24 小时内与您取得联系，并提供初步方案与明细报价单。',
    },
    {
      question: '前期咨询与场地勘测是否收费？',
      answer: '初期的需求沟通、方案咨询及金边市内的现场勘测均为免费服务。',
    },
  ] : [
    {
      question: 'How quickly will I receive an event quotation?',
      answer: 'Our production team will review your brief and respond with a preliminary proposal and cost estimate within 24 hours.',
    },
    {
      question: 'Is initial event consultation free of charge?',
      answer: 'Yes, initial consultations, concept discussions, and site inspections in Phnom Penh are completely free with no obligation.',
    },
  ];

  return (
    <>
      <PageIntro eyebrow={labels.contact} title={labels.quotationTitle} description={labels.quotationIntro}>
        <LocationMapCard locale={locale} className="mt-4" />
      </PageIntro>
      <section className="contact-section">
        <div className="shell contact-section__grid">
          <div className="contact-section__form" data-reveal>
            <p className="micro-label">{detailLabels.brief}</p>
            <h2>{copy.title}</h2>
            <QuotationForm locale={locale} />
          </div>
          <aside className="contact-card" data-reveal>
            <div className="contact-card__image" aria-hidden="true" />
            <p className="micro-label micro-label--light">{copy.officeLabel}</p>
            <h2>{copy.officeTitle}</h2>
            <p>{copy.intro}</p>
            <div>
              <span>{detailLabels.email}</span>
              <a href={`mailto:${settings.company_email}`}>{settings.company_email}</a>
            </div>
            {settings.phone && (
              <div>
                <span>{labels.phone}</span>
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}>{settings.phone}</a>
              </div>
            )}
            <div>
              <span>{detailLabels.response}</span>
              <p>{copy.reply_note}</p>
            </div>
          </aside>
        </div>
      </section>
      <FaqSection title={locale === 'km' ? 'សំណួរទាក់ទងនឹងការទាក់ទង' : locale === 'zh' ? '咨询与报价常见问题' : 'Quotation FAQs'} faqs={contactFaqs} />
    </>
  );
}
