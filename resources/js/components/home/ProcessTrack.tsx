import { Link } from "@inertiajs/react";
import { ArrowRight, Compass, MessageSquare, PenTool, CalendarCheck, Play, BarChart3 } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

const STEP_ICONS = [MessageSquare, PenTool, CalendarCheck, Play, BarChart3];

export default function ProcessTrack({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="on-dark band bg-ink text-white">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            icon={Compass}
            label={dict.process.label}
            title={dict.process.title}
            lead={dict.process.subtitle}
            variant="split"
            dark
          />
        </ScrollReveal>

        {/* 2-Column Mobile Grid, 3-Column Tablet, 5-Column Desktop Grid */}
        <ScrollReveal className="mt-10 lg:mt-12" stagger>
          <ol className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
            {dict.process.steps.map((step, idx) => {
              const IconComp = STEP_ICONS[idx % STEP_ICONS.length];
              return (
                <li
                  key={step.num}
                  className="flex flex-col justify-between rounded-xl border border-white/12 bg-white/5 p-4 text-white transition-all duration-200 hover:border-accent-bright/50 hover:bg-white/10"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-bright/15 text-accent-bright">
                        <IconComp className="h-4.5 w-4.5" aria-hidden="true" />
                      </div>
                      <span className="t-meta text-[11px] font-bold text-accent-bright/80">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="t-label mt-3.5 text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
                      {step.title}
                    </h3>

                    <p className="t-body mt-2 text-[11px] leading-relaxed text-white/75 sm:text-xs">
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </ScrollReveal>

        <ScrollReveal className="hr-ink mt-10 pt-7 lg:mt-12" delay={80}>
          <Link
            href={`/${locale}/contact`}
            className="link-rule text-white hover:text-white"
          >
            {dict.cta.quote_cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
