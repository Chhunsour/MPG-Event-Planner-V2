import type { Metadata } from 'next';
import { ContentCard } from '@/components/site/content-card';
import { PageIntro } from '@/components/site/page-intro';
import { getPublicContent } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  const titles: Record<Locale, string> = {
    en: 'Event Planning Insights, Guides & Articles — MPG Cambodia',
    km: 'អត្ថបទ និងចំណេះដឹងអំពីការរៀបចំកម្មវិធី — MPG Cambodia',
    zh: '柬埔寨活动策划与会展行业专业资讯 — MPG 博客',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Read expert event planning articles, grand opening checklists, AV stage production guides, and corporate event management insights from MPG Event Planner Cambodia.',
    km: 'អានអត្ថបទ និងគន្លឹះសំខាន់ៗអំពីការរៀបចំពិធីបើកសម្ពោធ ការរៀបចំឆាក និងការគ្រប់គ្រងកម្មវិធីសាជីវកម្មនៅកម្ពុជា។',
    zh: '阅读 MPG 柬埔寨活动团队分享的专业指南：开业流程切要、舞台视听设备选择与企业盛典策划锦囊。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}/blog`,
    locale,
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const { blog } = await getPublicContent();
  const labels = ui[locale];
  const copy = messages[locale].blog;

  return (
    <>
      <PageIntro eyebrow={copy.label || labels.blog} title={copy.title} description={copy.subtitle} />
      <section className="collection-section">
        <div className="shell collection-grid collection-grid--blog">
          {blog.map((item, index) => (
            <ContentCard key={item.id} item={item} locale={locale} type="blog" index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
