import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { ApiService } from "@/lib/types";

export interface ServiceItem {
  slug: string;
  title: string;
  short_description?: string | null;
  image?: string | null;
  is_featured?: boolean;
  href: string;
}

export interface ServiceIndexProps {
  locale: Locale;
  services?: ApiService[];
  flagshipLabel: string;
  viewLabel: string;
  emptyLabel?: string;
}

export default function ServiceIndex({
  locale,
  services,
  flagshipLabel,
  viewLabel,
  emptyLabel = "No services available.",
}: ServiceIndexProps) {
  const serviceList: ServiceItem[] =
    services && services.length > 0
      ? services.map((s) => ({
          slug: s.slug,
          title: s.title,
          short_description: s.short_description,
          image: s.image,
          is_featured: s.is_featured,
          href: `/${locale}/services/${s.slug}`,
        }))
      : [];

  const withImages = serviceList.filter((service) => service.image);
  const [activeSlug, setActiveSlug] = useState<string | null>(
    withImages[0]?.slug ?? null,
  );
  const [mounted, setMounted] = useState<string[]>(
    withImages[0] ? [withImages[0].slug] : [],
  );

  const activate = (slug: string) => {
    setActiveSlug(slug);
    setMounted((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  };

  if (serviceList.length === 0) {
    return <p className="t-lead py-8 text-muted">{emptyLabel}</p>;
  }

  const active = withImages.find((service) => service.slug === activeSlug);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <ul className="lg:col-span-7">
        {serviceList.map((service, index) => {
          const isFlagship = service.is_featured;
          const isActive = activeSlug === service.slug;

          return (
            <li key={service.slug} className="border-b border-line first:border-t">
              <Link
                href={service.href}
                onMouseEnter={() => service.image && activate(service.slug)}
                onFocus={() => service.image && activate(service.slug)}
                data-pressable
                className={`group flex items-start gap-5 py-6 transition-[background-color,color,transform] sm:gap-8 ${
                  isActive ? "lg:bg-brand-tint/60" : ""
                } lg:-mx-5 lg:px-5`}
              >
                <span
                  aria-hidden="true"
                  className={`t-num mt-1.5 w-6 shrink-0 text-[0.6875rem] tracking-[0.08em] transition-colors ${
                    isFlagship
                      ? "text-accent"
                      : "text-faint group-hover:text-brand"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className={`${
                        isFlagship ? "t-display-sm" : "t-heading"
                      } text-ink-text transition-colors group-hover:text-brand`}
                    >
                      {service.title}
                    </span>
                    {isFlagship && (
                      <span className="t-meta bg-accent-deep px-2 py-1 text-white">
                        {flagshipLabel}
                      </span>
                    )}
                  </span>
                  {service.short_description && (
                    <span className="t-body mt-1.5 block max-w-[46ch] text-muted">
                      {service.short_description}
                    </span>
                  )}
                </span>

                <span className="t-meta hidden shrink-0 items-center gap-2 pt-2 text-faint transition-colors group-hover:text-brand sm:flex">
                  <span className="hidden lg:inline">{viewLabel}</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {withImages.length > 0 && (
        <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
          <div className="frame sticky top-[104px] aspect-[4/5] w-full">
            {withImages
              .filter((service) => mounted.includes(service.slug))
              .map((service) => (
                <img
                  key={service.slug}
                  src={service.image as string}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    activeSlug === service.slug ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            <div className="scrim-b absolute inset-0" />
            {active && (
              <p className="t-meta absolute bottom-5 left-5 right-5 z-10 text-white">
                {active.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
