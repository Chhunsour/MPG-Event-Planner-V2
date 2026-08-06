import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Sparkles, Zap, Building2, Ticket, Tv, Wrench, Layers } from "lucide-react";
import type { Locale } from "@/config/site";
import type { ApiService } from "@/lib/types";

const SERVICE_ICONS = [
  Sparkles,
  Zap,
  Building2,
  Ticket,
  Tv,
  Wrench,
  Layers,
];

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
      {/* 2-Column Grid on Mobile, Tablet & Desktop Layout */}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7 lg:grid-cols-1 lg:gap-0">
        {serviceList.map((service, index) => {
          const isFlagship = service.is_featured;
          const isActive = activeSlug === service.slug;
          const IconComp = SERVICE_ICONS[index % SERVICE_ICONS.length];

          return (
            <li key={service.slug} className="lg:border-b lg:border-line lg:first:border-t">
              <Link
                href={service.href}
                onMouseEnter={() => service.image && activate(service.slug)}
                onFocus={() => service.image && activate(service.slug)}
                data-pressable
                className={`group flex h-full flex-col justify-between rounded-xl border border-line bg-paper-tint p-3.5 transition-all duration-200 hover:border-brand/40 hover:bg-paper hover:shadow-sm sm:p-5 lg:flex-row lg:items-start lg:gap-5 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:py-6 lg:hover:shadow-none ${
                  isActive ? "lg:bg-brand-tint/60" : ""
                } lg:-mx-5 lg:px-5`}
              >
                <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:gap-4">
                  {/* Real Lucide Icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors sm:h-9 sm:w-9">
                    <IconComp className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true" />
                  </div>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={`text-xs font-bold leading-snug sm:text-sm ${
                          isFlagship ? "t-display-sm text-brand" : "t-heading"
                        } text-ink-text transition-colors group-hover:text-brand`}
                      >
                        {service.title}
                      </span>
                      {isFlagship && (
                        <span className="t-meta bg-accent-deep px-1.5 py-0.5 text-[10px] text-white rounded-sm font-semibold">
                          {flagshipLabel}
                        </span>
                      )}
                    </span>
                    {service.short_description && (
                      <span className="t-body mt-1.5 block text-[11px] leading-relaxed text-muted line-clamp-2 sm:text-xs">
                        {service.short_description}
                      </span>
                    )}
                  </span>
                </div>

                <span className="t-meta mt-3 flex items-center justify-end gap-1 text-[11px] font-semibold text-brand transition-colors group-hover:translate-x-1 lg:mt-0 lg:pt-2 lg:text-faint lg:group-hover:text-brand sm:text-xs">
                  <span className="lg:hidden">{viewLabel}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Sticky Right Preview Frame on Desktop */}
      {withImages.length > 0 && (
        <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
          <div className="frame sticky top-[104px] aspect-[4/5] w-full rounded-xl overflow-hidden shadow-lg border border-line">
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
              <p className="t-meta absolute bottom-5 left-5 right-5 z-10 text-white font-semibold">
                {active.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
