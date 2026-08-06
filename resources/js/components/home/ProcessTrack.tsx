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

        <ScrollReveal className="mt-12" stagger>
          <ol className="track">
            {dict.process.steps.map((step, idx) => {
              const IconComp = STEP_ICONS[idx % STEP_ICONS.length];
              return (
                <li key={step.num} className="track__step">
                  <span aria-hidden="true" className="track__node" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 text-accent-bright">
                    <IconComp className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>
                  <h3 className="t-label mt-3 text-white">{step.title}</h3>
                  <p className="t-body mt-2 max-w-[34ch] text-white/65">
                    {step.desc}
                  </p>
                </li>
              );
            })}
          </ol>
        </ScrollReveal>

        <ScrollReveal className="hr-ink mt-12 pt-7" delay={80}>
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
