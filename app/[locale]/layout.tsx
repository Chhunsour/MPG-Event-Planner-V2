import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';
import { locales, type Locale } from '@/lib/types';
import { localeFromParam } from '@/lib/i18n';
import { MotionProvider } from '@/components/site/motion-provider';

import { getSiteSettings } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/json-ld';
import { CookieConsent } from '@/components/site/cookie-consent';
import { AnalyticsTracker } from '@/components/site/analytics-tracker';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParam(raw);
  const titles: Record<Locale, string> = {
    en: 'MPG Event Planner — Corporate Event Planning & Production in Cambodia',
    km: 'MPG Event Planner — ការរៀបចំ និងផលិតកម្មវិធីនៅកម្ពុជា',
    zh: 'MPG Event Planner — 柬埔寨专业企业活动策划与制作',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Premier event planning, grand opening ceremonies, corporate events, stage production, and equipment rentals in Phnom Penh and across Cambodia.',
    km: 'សេវាកម្មរៀបចំកម្មវិធី សាជីវកម្ម ពិធីបើកសម្ពោធ ការដំឡើងឆាក និងឧបករណ៍បច្ចេកវិទ្យាគ្រប់ប្រភេទនៅកម្ពុជា។',
    zh: '金边及柬埔寨全国首选的企业活动策划、开业典礼、舞台设计与音响灯光设备租赁服务。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}`,
    locale,
  });
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as Locale)) notFound();
  const locale = raw as Locale;
  const settings = await getSiteSettings();

  return (
    <div lang={locale} className={`site ${locale === 'km' ? 'font-km' : locale === 'zh' ? 'font-zh' : 'font-en'}`}>
      <OrganizationJsonLd settings={settings} />
      <WebSiteJsonLd />
      <a href="#main" className="skip-link">Skip to content</a>
      <MotionProvider />
      <AnalyticsTracker />
      <SiteHeader locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
      <CookieConsent locale={locale} />
    </div>
  );
}
