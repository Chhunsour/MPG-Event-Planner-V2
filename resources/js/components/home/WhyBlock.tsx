import type { Dictionary } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

export default function WhyBlock({ dict }: { dict: Dictionary }) {
  return (
    <section className="band bg-paper">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            num="06"
            label={dict.why_choose.label}
            title={dict.why_choose.title}
            lead={dict.why_choose.subtitle}
            variant="split"
          />
        </ScrollReveal>

        <ScrollReveal className="mt-11" stagger>
          <dl>
            {dict.why_choose.reasons.map((reason) => (
              <div
                key={reason.title}
                className="grid gap-x-14 gap-y-2 border-t border-line py-7 last:border-b lg:grid-cols-12"
              >
                <dt className="t-display-sm max-w-[24ch] text-ink-text lg:col-span-5">
                  {reason.title}
                </dt>
                <dd className="t-body max-w-[62ch] text-muted lg:col-span-6 lg:col-start-7">
                  {reason.desc}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  );
}
