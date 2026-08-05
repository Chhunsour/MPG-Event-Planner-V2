import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PageHeader from "@/components/layout/PageHeader";
import BrandMark from "@/components/layout/BrandMark";

interface ServicesProps {
  locale: Locale;
  services: ApiService[];
}

export default function Services({ locale, services }: ServicesProps) {
  const dict = getDictionary(locale);

  return (
    <>
      <SeoMeta
        title={dict.services.title}
        description={dict.services.subtitle || undefined}
        locale={locale}
        path="/services"
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <PageHeader
          label={dict.services.label}
          titleLine1={dict.services.headline1}
          titleLine2={dict.services.headline2}
          lead={dict.services.subtitle}
          breadcrumbLabel={dict.common.breadcrumb}
          crumbs={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.services },
          ]}
        />

        {services.length === 0 ? (
          <section className="band bg-paper">
            <div className="shell">
              <p className="t-lead py-12 text-muted">{dict.services.noServices}</p>
            </div>
          </section>
        ) : services.map((service, index) => {
          const imageFirst = index % 2 === 0;
          const href = `/${locale}/services/${service.slug}`;

          return (
            <section
              key={service.slug}
              id={service.slug}
              className={`band ${index % 2 === 0 ? "bg-paper" : "bg-paper-tint"}`}
            >
              <div className="shell">
                <ScrollReveal stagger>
                <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <div className={`lg:col-span-7 ${imageFirst ? "" : "lg:order-2"}`}>
                    {service.image ? (
                      <Link href={href} className="group block" data-pressable>
                        <figure className="frame aspect-16/10 w-full">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </figure>
                      </Link>
                    ) : (
                      <div className="frame flex aspect-16/10 items-center justify-center bg-brand-tint">
                        <BrandMark className="h-12 w-12 text-brand/40" />
                      </div>
                    )}
                  </div>

                  <div className={`lg:col-span-5 ${imageFirst ? "" : "lg:order-1"}`}>
                    <p className="flex items-center gap-3">
                      <BrandMark className="h-6 w-6" />
                      <span aria-hidden="true" className="h-px w-8 bg-accent" />
                    </p>

                    <h2 className="t-display mt-4 text-ink-text">{service.title}</h2>

                    <div
                      className="t-lead mt-4 text-muted [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                      dangerouslySetInnerHTML={{ __html: service.description || service.short_description || "" }}
                    />

                    {service.capabilities && service.capabilities.length > 0 && (
                      <>
                        <h3 className="t-meta mt-8 border-b border-line pb-3 text-faint">
                          {dict.services.includedLabel}
                        </h3>
                        <ul>
                          {service.capabilities.map((capability) => (
                            <li key={capability} className="flex items-center gap-3 border-b border-line py-3">
                              <span aria-hidden="true" className="h-1.75 w-1.75 shrink-0 bg-accent" />
                              <span className="t-body text-ink-text">{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <div className="mt-8">
                      <Link href={href} className="btn btn-primary">
                        {dict.services.view}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
                </ScrollReveal>
              </div>
            </section>
          );
        })}

        <section className="on-dark band-sm bg-brand text-white">
          <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="t-meta text-on-blue">{dict.cta.label}</p>
              <h2 className="t-display-sm mt-2 text-white">{dict.cta.title}</h2>
            </div>
            <Link href={`/${locale}/contact`} className="btn btn-onblue shrink-0">
              {dict.cta.quote_cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </AppLayout>
    </>
  );
}
