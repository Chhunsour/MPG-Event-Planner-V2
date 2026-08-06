import { Link } from "@inertiajs/react";
import { ArrowRight, Crown, Sparkles, Scissors, Palette, Volume2, Users, Wrench, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import { flagshipImage } from "@/config/content";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

const CAPABILITY_ICONS = [
  Sparkles,
  Scissors,
  Palette,
  Volume2,
  Users,
  Wrench,
  ShieldCheck,
  CheckCircle2,
];

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
      <div className="shell band">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14 lg:items-center">
          {/* Header on Mobile View */}
          <div className="lg:hidden">
            <SectionHead
              icon={Crown}
              label={dict.featured.tag}
              title={service.title}
              dark
            />
            {body && (
              <p className="t-lead mt-4 text-white/80">{body}</p>
            )}
          </div>

          {/* Showcase Image (Directly under title on mobile, left column on desktop) */}
          <ScrollReveal className="lg:col-span-5 lg:-mt-12" delay={60}>
            <figure className="frame aspect-4/3 w-full rounded-xl overflow-hidden shadow-xl border border-white/10 sm:aspect-16/10 lg:aspect-4/5">
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

          {/* Capabilities & CTA Content */}
          <div className="lg:col-span-6 lg:col-start-7">
            {/* Header on Desktop View */}
            <ScrollReveal className="hidden lg:block">
              <SectionHead
                icon={Crown}
                label={dict.featured.tag}
                title={service.title}
                dark
              />
              {body && (
                <p className="t-lead mt-6 max-w-[52ch] text-white/80">{body}</p>
              )}
            </ScrollReveal>

            <ScrollReveal stagger delay={80}>
              <div className="mt-6 lg:mt-8">
                <h3 className="t-meta border-b border-white/15 pb-3 text-white/60">
                  {dict.featured.capabilitiesLabel}
                </h3>
                {/* 2-Column Grid with Real Icons */}
                <ul className="mt-4 grid grid-cols-2 gap-3">
                  {capabilities.map((capability, index) => {
                    const IconComp = CAPABILITY_ICONS[index % CAPABILITY_ICONS.length];
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-2.5 rounded-lg border border-white/12 bg-white/5 p-2.5 text-white/95 transition-all duration-200 hover:border-accent-bright/40 hover:bg-white/10"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-accent-bright/15 text-accent-bright">
                          <IconComp className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <span className="t-body text-xs font-semibold text-white/90">
                          {capability}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-8 lg:mt-9">
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
