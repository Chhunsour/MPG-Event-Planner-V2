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

        <div className="mt-10 grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column Content & Stat Cards */}
          <ScrollReveal className="flex flex-col justify-between lg:col-span-6" stagger>
            <div className="space-y-4">
              <p className="t-lead text-muted">{dict.intro.description}</p>
              <p className="t-lead text-muted">{dict.intro.para2}</p>
              <div className="pt-2">
                <Link href={`/${locale}/about`} className="link-rule text-brand">
                  {dict.about.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-3">
              <div className="border-l-2 border-brand pl-3">
                <span className="t-display-sm block font-extrabold text-brand">10+</span>
                <span className="t-meta text-faint">
                  {locale === "km" ? "ឆ្នាំនៃបទពិសោធន៍" : locale === "zh" ? "多年行业经验" : "Years Experience"}
                </span>
              </div>
              <div className="border-l-2 border-accent pl-3">
                <span className="t-display-sm block font-extrabold text-accent">500+</span>
                <span className="t-meta text-faint">
                  {locale === "km" ? "ព្រឹត្តិការណ៍ជោគជ័យ" : locale === "zh" ? "成功举办活动" : "Successful Events"}
                </span>
              </div>
              <div className="col-span-2 border-l-2 border-ink-text pl-3 sm:col-span-1">
                <span className="t-display-sm block font-extrabold text-ink-text">100%</span>
                <span className="t-meta text-faint">
                  {locale === "km" ? "ការប្តេជ្ញាចិត្តខ្ពស់" : locale === "zh" ? "专业品质保证" : "Client Satisfaction"}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column Balanced Showcase Image */}
          <ScrollReveal className="lg:col-span-6" delay={100}>
            <figure className="frame aspect-4/3 w-full h-full min-h-[360px] lg:aspect-auto">
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
