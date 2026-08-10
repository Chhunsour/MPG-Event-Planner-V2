import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';
import { locales, type Locale } from '@/lib/types';
import { localeFromParam } from '@/lib/i18n';
import { MotionProvider } from '@/components/site/motion-provider';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParam(raw);
  return {
    title: locale === 'km' ? 'MPG Event Planner' : locale === 'zh' ? 'MPG 活动策划' : 'MPG Event Planner',
    alternates: { canonical: `/${locale}` },
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as Locale)) notFound();
  const locale = raw as Locale;

  return (
    <div lang={locale} className={`site ${locale === 'km' ? 'font-km' : locale === 'zh' ? 'font-zh' : 'font-en'}`}>
      <a href="#main" className="skip-link">Skip to content</a>
      <MotionProvider />
      <SiteHeader locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
