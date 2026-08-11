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
          <SectionHeading index="01" eyebrow={copy.intro.label} title={copy.intro.title} />
          <div className="manifesto-section__copy" data-reveal>
            <p className="manifesto-section__lead">{copy.intro.description}</p>
            <p>{copy.intro.para2}</p>
          </div>
          <ol className="manifesto-steps" data-reveal>
            {copy.intro.pillars.map((item) => <li key={item.num}><span>{item.num}</span><p>{item.label}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="service-stage">
        <div className="shell">
          <div className="content-section__head">
            <SectionHeading index="02" eyebrow={copy.services.label} title={copy.services.title} />
            <Link href={`/${locale}/services`} className="text-link">{labels.viewAll} {labels.services}<span>↗</span></Link>
          </div>
          <div className="home-content-grid home-content-grid--services">
            {services.slice(0, 3).map((service, index) => {
              const image = publicImageUrl(supabase, 'services', service.cover_image);
              return (
                <Link key={service.id} href={`/${locale}/services/${service.slug}`} className="home-card home-card--service" data-reveal>
                  <span className="home-card__image"><SiteImage src={image} alt={localized(service.image_alt, locale, localized(service.title, locale))} /></span>
                  <span className="home-card__body">
                    <small>{labels.services} · {String(index + 1).padStart(2, '0')}</small>
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
          <ul>{copy.featured.bullets.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ul>
          <Link href={`/${locale}/contact`} className="cta-island cta-island--light"><span>{copy.featured.cta}</span><i>↗</i></Link>
        </div>
      </section>

      <section className="work-section">
        <div className="shell">
          <div className="content-section__head">
            <SectionHeading index="03" eyebrow={copy.projects.label} title={copy.projects.sectionTitle} />
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
          <SectionHeading index="04" eyebrow={copy.process.label} title={copy.process.title} inverse />
          <div className="process-section__intro" data-reveal><p>{copy.why_choose.subtitle}</p><span>{stageCopy.accountable}</span></div>
          <ol className="process-line">
            {copy.process.steps.map((item, index) => <li key={item.num} data-reveal><span className="process-line__node" /><p className="process-line__num">{item.num}</p><h3>{item.title}</h3><p>{item.desc}</p><i>{String(index + 1).padStart(2, '0')}</i></li>)}
          </ol>
        </div>
      </section>

      <section className="blog-section">
        <div className="shell">
          <div className="content-section__head">
            <SectionHeading index="05" eyebrow={copy.blog.label} title={copy.blog.title} />
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
        eyebrow="AEO & GEO FAQ"
        title={locale === 'km' ? 'សំណួរដែលគេសួរញឹកញាប់' : locale === 'zh' ? '常见问题解答' : 'Frequently Asked Questions'}
        subtitle={
          locale === 'km'
            ? 'ចម្លើយច្បាស់លាស់ចំពោះសំណួរដែលអតិថិជនតែងតែសួរអំពីសេវាកម្មរៀបចំកម្មវិធីនៅកម្ពុជា'
            : locale === 'zh'
            ? '关于在柬埔寨举办活动与典礼的常见疑问解答'
            : 'Clear answers to common questions about event planning and production in Cambodia.'
        }
        faqs={
          locale === 'km'
            ? [
                {
                  question: 'តើ MPG Event Planner ផ្តល់សេវាកម្មរៀបចំកម្មវិធីអ្វីខ្លះនៅកម្ពុជា?',
                  answer: 'MPG Event Planner ផ្តល់សេវាកម្មរៀបចំកម្មវិធីពេញលេញ រួមមាន ពិធីបើកសម្ពោធ កម្មវិធីសាជីវកម្ម ការរៀបចំឆាក ភ្លើង សំឡេង អេក្រង់ LED និងការគ្រប់គ្រងកម្មវិធីទូទាំងប្រទេសកម្ពុជា។',
                },
                {
                  question: 'តើការរៀបចំកម្មវិធីគួរកក់ទុកមុនប៉ុន្មានថ្ងៃ?',
                  answer: 'យើងខ្ញុំអនុសាសន៍ឱ្យកក់ទុកមុនពី ២ ទៅ ៦ សប្តាហ៍ សម្រាប់កម្មវិធីសាជីវកម្ម និងពិធីបើកសម្ពោធធំៗ ដើម្បីមានពេលគ្រប់គ្រាន់ក្នុងការរចនា និងរៀបចំ។',
                },
                {
                  question: 'តើ MPG Event Planner ផ្តល់សេវាកម្មនៅខេត្តណាខ្លះ?',
                  answer: 'ទីស្នាក់ការកណ្តាលរបស់យើងស្ថិតនៅរាជធានីភ្នំពេញ ហើយយើងខ្ញុំផ្តល់សេវាកម្មរៀបចំកម្មវិធីទូទាំង ២៥ រាជធានី-ខេត្ត ក្នុងព្រះរាជាណាចក្រកម្ពុជា។',
                },
              ]
            : locale === 'zh'
            ? [
                {
                  question: 'MPG Event Planner 在柬埔寨提供哪些活动策划服务？',
                  answer: '我们提供一站式活动策划服务，包括企业开业典礼、周年庆典、产品发布会、舞台与音响灯光设计搭建以及全国性的活动制作。',
                },
                {
                  question: '需要提前多久预订活动策划服务？',
                  answer: '建议提前 2 至 6 周进行预订，以便我们的专业团队有充裕时间完成场地设计、审批流程、设备准备与彩排。',
                },
                {
                  question: '服务范围是否涵盖金边以外的城市？',
                  answer: '我们的总部位于金边，服务范围覆盖柬埔寨全境，包括暹粒、西哈努克港、马德望及贡布等城市。',
                },
              ]
            : [
                {
                  question: 'What event planning services does MPG Event Planner provide in Cambodia?',
                  answer: 'MPG Event Planner provides end-to-end event planning, stage design, LED screen and audio-visual rentals, grand opening ceremonies, corporate galas, product launches, exhibitions, and venue production across Phnom Penh and all provinces in Cambodia.',
                },
                {
                  question: 'Where is MPG Event Planner located and what areas do you serve?',
                  answer: 'Our headquarters is located in Phnom Penh, Cambodia. We service corporate and private events nationwide across Cambodia, including Siem Reap, Sihanoukville, Battambang, and Kampot.',
                },
                {
                  question: 'How early should we book an event planner for a corporate event or grand opening?',
                  answer: 'We recommend booking 2 to 6 weeks in advance for corporate ceremonies and major exhibitions to allow adequate time for concept approval, permits, stage fabrication, and technical rehearsals.',
                },
                {
                  question: 'How can I request a quotation for event production?',
                  answer: 'You can submit your event brief via our online Contact & Quotation form, or email hello@mpgeventplanner.com. Our team responds within 24 hours with a custom proposal and cost estimate.',
                },
              ]
        }
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
