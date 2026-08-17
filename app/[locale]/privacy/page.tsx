import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/site/page-intro';
import { PrivacyManager } from '@/components/site/privacy-manager';
import { getSiteSettings } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { buildPageMetadata } from '@/lib/seo';
import {
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
  Users2,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;

  const titles: Record<Locale, string> = {
    en: 'Privacy Policy & Data Security — MPG Event Planner',
    km: 'គោលការណ៍ឯកជនភាព និងសុវត្ថិភាពទិន្នន័យ — MPG Event Planner',
    zh: '隐私政策与数据安全 — MPG 活动策划',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Privacy Policy and client data protection commitment of MPG Event Planner in Phnom Penh, Cambodia. Learn how we handle event inquiries, cookies, and data security.',
    km: 'គោលការណ៍ឯកជនភាព និងការការពារទិន្នន័យអតិថិជនរបស់ MPG Event Planner នៅកម្ពុជា។ របៀបដែលយើងគ្រប់គ្រងទិន្នន័យ និង Cookies។',
    zh: 'MPG 活动策划的隐私政策与客户数据安全承诺。了解我们如何处理活动咨询、Cookie 与数据安全。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}/privacy`,
    locale,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const settings = await getSiteSettings();
  const copy = messages[locale].privacy;

  // JSON-LD Structured Data for Privacy / WebPage SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.title,
    description: copy.summary,
    publisher: {
      '@type': 'Organization',
      name: settings.company_name,
      url: 'https://mpgevent.com',
      logo: 'https://mpgevent.com/images/mpg-logo.png',
    },
    inLanguage: locale,
    dateModified: '2026-08-17',
  };

  const sections = [
    {
      icon: FileText,
      title: copy.section1_title,
      description: copy.section1_desc,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      icon: ShieldCheck,
      title: copy.section2_title,
      description: copy.section2_desc,
      color: 'text-[#1e9a2a] bg-[#1e9a2a]/10 border-[#1e9a2a]/20',
    },
    {
      icon: Cookie,
      title: copy.section3_title,
      description: copy.section3_desc,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      icon: Lock,
      title: copy.section4_title,
      description: copy.section4_desc,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      icon: Users2,
      title: copy.section5_title,
      description: copy.section5_desc,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageIntro
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.summary}
      />

      <section className="band-lg pt-0">
        <div className="shell max-w-4xl mx-auto space-y-10">
          {/* Last Updated Pill */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {copy.last_updated}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#1e9a2a] font-medium bg-[#1e9a2a]/10 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {locale === 'en' ? 'GDPR & Privacy Compliant' : locale === 'km' ? 'អនុលោមភាពឯកជនភាព' : '隐私合规保证'}
            </span>
          </div>

          {/* Interactive Privacy Manager Widget */}
          <PrivacyManager locale={locale} />

          {/* Policy Sections Grid */}
          <div className="space-y-6">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <article
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(6,20,33,0.04)] hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${sec.color} border flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-base sm:text-lg font-bold text-[#061421] group-hover:text-[#1e9a2a] transition-colors">
                        {sec.title}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Contact / Inquiries Box */}
          <div className="p-7 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#061421] text-white shadow-xl">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#58d46b]">
                {ui[locale].contact}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {copy.contact_title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {copy.contact_desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <a
                href={`mailto:${settings.company_email}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-xs sm:text-sm text-white font-medium"
              >
                <Mail className="w-4 h-4 text-[#58d46b]" />
                <span className="truncate">{settings.company_email}</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-xs sm:text-sm text-white font-medium"
              >
                <Phone className="w-4 h-4 text-[#58d46b]" />
                <span>{settings.phone}</span>
              </a>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-400">
              <span>{settings.company_name} · Phnom Penh, Cambodia</span>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-1.5 text-[#58d46b] hover:text-white font-semibold transition-colors"
              >
                {locale === 'en' ? 'Go to Contact Page' : locale === 'km' ? 'ទៅកាន់ទំព័រទំនាក់ទំនង' : '前往联系页面'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
