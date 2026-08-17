import type { Metadata } from 'next';
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
  UserCheck,
  Building2,
  FileCheck,
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
    en: 'Privacy Policy & Data Security Standards — MPG Event Planner',
    km: 'គោលការណ៍ឯកជនភាព និងស្តង់ដារសុវត្ថិភាពទិន្នន័យ — MPG Event Planner',
    zh: '隐私政策与数据安全标准 — MPG 活动策划',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Comprehensive enterprise privacy policy, NDA guarantees, and data governance standards of MPG Event Planner in Phnom Penh, Cambodia.',
    km: 'គោលការណ៍ឯកជនភាព ការធានាកិច្ចសន្យា NDA និងស្តង់ដារសុវត្ថិភាពទិន្នន័យរបស់ MPG Event Planner នៅកម្ពុជា។',
    zh: 'MPG 活动策划的完整企业级隐私政策、保密协议（NDA）保障与数据治理标准。',
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
        desc: 'No Meta or third-party marketing pixels. Your browsing behavior is never monetized or shared with ad brokers.',
      },
      {
        icon: Lock,
        title: 'NDA & Confidentiality',
        desc: 'Event layouts, budgets, VIP guest counts, and creative concepts remain strictly protected under commercial NDAs.',
      },
      {
        icon: UserCheck,
        title: 'Full Data Ownership',
        desc: 'Request instant export, correction, or permanent deletion of your inquiry data and project files at any time.',
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
        title: 'កិច្ចសន្យា NDA និងការសម្ងាត់',
        desc: 'ប្លង់កម្មវិធី ថវិកា និងគម្រោង ត្រូវបានរក្សាជាការសម្ងាត់យ៉ាងតឹងរ៉ឹងក្រោមលក្ខខណ្ឌ NDA។',
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
        desc: '不安装任何第三方营销像素。您的浏览记录绝不与广告商或数据中介共享。',
      },
      {
        icon: Lock,
        title: '保密协议（NDA）保障',
        desc: '场地布局、预算明细及执行方案仅限指定制作团队内部查阅，支持正式签署商业保密协议。',
      },
      {
        icon: UserCheck,
        title: '数据完全自主掌控',
        desc: '您可随时申请查阅、更新或请求永久删除提交的活动方案咨询记录。',
      },
    ],
  }[locale];

  const dataTable = {
    en: {
      title: 'Data Classification & Retention Schedule',
      headers: ['Data Category', 'Elements Collected', 'Operational Purpose', 'Retention Period'],
      rows: [
        [
          'Quotation Inquiries & Briefs',
          'Client name, organization, corporate email, phone, Telegram, event date, venue preference, budget tier',
          'Formulating custom event proposals, calculating staging gear, and logistics scheduling',
          'Active inquiry period + 12 months for record keeping',
        ],
        [
          'Executed Event Contracts & Floorplans',
          'Finalized CAD stage layouts, electrical load plans, vendor contracts, signed agreements',
          'Technical production execution, site safety compliance, structural warranty, and post-event support',
          '3 years following event completion (for legal & tax compliance)',
        ],
        [
          'Financial & Billing Statements',
          'Invoices, official receipts, bank payment reference IDs, company tax identification',
          'Statutory financial reporting and accounting audits',
          '5 years as mandated by local tax regulations',
        ],
        [
          'Consented Browsing Telemetry',
          'Anonymized route visits, device classification, browser engine, referrer channel, language',
          'Aggregated website performance diagnostics and infrastructure speed optimization',
          '90 days rolling server aggregation',
        ],
        [
          'Cookie Consent Tokens',
          'Local consent status timestamp (Accepted / Declined)',
          'Suppressing redundant consent prompts on subsequent visits',
          '12 months (or until cleared by user)',
        ],
      ],
    },
    km: {
      title: 'តារាងចំណាត់ថ្នាក់ និងរយៈពេលរក្សាទុកទិន្នន័យ',
      headers: ['ប្រភេទព័ត៌មាន', 'ធាតុជាក់លាក់', 'គោលបំណងប្រតិបត្តិការ', 'រយៈពេលរក្សាទុក'],
      rows: [
        [
          'សំណើតម្លៃ និងព័ត៌មានគម្រោង',
          'ឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ Telegram កាលបរិច្ឆេទ ទីកន្លែង និងកញ្ចប់ថវិកា',
          'ការរៀបចំសំណើតម្លៃ ការគណនាឧបករណ៍បច្ចេកទេស និងកាលវិភាគ',
          'ពេញមួយរយៈពេលគម្រោង + ១២ ខែ',
        ],
        [
          'កិច្ចសន្យា និងប្លង់ឆាក',
          'ប្លង់ឆាក CAD ប្លង់ប្រព័ន្ធភ្លើង កិច្ចសន្យាផលិត និងការអនុវត្ត',
          'ការរៀបចំដំឡើងបច្ចេកទេស សុវត្ថិភាព និងការធានាគុណភាព',
          '៣ ឆ្នាំបន្ទាប់ពីបញ្ចប់កម្មវិធី (សម្រាប់ការអនុលោមច្បាប់)',
        ],
        [
          'ឯកសារហិរញ្ញវត្ថុ និងវិក្កយបត្រ',
          'វិក្កយបត្រ បង្កាន់ដៃបង់ប្រាក់ លេខយោងធនាគារ និងលេខអត្តសញ្ញាណពន្ធ',
          'ការធ្វើរបាយការណ៍ហិរញ្ញវត្ថុ និងសវនកម្មគណនេយ្យ',
          '៥ ឆ្នាំ តាមបទប្បញ្ញត្តិនៃច្បាប់ពន្ធដារ',
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
          'ចងចាំជម្រើសសម្រាប់ទស្សនកិច្ចបន្ទាប់',
          '១២ ខែ',
        ],
      ],
    },
    zh: {
      title: '数据分类与生命周期保留周期表',
      headers: ['数据类别', '具体收集项目', '业务使用目的', '法定保留周期'],
      rows: [
        [
          '方案咨询与需求档案',
          '客户姓名、机构名称、邮箱、电话、Telegram、活动日期、场地偏好、预算区间',
          '定制策划提案、核算舞台声光电工程设备清单与排期沟通',
          '咨询有效期间 + 12 个月归档记录',
        ],
        [
          '签约执行合同与场地工程图',
          'CAD 舞台结构施工图、电力布线负荷表、场地安全报批文件、正式签约合同',
          '现场落地施工、结构安全质保及售后活动追溯',
          '活动执行完毕后 3 年（满足合同与法务要求）',
        ],
        [
          '财务结算与税务发票凭据',
          '发票、收款收据、银行转账流水参考号、企业税号信息',
          '法定财税申报与合规审计',
          '5 年（依据本地税务法律法规）',
        ],
        [
          '经授权的轻量级性能指标',
          '匿名化访问路径、来源渠道、设备型号、浏览器版本、语言',
          '优化网站访问性能与用户体验（需用户同意）',
          '90 天滚动聚合日志',
        ],
        [
          'Cookie 偏好记录',
          '本地偏好状态（已同意 / 仅必要）',
          '记录偏好以便后续访问',
          '12 个月（或直至用户重置）',
        ],
      ],
    },
  }[locale];

  const policySections = [
    { title: copy.scope_title, content: copy.scope_desc },
    { title: copy.section1_title, content: copy.section1_desc },
    { title: copy.section2_title, content: copy.section2_desc },
    { title: copy.section3_title, content: copy.section3_desc },
    { title: copy.section4_title, content: copy.section4_desc },
    { title: copy.section5_title, content: copy.section5_desc },
    { title: copy.section6_title, content: copy.section6_desc },
    { title: copy.section7_title, content: copy.section7_desc },
    { title: copy.section8_title, content: copy.section8_desc },
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
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm space-y-9">
            {/* Top Bar: Last Updated & Privacy Manager */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider">{copy.last_updated}</span>
                <span className="inline-flex items-center gap-1.5 text-[#1e9a2a] font-semibold bg-[#1e9a2a]/10 px-2.5 py-1 rounded-md">
                  <FileCheck className="w-3.5 h-3.5" />
                  {locale === 'en'
                    ? 'Enterprise Privacy Standards'
                    : locale === 'km'
                    ? 'ស្តង់ដារឯកជនភាពកម្រិតសាជីវកម្ម'
                    : '企业级数据合规标准'}
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
                <div key={idx} className="space-y-2.5">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {sec.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sec.content}
                  </p>

                  {/* Embed the Data Classification & Retention Table under section 6 */}
                  {idx === 6 && (
                    <div className="mt-4 pt-2">
                      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50/50">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-100/80 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-900">
                            <tr>
                              {dataTable.headers.map((h, i) => (
                                <th key={i} className="p-3.5 whitespace-nowrap">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60">
                            {dataTable.rows.map((row, i) => (
                              <tr key={i} className="hover:bg-white transition-colors">
                                <td className="p-3.5 font-semibold text-slate-900 whitespace-nowrap">{row[0]}</td>
                                <td className="p-3.5 text-slate-600">{row[1]}</td>
                                <td className="p-3.5 text-slate-600">{row[2]}</td>
                                <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">{row[3]}</td>
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

            {/* Unified Contact & Governance Footer */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-xs text-slate-600">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{copy.contact_title}</h3>
                <p className="leading-relaxed">{copy.contact_desc}</p>
                <div className="flex items-center gap-2 text-slate-500 pt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{settings.company_name} · {settings.office_address}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
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
