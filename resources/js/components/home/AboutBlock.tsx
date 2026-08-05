import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import { teamImage } from "@/config/content";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

export default function AboutBlock({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="band band-underlap bg-paper">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            num="01"
            label={dict.intro.label}
            title={
              <>
                {dict.intro.statement_line1}
                <br />
                {dict.intro.statement_line2}
              </>
            }
          />
        </ScrollReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal className="lg:col-span-6" stagger>
            <p className="t-lead text-muted">{dict.intro.description}</p>
            <p className="t-lead mt-5 text-muted">{dict.intro.para2}</p>
            <div className="mt-8">
              <Link href={`/${locale}/about`} className="link-rule text-brand">
                {dict.about.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-5 lg:col-start-8" delay={100}>
            <figure className="frame aspect-4/3 w-full lg:aspect-4/5">
              <img
                src={teamImage}
                alt={dict.about.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="scrim-b absolute inset-0" />
              <figcaption className="t-meta absolute inset-x-0 bottom-0 z-10 p-5 text-white/85">
                {dict.about.capabilitiesLabel}
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>

        <ScrollReveal className="hr mt-12 pt-8" stagger>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-4">
            {dict.intro.pillars.map((pillar) => (
              <li key={pillar.num} className="flex items-baseline gap-3.5">
                <span className="t-num text-[0.6875rem] tracking-[0.08em] text-accent">
                  {pillar.num}
                </span>
                <span className="t-label text-ink-text">{pillar.label}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
