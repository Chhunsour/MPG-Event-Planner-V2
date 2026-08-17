import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/site/page-intro';
import { PrivacyManager } from '@/components/site/privacy-manager';
import { getSiteSettings } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { buildPageMetadata } from '@/lib/seo';
import {
  Lock,
  EyeOff,
  Mail,
  Phone,
  ArrowRight,
  UserCheck,
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
    en: 'Comprehensive privacy policy and data governance standards of MPG Event Planner in Phnom Penh, Cambodia.',
    km: 'គោលការណ៍ឯកជនភាព និងស្តង់ដារសុវត្ថិភាពទិន្នន័យរបស់ MPG Event Planner នៅកម្ពុជា។',
    zh: 'MPG 活动策划的完整隐私政策与数据治理标准。',
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

  // JSON-LD Structured Data
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

  const pillars = {
    en: [
      {
        icon: EyeOff,
        title: 'Zero Ad Trackers',
        desc: 'No Meta or advertising pixels. Your browsing is never shared with third-party brokers.',
      },
      {
        icon: Lock,
        title: 'Strict Confidentiality',
        desc: 'Event layouts, budgets, and VIP briefs remain private to your dedicated production crew.',
      },
      {
        icon: UserCheck,
        title: 'Full Data Control',
        desc: 'Request instant export, update, or permanent deletion of your inquiry data at any time.',
      },
    ],
    km: [
      {
        icon: EyeOff,
        title: 'គ្មានកម្មវិធីតាមដាន',
        desc: 'មិនប្រើប្រាស់ Pixel ពាណិជ្ជកម្មឡើយ។ ទិន្នន័យមិនត្រូវបានចែករំលែកជាមួយភាគីទីបីជាដាច់ខាត។',
      },
      {
        icon: Lock,
        title: 'ការសម្ងាត់កម្រិតខ្ពស់',
        desc: 'ប្លង់កម្មវិធី ថវិកា និងគម្រោង ត្រូវបានរក្សាជាការសម្ងាត់យ៉ាងតឹងរ៉ឹងបំផុត។',
      },
      {
        icon: UserCheck,
        title: 'សិទ្ធិពេញលេញលើទិន្នន័យ',
        desc: 'អ្នកអាចស្នើសុំកែប្រែ ឬលុបទិន្នន័យសំណើរបស់អ្នកចេញពីប្រព័ន្ធរបស់យើងគ្រប់ពេលវេលា។',
      },
    ],
    zh: [
      {
        icon: EyeOff,
        title: '零营销追踪',
        desc: '不安装第三方营销像素。您的浏览记录绝不与广告商或数据中介共享。',
      },
      {
        icon: Lock,
        title: '方案严格保密',
        desc: '场地布局、预算明细及执行方案仅限指定制作团队内部查阅。',
      },
      {
        icon: UserCheck,
        title: '数据自主掌控',
        desc: '您可随时申请查阅、更新或请求永久删除提交的活动方案咨询记录。',
      },
    ],
  }[locale];

  const dataTable = {
    en: {
      title: 'Data Retention & Purpose Schedule',
      headers: ['Data Category', 'Elements', 'Purpose', 'Retention Period'],
      rows: [
        [
          'Quotation Inquiries',
          'Name, email, phone, event date, venue, budget tier',
          'Proposal estimation & staging logistics',
          'Duration of inquiry + 12 months',
        ],
        [
          'Lightweight Telemetry',
          'Page URL, referrer, device, browser, language',
          'Site performance optimization (consented)',
          '90 days aggregate logs',
        ],
        [
          'Cookie Preferences',
          'Consent choice (Accepted / Declined)',
          'Remembering preference on future visits',
          '12 months (or until cleared)',
        ],
      ],
    },
    km: {
      title: 'តារាងតម្លាភាព និងរយៈពេលរក្សាទុកទិន្នន័យ',
      headers: ['ប្រភេទព័ត៌មាន', 'ធាតុជាក់លាក់', 'គោលបំណង', 'រយៈពេល'],
      rows: [
        [
          'សំណើតម្លៃ និងគម្រោង',
          'ឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ កាលបរិច្ឆេទ ទីកន្លែង',
          'ការរៀបចំសំណើតម្លៃ និងសម្របសម្រួលបច្ចេកទេស',
          'ពេញមួយគម្រោង + ១២ ខែ',
        ],
        [
          'ទិន្នន័យវិភាគកម្រិតស្រាល',
          'ទំព័រទស្សនា ប្រភព ប្រភេទឧបករណ៍ និងភាសា',
          'ការកែលម្អគុណភាពគេហទំព័រ (ដោយមានការយល់ព្រម)',
          '៩០ ថ្ងៃ',
        ],
        [
          'ការចងចាំ Cookie',
          'ជម្រើសឯកជនភាពរបស់អ្នក',
          'ចងចាំជម្រើសសម្រាប់ទស្សនកិច្ចបន្ទាប់',
          '១២ ខែ',
        ],
      ],
    },
    zh: {
      title: '数据收集透明度与保留周期表',
      headers: ['数据类别', '具体收集项目', '使用目的', '保留周期'],
      rows: [
        [
          '活动方案咨询',
          '姓名、邮箱、电话、日期、场地、预算',
          '定制活动提案与技术物流协调',
          '咨询周期内及执行后 12 个月',
        ],
        [
          '轻量级流量指标',
          '访问页面、来源渠道、设备、浏览器、语言',
          '优化网站访问体验（需用户同意）',
          '90 天聚合日志',
        ],
        [
          'Cookie 偏好记录',
          '本地偏好状态（已同意 / 仅必要）',
          '记录偏好以便后续访问',
          '12 个月',
        ],
      ],
    },
  }[locale];

  const policySections = [
    { title: copy.section1_title, content: copy.section1_desc },
    { title: copy.section2_title, content: copy.section2_desc },
    { title: copy.section3_title, content: copy.section3_desc },
    { title: copy.section4_title, content: copy.section4_desc },
    { title: copy.section5_title, content: copy.section5_desc },
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
        <div className="shell max-w-4xl mx-auto">
          {/* Unified Document Surface */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
            {/* Top Bar: Last Updated & Privacy Manager */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider">{copy.last_updated}</span>
                <span className="text-[#1e9a2a] font-medium">
                  {locale === 'en' ? 'Privacy Standards' : locale === 'km' ? 'ស្តង់ដារឯកជនភាព' : '隐私合规标准'}
                </span>
              </div>
              <PrivacyManager locale={locale} />
            </div>

            {/* Core Principles (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Icon className="w-4 h-4 text-[#1e9a2a] shrink-0" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">{pillar.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Continuous Policy Flow */}
            <div className="space-y-8 pt-6 border-t border-slate-100">
              {policySections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {sec.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {sec.content}
                  </p>

                  {/* Embed Data Table under the 4th section (Data Security & Retention) */}
                  {idx === 3 && (
                    <div className="mt-4 pt-2">
                      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50/50">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-100/80 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-900">
                            <tr>
                              {dataTable.headers.map((h, i) => (
                                <th key={i} className="p-3 whitespace-nowrap">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60">
                            {dataTable.rows.map((row, i) => (
                              <tr key={i} className="hover:bg-white transition-colors">
                                <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">{row[0]}</td>
                                <td className="p-3 text-slate-600">{row[1]}</td>
                                <td className="p-3 text-slate-600">{row[2]}</td>
                                <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{row[3]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Unified Contact Footer */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-600">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{copy.contact_title}</h3>
                <p>{copy.contact_desc}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`mailto:${settings.company_email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#1e9a2a]" />
                  <span>{settings.company_email}</span>
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1e9a2a]" />
                  <span>{settings.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
