import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/site/section-heading';
import { SiteImage } from '@/components/site/image';
import { FaqSection } from '@/components/site/faq-section';
import { getPublicContent, localized, publicImageUrl } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import { type Locale } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { buildPageMetadata } from '@/lib/seo';
import { getFaqs } from '@/lib/faqs';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  
  const titles: Record<Locale, string> = {
    en: 'MPG Event Planner — Grand Openings & Corporate Event Production in Cambodia',
    km: 'MPG Event Planner — ការរៀបចំកម្មវិធី និងពិធីបើកសម្ពោធនៅកម្ពុជា',
    zh: 'MPG Event Planner — 柬埔寨开业典礼与企业活动专业策划团队',
  };
  const descriptions: Record<Locale, string> = {
    en: 'MPG Event Planner is Cambodia’s leading event management and production agency. Specialized in corporate ceremonies, grand openings, stage design, AV equipment, and complete event production in Phnom Penh and nationwide.',
    km: 'MPG Event Planner គឺជាក្រុមហ៊ុនរៀបចំកម្មវិធីឈានមុខគេនៅកម្ពុជា។ ជំនាញលើការរៀបចំពិធីបើកសម្ពោធ កម្មវិធីសាជីវកម្ម ការដំឡើងឆាក និងបច្ចេកវិទ្យាសំឡេងពន្លឺនៅភ្នំពេញ និងទូទាំងប្រទេស។',
    zh: 'MPG Event Planner 是柬埔寨领先的活动策划与制作机构，专业提供企业开业典礼、周年庆典、舞台设计、音响灯光与全国性活动执行。',
  };

  return buildPageMetadata({
    title: titles[locale],
    description: descriptions[locale],
    pathname: `/${locale}`,
    locale,
    image: '/images/mpg/hero-backstage-v2.png',
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const labels = ui[locale];
  const copy = messages[locale];
  const stageCopy = locale === 'km' ? {
    place: 'ភ្នំពេញ · កម្ពុជា', heroLabel: 'គំនិត / មនុស្ស / ពេលចាប់ផ្តើម', scroll: 'ស្វែងយល់ពីការងាររបស់យើង', explore: 'មើលសេវា', accountable: 'ក្រុមការងារតែមួយទទួលខុសត្រូវ ចាប់ពីផែនការដំបូងរហូតដល់បញ្ចប់។', closing: 'កាលបរិច្ឆេទបន្ទាប់របស់យើង',
  } : locale === 'zh' ? {
    place: '金边 · 柬埔寨', heroLabel: '创意 / 人群 / 开场时刻', scroll: '探索我们的作品', explore: '了解服务', accountable: '从第一份需求到最后一件设备，由同一团队全程负责。', closing: '我们日程中的下一个日期',
  } : {
    place: 'Phnom Penh · Cambodia', heroLabel: 'Ideas / people / showtime', scroll: 'Discover our work', explore: 'Explore', accountable: 'One accountable crew—from the first brief to the last road case.', closing: 'The next date on our calendar',
  };
  const { services, projects, blog } = await getPublicContent();
  const featuredProjects = projects.filter((project) => project.is_featured);
  const homeProjects = (featuredProjects.length ? featuredProjects : projects).slice(0, 3);
  const supabase = await createClient();

  return (
    <>
      <section className="show-hero">
        <div className="show-hero__photo"><SiteImage src="/images/mpg/hero-backstage-v2.png" alt={copy.hero.imageAlt} priority /></div>
        <div className="show-hero__wash" aria-hidden="true" />
        <div className="show-hero__grid" aria-hidden="true" />
        <div className="shell show-hero__content">
          <div className="show-hero__topline"><p>{copy.hero.credit}</p><span>{stageCopy.place}</span></div>
          <div className="show-hero__statement">
            <p className="micro-label micro-label--light">{stageCopy.heroLabel}</p>
            <h1><span>{copy.hero.headline_line1}</span><em>{copy.hero.headline_highlight}</em></h1>
            <div className="show-hero__support">
              <p>{copy.hero.description}</p>
              <div className="show-hero__actions">
                <Link href={`/${locale}/contact`} className="cta-island"><span>{labels.getStarted}</span><i aria-hidden="true">↗</i></Link>
                <Link href={`/${locale}/projects`} className="text-link text-link--light">{copy.hero.ctaProjects}<span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </div>
          <div className="show-hero__scroll"><span>{stageCopy.scroll}</span><i aria-hidden="true" /></div>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="shell manifesto-section__grid">
          <SectionHeading eyebrow={copy.intro.label} title={copy.intro.title} />
          <div className="manifesto-section__copy" data-reveal>
            <p className="manifesto-section__lead">{copy.intro.description}</p>
            <p>{copy.intro.para2}</p>
          </div>
          <ol className="manifesto-steps" data-reveal>
            {copy.intro.pillars.map((item) => <li key={item.num}><span className="w-2 h-2 rounded-full bg-[#1e9a2a] inline-block mb-3" /><p>{item.label}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="service-stage">
        <div className="shell">
          <div className="content-section__head">
            <SectionHeading eyebrow={copy.services.label} title={copy.services.title} />
            <Link href={`/${locale}/services`} className="text-link">{labels.viewAll} {labels.services}<span>↗</span></Link>
          </div>
          <div className="home-content-grid home-content-grid--services">
            {services.slice(0, 3).map((service, index) => {
              const image = publicImageUrl(supabase, 'services', service.cover_image);
              return (
                <Link key={service.id} href={`/${locale}/services/${service.slug}`} className="home-card home-card--service" data-reveal>
                  <span className="home-card__image"><SiteImage src={image} alt={localized(service.image_alt, locale, localized(service.title, locale))} /></span>
                  <span className="home-card__body">
                    <small>{labels.services}</small>
                    <strong>{localized(service.title, locale)}</strong>
                    <span>{localized(service.description, locale)}</span>
                    <i>{stageCopy.explore} <b aria-hidden="true">↗</b></i>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flagship-section">
        <div className="flagship-section__image" data-reveal><SiteImage src="/images/mpg/grand-opening-editorial-v2.png" alt={copy.featured.imageAlt} /></div>
        <div className="flagship-section__panel" data-reveal>
          <p className="micro-label micro-label--light">{copy.featured.tag}</p>
          <h2>{copy.featured.titleLine1}<br /><em>{copy.featured.titleLine2}</em></h2>
          <p className="flagship-section__description">{copy.featured.description}</p>
          <ul>{copy.featured.bullets.map((item) => <li key={item}><span className="w-1.5 h-1.5 rounded-full bg-[#58d46b] shrink-0 mt-1.5" />{item}</li>)}</ul>
          <Link href={`/${locale}/contact`} className="cta-island cta-island--light"><span>{copy.featured.cta}</span><i>↗</i></Link>
        </div>
      </section>

      <section className="work-section">
        <div className="shell">
          <div className="content-section__head">
            <SectionHeading eyebrow={copy.projects.label} title={copy.projects.sectionTitle} />
            <Link href={`/${locale}/projects`} className="text-link">{copy.projects.viewAll}<span>↗</span></Link>
          </div>
          <div className="home-content-grid home-content-grid--projects">
            {homeProjects.map((project) => (
              <Link key={project.id} href={`/${locale}/projects/${project.slug}`} className="home-card home-card--project" data-reveal>
                <span className="home-card__image"><SiteImage src={publicImageUrl(supabase, 'projects', project.cover_image)} alt={localized(project.image_alt, locale, localized(project.title, locale))} /></span>
                <span className="home-card__body">
                  <small>{project.category ?? 'Event production'}</small>
                  <strong>{localized(project.title, locale)}</strong>
                  <i>{labels.readMore} <b aria-hidden="true">↗</b></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="process-section__beam" aria-hidden="true" />
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-10" data-reveal>
            <div className="lg:col-span-6">
              <SectionHeading eyebrow={copy.process.label} title={copy.process.title} inverse />
            </div>
            <div className="lg:col-span-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-1">
              <p className="text-lg sm:text-xl font-medium text-white leading-snug">
                {copy.why_choose.subtitle}
              </p>
              <span className="text-xs text-[#d4e5f2] shrink-0 font-normal">
                {stageCopy.accountable}
              </span>
            </div>
          </div>
          <div className="relative mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {copy.process.steps.map((item, index) => {
                const stepIcons = [
                  // 1. Consultation
                  <svg key="1" className="w-6 h-6 text-[#58d46b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>,
                  // 2. Proposal
                  <svg key="2" className="w-6 h-6 text-[#58d46b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>,
                  // 3. Planning
                  <svg key="3" className="w-6 h-6 text-[#58d46b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zm2 6a2 2 0 100 4 2 2 0 000-4zm-6 8a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>,
                  // 4. Preparation
                  <svg key="4" className="w-6 h-6 text-[#58d46b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>,
                  // 5. Execution
                  <svg key="5" className="w-6 h-6 text-[#58d46b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>,
                ];
                return (
                  <div key={item.num || index} data-reveal className="relative group flex flex-col justify-start">
                    <div className="h-7 mb-3.5 flex items-center text-[#58d46b]">
                      {stepIcons[index]}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight group-hover:text-[#58d46b] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#d4e5f2] leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="shell">
          <div className="content-section__head">
            <SectionHeading eyebrow={copy.blog.label} title={copy.blog.title} />
            <Link href={`/${locale}/blog`} className="text-link">{labels.viewAll} {labels.blog}<span>↗</span></Link>
          </div>
          <div className="home-content-grid home-content-grid--blog">
            {blog.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="home-card home-card--blog" data-reveal>
                <span className="home-card__image"><SiteImage src={publicImageUrl(supabase, 'blog', post.cover_image)} alt={localized(post.image_alt, locale, localized(post.title, locale))} /></span>
                <span className="home-card__body">
                  <small>{post.category ?? 'MPG Blog'}</small>
                  <strong>{localized(post.title, locale)}</strong>
                  <span>{localized(post.excerpt, locale)}</span>
                  <i>{labels.readMore} <b aria-hidden="true">↗</b></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        eyebrow="FAQ"
        title={locale === 'km' ? 'សំណួរដែលគេសួរញឹកញាប់' : locale === 'zh' ? '常见问题解答' : 'Frequently Asked Questions'}
        subtitle={
          locale === 'km'
            ? 'ចម្លើយច្បាស់លាស់ចំពោះសំណួរដែលអតិថិជនតែងតែសួរអំពីសេវាកម្មរៀបចំកម្មវិធីនៅកម្ពុជា'
            : locale === 'zh'
            ? '关于在柬埔寨举办活动与典礼的常见疑问解答'
            : 'Clear answers to common questions about event planning and production in Cambodia.'
        }
        faqs={getFaqs(locale)}
      />

      <section className="closing-call">
        <div className="closing-call__image"><SiteImage src="/images/mpg/contact-quote.webp" alt="MPG team preparing an event" /></div>
        <div className="closing-call__veil" />
        <div className="shell closing-call__content" data-reveal>
          <p className="micro-label micro-label--light">{stageCopy.closing}</p>
          <h2>{labels.quotationTitle}</h2>
          <p>{labels.quotationIntro}</p>
          <Link href={`/${locale}/contact`} className="cta-island cta-island--light"><span>{labels.enquire}</span><i>↗</i></Link>
        </div>
      </section>
    </>
  );
}
