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
  Lock,
  EyeOff,
  Mail,
  Phone,
  ArrowRight,
  Database,
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
    en: 'Comprehensive privacy policy and data governance standards of MPG Event Planner. Learn how we secure event inquiries, quotation briefs, and telemetry.',
    km: 'គោលការណ៍ឯកជនភាព និងស្តង់ដារសុវត្ថិភាពទិន្នន័យរបស់ MPG Event Planner នៅកម្ពុជា។ របៀបដែលយើងការពារព័ត៌មាន និងសំណើកម្មវិធី។',
    zh: 'MPG 活动策划的完整隐私政策与数据治理标准。了解我们如何保护活动方案咨询与数据安全。',
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
        title: 'Zero Advertising Trackers',
        desc: 'We never install Meta, Google Ads, or TikTok tracking pixels. Your browsing activity is never shared with advertisers or data brokers.',
      },
      {
        icon: Lock,
        title: 'Confidential Event Briefs',
        desc: 'Event layouts, budgets, VIP guest counts, and creative concepts remain strictly confidential to your dedicated production team.',
      },
      {
        icon: UserCheck,
        title: 'Full Data Ownership',
        desc: 'You can request instant export, update, or permanent deletion of your inquiry data and records at any point.',
      },
    ],
    km: [
      {
        icon: EyeOff,
        title: 'គ្មានកម្មវិធីតាមដានពាណិជ្ជកម្ម',
        desc: 'យើងមិនប្រើប្រាស់ Pixel តាមដានរបស់ក្រុមហ៊ុនពាណិជ្ជកម្មឡើយ។ ទិន្នន័យរបស់អ្នកមិនត្រូវបានចែករំលែកជាមួយភាគីទីបីជាដាច់ខាត។',
      },
      {
        icon: Lock,
        title: 'ការសម្ងាត់នៃគម្រោងកម្មវិធី',
        desc: 'ប្លង់កម្មវិធី ថវិកា ចំនួនភ្ញៀវកិត្តិយស និងគំនិតច្នៃប្រឌិត ត្រូវបានរក្សាជាការសម្ងាត់យ៉ាងតឹងរ៉ឹងបំផុត។',
      },
      {
        icon: UserCheck,
        title: 'សិទ្ធិពេញលេញលើទិន្នន័យ',
        desc: 'អ្នកអាចស្នើសុំកែប្រែ ទាញយក ឬលុបទិន្នន័យសំណើរបស់អ្នកចេញពីប្រព័ន្ធរបស់យើងគ្រប់ពេលវេលា។',
      },
    ],
    zh: [
      {
        icon: EyeOff,
        title: '零第三方广告追踪',
        desc: '我们不安装任何营销追踪像素。您的浏览记录绝不会与广告商或数据中介共享。',
      },
      {
        icon: Lock,
        title: '活动策划方案严格保密',
        desc: '场地布局、预算明细、贵宾名单及创意执行方案仅限指定制作团队内部查阅。',
      },
      {
        icon: UserCheck,
        title: '完全掌控自身数据',
        desc: '您可随时申请查阅、更新或请求永久删除您提交的活动方案咨询记录。',
      },
    ],
  }[locale];

  const dataTable = {
    en: {
      title: 'Data Transparency & Retention Schedule',
      headers: ['Data Category', 'Specific Elements', 'Purpose', 'Retention Period'],
      rows: [
        [
          'Quotation Inquiries',
          'Name, email, phone, Telegram, event date, venue, budget tier',
          'Preparing customized proposals & coordinating stage logistics',
          'Duration of inquiry + 12 months for active event records',
        ],
        [
          'Lightweight Telemetry',
          'Page URL, referrer, device type, browser, country/locale',
          'Aggregated performance optimization (consented sessions)',
          '90 days aggregated server logs',
        ],
        [
          'Cookie Preferences',
          'Local consent choice (Accepted / Declined)',
          'Remembering your preference on future visits',
          '12 months (or until cleared by user)',
        ],
      ],
    },
    km: {
      title: 'តារាងតម្លាភាព និងរយៈពេលរក្សាទុកទិន្នន័យ',
      headers: ['ប្រភេទព័ត៌មាន', 'ធាតុជាក់លាក់', 'គោលបំណង', 'រយៈពេលរក្សាទុក'],
      rows: [
        [
          'សំណើតម្លៃ និងគម្រោង',
          'ឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ Telegram កាលបរិច្ឆេទ ទីកន្លែង និងកញ្ចប់ថវិកា',
          'ការរៀបចំសំណើតម្លៃ និងសម្របសម្រួលការងារបច្ចេកទេស',
          'ពេញមួយរយៈពេលនៃគម្រោង + ១២ ខែសម្រាប់ឯកសារយោង',
        ],
        [
          'ទិន្នន័យវិភាគកម្រិតស្រាល',
          'ទំព័រទស្សនា ប្រភព ប្រភេទឧបករណ៍ និងភាសា',
          'ការកែលម្អគុណភាព និងល្បឿនគេហទំព័រ (ដោយមានការយល់ព្រម)',
          '៩០ ថ្ងៃ',
        ],
        [
          'ការចងចាំ Cookie',
          'ជម្រើសឯកជនភាពរបស់អ្នក (យល់ព្រម / មិនយល់ព្រម)',
          'ចងចាំជម្រើសរបស់អ្នកសម្រាប់ទស្សនកិច្ចបន្ទាប់',
          '១២ ខែ (ឬរហូតដល់អ្នកកំណត់ឡើងវិញ)',
        ],
      ],
    },
    zh: {
      title: '数据收集透明度与保留周期表',
      headers: ['数据类别', '具体收集项目', '使用目的', '保留周期'],
      rows: [
        [
          '活动方案咨询',
          '姓名、电子邮件、电话、Telegram、活动日期、场地、预算',
          '定制活动提案与技术物流协调',
          '咨询周期内及活动执行后 12 个月',
        ],
        [
          '轻量级流量指标',
          '访问页面、来源渠道、设备类型、浏览器版本、语言',
          '优化网站访问性能与用户体验（需用户同意）',
          '90 天聚合服务器日志',
        ],
        [
          'Cookie 偏好记录',
          '本地偏好状态（已同意 / 仅必要）',
          '记录您的偏好选择以便后续访问',
          '12 个月（或直至用户重置）',
        ],
      ],
    },
  }[locale];

  const policyArticles = [
    {
      title: copy.section1_title,
      content: copy.section1_desc,
    },
    {
      title: copy.section2_title,
      content: copy.section2_desc,
    },
    {
      title: copy.section3_title,
      content: copy.section3_desc,
    },
    {
      title: copy.section4_title,
      content: copy.section4_desc,
    },
    {
      title: copy.section5_title,
      content: copy.section5_desc,
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
        <div className="shell max-w-4xl mx-auto space-y-12">
          {/* Top Editorial Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/[0.02] border border-slate-900/10">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Icon className="w-4 h-4 text-[#1e9a2a]" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider">
                      {pillar.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Privacy Manager Widget */}
          <PrivacyManager locale={locale} />

          {/* Data Transparency Schedule Table */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1e9a2a]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                {dataTable.title}
              </h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-900/10 shadow-sm bg-white">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-900/10 font-bold uppercase text-[11px] text-slate-900">
                  <tr>
                    {dataTable.headers.map((h, i) => (
                      <th key={i} className="p-4 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataTable.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900 whitespace-nowrap">{row[0]}</td>
                      <td className="p-4 text-slate-600">{row[1]}</td>
                      <td className="p-4 text-slate-600">{row[2]}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Policy Articles */}
          <div className="space-y-6 pt-4 border-t border-slate-200/80">
            {policyArticles.map((article, idx) => (
              <article
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-900/10 shadow-[0_2px_12px_rgba(6,20,33,0.03)] hover:border-slate-900/20 transition-all space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {article.content}
                </p>
              </article>
            ))}
          </div>

          {/* Data Protection Lead / Contact Box */}
          <div className="p-7 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#58d46b]">
                {ui[locale].contact}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {copy.contact_title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {copy.contact_desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={`mailto:${settings.company_email}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#58d46b]" />
                <span>{settings.company_email}</span>
              </a>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1e9a2a] hover:bg-[#147a22] text-xs font-semibold text-white shadow-sm transition-all"
              >
                <span>{ui[locale].contact}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
