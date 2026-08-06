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

      {/* Infinite Horizontal Sliding Interactive Service Buttons Rail */}
      {services.length > 0 && (
        <div className="hero__rail relative overflow-hidden border-t border-white/15 bg-[#004a8c]/90 py-3 backdrop-blur-md">
          <div className="flex items-center">
            {/* Label Badge */}
            <div className="z-20 flex shrink-0 items-center gap-2.5 bg-[#004a8c] py-1 pl-4 pr-3 sm:pl-8">
              <span className="t-meta text-xs font-bold uppercase tracking-wider text-accent-on-blue whitespace-nowrap">
                {dict.hero.stripLabel}
              </span>
              <span className="h-4 w-px bg-white/25" />
            </div>

            {/* Continuous Marquee Track of Clickable Service Buttons */}
            <div className="relative flex flex-1 overflow-hidden">
              <div className="animate-marquee-smooth flex items-center gap-3 whitespace-nowrap py-1">
                {[...services, ...services, ...services, ...services, ...services].map((service, idx) => (
                  <Link
                    key={`${service.id}-${idx}`}
                    href={`/${locale}/services/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:border-accent-bright hover:bg-accent-bright hover:text-ink active:scale-95 shrink-0"
                  >
                    <span>{service.title}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-70" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
