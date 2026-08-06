import { Link } from "@inertiajs/react";
import { ArrowUpRight, Sparkles, Target, Zap, Tv, Users, Award, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import { teamImage } from "@/config/content";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

const PILLAR_ICONS = [Target, Zap, Tv, Users];

export default function AboutBlock({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="band band-underlap bg-paper overflow-hidden">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            icon={Sparkles}
            label={dict.intro.label}
            title={
              <>
                {dict.intro.statement_line1}{" "}
                {dict.intro.statement_line2}
              </>
            }
          />
        </ScrollReveal>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column Content & 2x2 Feature Card Grid */}
          <div className="lg:col-span-7">
            <ScrollReveal stagger>
              <p className="t-lead text-muted max-w-[54ch]">{dict.intro.description}</p>
              <p className="t-body mt-3 text-muted max-w-[54ch]">{dict.intro.para2}</p>

              {/* 4 Core Pillars Grid with Real Icons */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {dict.intro.pillars.map((pillar, idx) => {
                  const IconComp = PILLAR_ICONS[idx % PILLAR_ICONS.length];
                  return (
                    <div
                      key={pillar.num}
                      className="flex items-start gap-3.5 rounded-lg border border-line bg-paper-tint p-4 transition-all duration-200 hover:border-brand/30 hover:bg-paper hover:shadow-sm"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                        <IconComp className="h-4.5 w-4.5" aria-hidden="true" />
                      </div>
                      <div>
                        <strong className="t-label block text-ink-text">{pillar.label}</strong>
                        <span className="t-meta text-xs text-faint">
                          {idx === 0
                            ? (locale === "km" ? "ការរចនា និងគំនិតច្នៃប្រឌិត" : "Creative & Strategic Design")
                            : idx === 1
                            ? (locale === "km" ? "ការអនុវត្តយ៉ាងរលូន" : "Seamless Precision Execution")
                            : idx === 2
                            ? (locale === "km" ? "ឧបករណ៍បច្ចេកវិទ្យាទំនើប" : "High-End Sound & Lighting")
                            : (locale === "km" ? "សេវាកម្មកម្រិត VIP" : "Dedicated VIP Event Support")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/${locale}/about`} className="btn btn-primary">
                  {dict.about.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column Balanced Image Showcase with Floating Stat Badges */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={100}>
              <div className="relative overflow-hidden rounded-xl border border-line shadow-lg">
                <figure className="frame aspect-4/3 w-full sm:aspect-16/10 lg:aspect-4/3">
                  <img
                    src={teamImage}
                    alt={dict.about.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="scrim-b absolute inset-0" />
                  <figcaption className="t-meta absolute inset-x-0 bottom-0 z-10 p-4 text-white/90">
                    {dict.about.capabilitiesLabel}
                  </figcaption>
                </figure>

                {/* Floating Metric Badge 1 */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-3 rounded-lg border border-white/20 bg-ink/90 px-4 py-2.5 text-white shadow-xl backdrop-blur-md">
                  <Award className="h-5 w-5 text-accent-bright shrink-0" />
                  <div>
                    <span className="t-heading block text-sm font-extrabold text-white">6+ Years</span>
                    <span className="t-meta text-[11px] text-white/70">
                      {locale === "km" ? "បទពិសោធន៍" : "Proven Track Record"}
                    </span>
                  </div>
                </div>

                {/* Floating Metric Badge 2 */}
                <div className="absolute bottom-14 right-4 z-20 flex items-center gap-3 rounded-lg border border-white/20 bg-paper/95 px-4 py-2.5 text-ink-text shadow-xl backdrop-blur-md">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
                  <div>
                    <span className="t-heading block text-sm font-extrabold text-brand">500+ Events</span>
                    <span className="t-meta text-[11px] text-faint">
                      {locale === "km" ? "ព្រឹត្តិការណ៍ជោគជ័យ" : "Delivered Perfectly"}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
