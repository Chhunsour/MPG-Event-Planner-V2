import Link from 'next/link';
import { ArrowRight, Check, MoveUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/site/section-heading';
import { SiteImage } from '@/components/site/image';
import { getPublicContent, localized, publicImageUrl } from '@/lib/content';
import { messages, ui } from '@/lib/i18n';
import { type Locale } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const labels = ui[locale];
  const copy = messages[locale];
  const { services, projects, blog } = await getPublicContent();
  const featuredProjects = projects.filter((project) => project.is_featured).slice(0, 3);
  const supabase = await createClient();
  const heroImage = publicImageUrl(supabase, 'projects', featuredProjects[0]?.cover_image ?? null);

  return (
    <>
      <section className="hero relative overflow-hidden text-white">
        <div className="hero__stage relative">
          <div className="hero__photo absolute inset-0">
            <SiteImage src={heroImage ?? '/images/mpg/hero-main.webp'} alt="MPG event production" priority />
          </div>
          <div className="hero-veil absolute inset-0" />
          <div className="hero-grid absolute inset-0" />
          <div className="shell hero__content relative z-10 flex min-h-[30rem] flex-col justify-end gap-7 py-14 lg:min-h-[38rem] lg:max-w-6xl lg:py-20">
            <div className="hero__kicker t-meta text-white/75"><span className="h-2 w-2 bg-[var(--mpg-green-bright)]" /> {copy.hero.place} <span>{copy.hero.credit}</span></div>
            <h1 className="hero__headline t-hero max-w-3xl"><span className="hero__headline t-hero-strong">{copy.hero.headline_line1}</span><br /><span className="hero__headline t-hero-soft text-white/70">{copy.hero.headline_highlight}</span></h1>
            <div className="flex max-w-xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="t-lead max-w-md text-white/75">{copy.hero.description}</p>
              <Link href={`/${locale}/contact`} className="btn btn-onblue shrink-0">{labels.getStarted}<MoveUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="hero__rail absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/15 py-3 text-xs uppercase tracking-[0.18em] text-white/65">
            <div className="animate-marquee-smooth gap-8">
              {[...['Grand openings', 'Corporate events', 'Product launches', 'Exhibitions', 'Ceremonies', 'Production rental'], ...['Grand openings', 'Corporate events', 'Product launches', 'Exhibitions', 'Ceremonies', 'Production rental']].map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-8 whitespace-nowrap"><span className="h-1.5 w-1.5 bg-[var(--mpg-green-bright)]" />{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="band-lg">
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading index="01" eyebrow={copy.intro.label} title={copy.intro.title} />
          <div className="grid gap-8 sm:grid-cols-2">
            <p className="t-lead text-[var(--text-muted)]">{copy.intro.description}</p>
            <ul className="grid gap-3 text-sm text-[var(--text-muted)]">
              {copy.intro.pillars.map((item) => <li key={item.num} className="flex gap-3 border-t border-[var(--line)] pt-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mpg-green)]" />{item.label}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper-tint)] py-16">
        <div className="shell">
          <SectionHeading index="02" eyebrow={copy.services.label} title={copy.services.title} />
          <div className="mt-10 grid gap-px border border-[var(--line-strong)] bg-[var(--line-strong)] md:grid-cols-3">
            {services.slice(0, 6).map((service, index) => (
              <Link key={service.id} href={`/${locale}/services/${service.slug}`} className="group bg-white p-6 transition hover:bg-[var(--mpg-blue)] hover:text-white">
                <div className="flex items-center justify-between"><span className="t-meta text-[var(--mpg-green-deep)] group-hover:text-[var(--mpg-green-bright)]">{String(index + 1).padStart(2, '0')}</span><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
                <h3 className="t-heading mt-12">{localized(service.title, locale)}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)] group-hover:text-white/70">{localized(service.description, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band-lg">
        <div className="shell">
          <SectionHeading index="03" eyebrow={copy.projects.label} title={copy.projects.sectionTitle} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {featuredProjects.map((project) => {
              const client = publicImageUrl(supabase, 'projects', project.cover_image);
              return <Link key={project.id} href={`/${locale}/projects/${project.slug}`} className="group">
                <div className="frame relative aspect-[4/5]"><SiteImage src={client} alt={localized(project.title, locale)} /></div>
                <div className="mt-4 flex items-start justify-between gap-4"><div><p className="t-meta text-[var(--mpg-green-deep)]">{project.category ?? 'Event production'}</p><h3 className="t-heading mt-2">{localized(project.title, locale)}</h3></div><MoveUpRight className="h-4 w-4 shrink-0 text-[var(--mpg-blue)]" /></div>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="trust-band on-dark">
        <div className="trust-band__watermark">MPG</div>
        <div className="shell relative z-10">
          <SectionHeading index="04" eyebrow={copy.why_choose.label} title={copy.why_choose.title} inverse />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
            <p className="t-display-sm max-w-xl text-white">{copy.why_choose.subtitle}</p>
            <ol className="track grid gap-8 text-white">
              {copy.process.steps.map((item) => <li key={item.num} className="track__step"><span className="track__node" /><span className="track__num">{item.num}</span><h3 className="mt-3 text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.desc}</p></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="band-lg">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div><SectionHeading index="05" eyebrow={copy.blog.label} title={copy.blog.title} /><div className="mt-10 grid gap-6">{blog.slice(0, 3).map((post) => <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group border-t border-[var(--line)] pt-4"><div className="flex items-start justify-between gap-6"><div><p className="t-meta text-[var(--text-faint)]">{post.category ?? copy.blog.title}</p><h3 className="mt-3 text-xl font-bold transition group-hover:text-[var(--mpg-blue)]">{localized(post.title, locale)}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{localized(post.excerpt, locale)}</p></div><ArrowRight className="mt-1 h-5 w-5 shrink-0 transition group-hover:translate-x-1" /></div></Link>)}</div></div>
          <div className="flex items-end justify-start lg:justify-end"><Link href={`/${locale}/contact`} className="btn btn-primary">{labels.enquire}<ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </>
  );
}
