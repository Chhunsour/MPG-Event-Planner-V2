import type { Dictionary } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function TrustBand({ dict }: { dict: Dictionary }) {
  return (
    <section className="trust-band on-dark text-white">
      <span className="trust-band__watermark" aria-hidden="true">
        08
      </span>

      <div className="shell relative">
        <ScrollReveal className="grid gap-x-14 gap-y-7 border-t border-white/30 pt-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="t-num text-[0.6875rem] tracking-[0.08em] text-accent-on-blue">
                08
              </span>
              <span className="h-0.75 w-8 bg-accent-bright" aria-hidden="true" />
              <p className="t-meta text-on-blue">{dict.clients.label}</p>
            </div>
            <h2 className="t-display-lg mt-7 max-w-[18ch] text-white">
              {dict.clients.title}
            </h2>
          </div>

          <p className="t-lead max-w-[46ch] self-end text-white/85 lg:col-span-4 lg:col-start-9">
            {dict.clients.description}
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-12" stagger>
          <ul className="trust-audience-grid">
            {dict.clients.segments.map((segment, index) => (
              <li key={segment}>
                <span className="t-num text-[0.6875rem] tracking-[0.08em] text-white/55">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-1.75 w-1.75 shrink-0 bg-accent-bright"
                  />
                  <span className="t-heading text-white">{segment}</span>
                </span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
