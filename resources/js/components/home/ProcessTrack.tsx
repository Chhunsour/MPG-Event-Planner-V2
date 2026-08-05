import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

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
            num="05"
            label={dict.process.label}
            title={dict.process.title}
            lead={dict.process.subtitle}
            variant="split"
            dark
          />
        </ScrollReveal>

        <ScrollReveal className="mt-12" stagger>
          <ol className="track">
            {dict.process.steps.map((step) => (
              <li key={step.num} className="track__step">
                <span aria-hidden="true" className="track__node" />
                <span className="track__num" aria-hidden="true">
                  {step.num}
                </span>
                <h3 className="t-label mt-3 text-white">{step.title}</h3>
                <p className="t-body mt-2 max-w-[34ch] text-white/65">
                  {step.desc}
                </p>
              </li>
            ))}
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
