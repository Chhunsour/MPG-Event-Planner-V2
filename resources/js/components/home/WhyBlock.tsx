import { ShieldCheck, Layers, Clock, Award } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

const REASON_ICONS = [ShieldCheck, Layers, Clock, Award];

export default function WhyBlock({ dict }: { dict: Dictionary }) {
  return (
    <section className="band bg-paper">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            icon={ShieldCheck}
            label={dict.why_choose.label}
            title={dict.why_choose.title}
            lead={dict.why_choose.subtitle}
            variant="split"
          />
        </ScrollReveal>

        <ScrollReveal className="mt-11" stagger>
          <dl>
            {dict.why_choose.reasons.map((reason, idx) => {
              const IconComp = REASON_ICONS[idx % REASON_ICONS.length];
              return (
                <div
                  key={reason.title}
                  className="grid items-start gap-x-14 gap-y-3 border-t border-line py-7 last:border-b lg:grid-cols-12"
                >
                  <dt className="t-display-sm flex items-center gap-3 max-w-[24ch] text-ink-text lg:col-span-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                      <IconComp className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>{reason.title}</span>
                  </dt>
                  <dd className="t-body max-w-[62ch] text-muted lg:col-span-6 lg:col-start-7 lg:pt-1">
                    {reason.desc}
                  </dd>
                </div>
              );
            })}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  );
}
