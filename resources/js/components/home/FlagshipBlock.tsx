import { Link } from "@inertiajs/react";
import { ArrowRight, Crown } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import { flagshipImage } from "@/config/content";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

export default function FlagshipBlock({
  locale,
  dict,
  service,
}: {
  locale: Locale;
  dict: Dictionary;
  service: ApiService;
}) {
  const capabilities = service.capabilities?.length
    ? service.capabilities
    : dict.featured.bullets;

  const body = service.description || service.short_description;

  return (
    <section className="on-dark relative bg-ink text-white">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal
            className="lg:col-span-5 lg:-mt-20"
            delay={60}
          >
            <figure className="frame aspect-4/3 w-full sm:aspect-16/10 lg:aspect-4/5">
              <img
                src={service.image || flagshipImage}
                alt={service.image_alt || dict.featured.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 bg-accent"
              />
            </figure>
          </ScrollReveal>

          <div className="band pt-0 lg:col-span-6 lg:col-start-7 lg:pt-18">
            <ScrollReveal>
              <SectionHead
                icon={Crown}
                label={dict.featured.tag}
                title={service.title}
                dark
              />
            </ScrollReveal>

            <ScrollReveal stagger delay={80}>
              {body && (
                <p className="t-lead mt-6 max-w-[52ch] text-white/80">{body}</p>
              )}

              <div className="mt-9">
                <h3 className="t-meta border-b border-white/15 pb-3 text-white/55">
                  {dict.featured.capabilitiesLabel}
                </h3>
                <ul className="grid sm:grid-cols-2 sm:gap-x-10">
                  {capabilities.map((capability, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 border-b border-white/15 py-3"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.75 w-1.75 shrink-0 bg-accent-bright"
                      />
                      <span className="t-body text-white/90">{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-9">
                <Link
                  href={`/${locale}/services/${service.slug}`}
                  className="btn btn-onink"
                >
                  {dict.featured.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
