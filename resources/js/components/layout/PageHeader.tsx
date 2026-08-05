import { Link } from "@inertiajs/react";
import { siteConfig } from "@/config/site";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  label: string;
  titleLine1: string;
  titleLine2?: string;
  lead?: string;
  crumbs: Crumb[];
  breadcrumbLabel: string;
}

export default function PageHeader({
  label,
  titleLine1,
  titleLine2,
  lead,
  crumbs,
  breadcrumbLabel,
}: PageHeaderProps) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${siteConfig.url}${crumb.href}` } : {}),
    })),
  };

  return (
    <section className="on-dark bg-ink pb-12 pt-26 text-white lg:pb-16 lg:pt-29">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="shell">
        <nav aria-label={breadcrumbLabel}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-white/55">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="t-meta text-white/55 transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="t-meta text-white" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-9 grid gap-6 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="rule-tick t-meta text-white/60">{label}</p>
            <h1 className="t-display-lg mt-4 text-white">
              {titleLine1}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h1>
          </div>
          {lead && (
            <p className="t-lead self-end text-white/75 lg:col-span-5">
              {lead}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
