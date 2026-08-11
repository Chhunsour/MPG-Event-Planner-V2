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
    en: 'Event Showcase & Project Case Studies in Cambodia',
    km: 'ស្នាដៃ និងគម្រោងកម្មវិធីដែលបានរៀបចំនៅកម្ពុជា',
    zh: '柬埔寨精选活动案例与项目展示',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Explore case studies of corporate events, grand opening ceremonies, stage productions, and exhibitions successfully produced by MPG Event Planner across Cambodia.',
    km: 'ទស្សនាគម្រោងពិធីបើកសម្ពោធ កម្មវិធីសាជីវកម្ម និងការដំឡើងឆាកដែលបានរៀបចំដោយជោគជ័យដោយ MPG Event Planner នៅកម្ពុជា។',
    zh: '浏览 MPG 在柬埔寨成功打造的企业盛典、开业大典、专业舞台搭建与展会精选案例。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}/projects`,
    locale,
  });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const { projects } = await getPublicContent();
  const labels = ui[locale];
  const copy = messages[locale].projects;

  return (
    <>
      <PageIntro eyebrow={copy.label || labels.projects} title={copy.title} description={copy.subtitle} />
      <section className="collection-section">
        <div className="shell collection-grid collection-grid--projects">
          {projects.map((item, index) => (
            <ContentCard key={item.id} item={item} locale={locale} type="project" index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
