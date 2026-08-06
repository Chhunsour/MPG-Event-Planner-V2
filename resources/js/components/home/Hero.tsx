import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import { heroImage } from "@/config/content";
import BrandMark from "@/components/layout/BrandMark";

export default function Hero({
  locale,
  dict,
  services,
}: {
  locale: Locale;
  dict: Dictionary;
  services: ApiService[];
}) {
  return (
    <section
      className="hero on-dark relative isolate overflow-hidden bg-brand text-white"
      aria-label={dict.hero.title}
    >
      <div className="hero__photo absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt={dict.hero.imageAlt}
          className="h-full w-full object-cover object-[62%_58%]"
        />
      </div>

      <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="hero-grid absolute inset-0 -z-10 hidden lg:block"
      />
      <div
        aria-hidden="true"
        className="hero-veil-top absolute inset-x-0 top-0 -z-10 h-40"
      />

      <div className="shell">
        <div className="hero__stage flex items-center pb-12 pt-31 lg:pb-16 lg:pt-34">
          <div className="hero__content max-w-136 lg:max-w-152">
            <p className="hero__kicker">
              <BrandMark className="h-5 w-5" />
              <span className="t-meta text-white">{dict.hero.company}</span>
              <span className="t-meta text-on-blue">{dict.hero.place}</span>
            </p>

            <h1 className="hero__headline t-hero mt-6 text-white">
              <span className="t-hero-strong block">
                {dict.hero.headline_line1}
              </span>
              <span className="t-hero-soft block text-accent-on-blue">
                {dict.hero.headline_highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-white/85 lg:text-[1.125rem]">
              {dict.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={`/${locale}/contact`} className="btn btn-onblue btn-lg">
                {dict.hero.ctaPlan}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/${locale}/projects`}
                className="link-rule text-white hover:text-white"
              >
                {dict.hero.ctaProjects}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slow, Elegant Infinite Ticker Rail */}
      {services.length > 0 && (
        <div className="hero__rail relative overflow-hidden border-t border-white/12 bg-black/40 py-3.5 backdrop-blur-md">
          {/* Subtle Side Fade Mask */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ink/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ink/90 to-transparent" />

          <div className="flex items-center gap-6 px-4 sm:px-8">
            {/* Label */}
            <div className="flex shrink-0 items-center gap-3">
              <span className="t-meta text-[11px] font-bold uppercase tracking-widest text-white/60 whitespace-nowrap">
                {dict.hero.stripLabel}
              </span>
              <span className="h-3.5 w-px bg-white/20" />
            </div>

            {/* Slow Smooth Marquee Track */}
            <div className="relative flex flex-1 overflow-hidden">
              <div className="animate-marquee-smooth flex items-center gap-8 whitespace-nowrap">
                {[...services, ...services, ...services, ...services].map((service, idx) => (
                  <div key={`${service.id}-${idx}`} className="flex items-center gap-8">
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="t-meta text-xs font-semibold tracking-wide text-white/85 transition-colors hover:text-accent-bright"
                    >
                      {service.title}
                    </Link>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-bright/60 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
