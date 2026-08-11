import type { Metadata } from 'next';
import { PageIntro } from '@/components/site/page-intro';
import { getSiteSettings } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  const titles: Record<Locale, string> = {
    en: 'Privacy Policy & Data Security — MPG Event Planner',
    km: 'គោលការណ៍ឯកជនភាព — MPG Event Planner',
    zh: '隐私政策与数据安全 — MPG 活动策划',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Privacy Policy and data protection commitment of MPG Event Planner in Phnom Penh, Cambodia.',
    km: 'គោលការណ៍ឯកជនភាព និងការការពារទិន្នន័យអតិថិជនរបស់ MPG Event Planner នៅកម្ពុជា។',
    zh: 'MPG 活动策划的隐私政策与客户数据安全承诺。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}/privacy`,
    locale,
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const settings = await getSiteSettings();
  const copy = messages[locale].privacy;

  return (
    <>
      <PageIntro eyebrow={ui[locale].contact} title={copy.title} description={copy.content} />
      <section className="band-lg">
        <div className="shell content-rich">
          <p>{copy.content}</p>
          <h2>{locale === 'en' ? 'Questions' : locale === 'km' ? 'សំណួរ' : '问题'}</h2>
          <p>
            <a href={`mailto:${settings.company_email}`}>{settings.company_email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
