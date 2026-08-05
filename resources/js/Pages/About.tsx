import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import { aboutImage } from "@/config/content";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import PageHeader from "@/components/layout/PageHeader";
import BrandMark from "@/components/layout/BrandMark";

interface AboutProps {
  locale: Locale;
  services: ApiService[];
}

export default function About({ locale, services }: AboutProps) {
  const dict = getDictionary(locale);

  return (
    <>
      <SeoMeta
        title={dict.intro.title}
        description={dict.intro.subtitle || undefined}
        locale={locale}
        path="/about"
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <PageHeader
          label={dict.about.label}
          titleLine1={dict.about.headline1}
          titleLine2={dict.about.headline2}
          lead={dict.intro.subtitle}
          breadcrumbLabel={dict.common.breadcrumb}
          crumbs={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.about },
          ]}
        />

        <section className="band bg-paper">
          <div className="shell grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="rule-tick t-meta text-muted">{dict.about.storyLabel}</p>
              <h2 className="t-display mt-5 text-ink-text">{dict.about.storyTitle}</h2>
              <p className="t-lead mt-5 text-muted">{dict.intro.description}</p>
              <p className="t-lead mt-4 text-muted">{dict.intro.para2}</p>

              <ul className="hr mt-8 grid grid-cols-2 gap-4 pt-6">
                {dict.intro.pillars.map((pillar) => (
                  <li key={pillar.num} className="flex items-baseline gap-3">
                    <BrandMark className="h-4 w-4" />
                    <span className="t-label text-ink-text">{pillar.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="frame aspect-4/3 w-full lg:col-span-6 lg:col-start-7 lg:aspect-4/5">
              <img src={aboutImage} alt={dict.about.imageAlt} className="h-full w-full object-cover" />
            </figure>
          </div>
        </section>

        <section className="on-dark band bg-ink text-white">
          <div className="shell">
            <div className="hr-ink flex flex-col gap-4 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="rule-tick t-meta text-white/60">{dict.about.standardsLabel}</p>
                <h2 className="t-display mt-4 text-white">{dict.about.standardsTitle}</h2>
              </div>
            </div>

            <ul className="grid md:grid-cols-3">
              {dict.about.standards.map((standard) => (
                <li
                  key={standard.title}
                  className="border-b border-white/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                >
                  <BrandMark className="h-6 w-6" />
                  <h3 className="t-heading mt-3 text-white">{standard.title}</h3>
                  <p className="t-body mt-3 text-white/70">{standard.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="band bg-paper">
          <div className="shell">
            <div className="hr flex flex-col gap-4 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="rule-tick t-meta text-muted">{dict.about.capabilitiesLabel}</p>
                <h2 className="t-display mt-4 text-ink-text">{dict.services.indexTitle}</h2>
              </div>
              <Link href={`/${locale}/services`} className="link-rule text-brand">
                {dict.services.view}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {services.length > 0 ? (
              <ul className="grid gap-x-12 md:grid-cols-2">
                {services.map((service) => (
                  <li key={service.id} className="flex items-baseline gap-5 border-b border-line py-5">
                    <BrandMark className="h-4 w-4" />
                    <div>
                      <h3 className="t-heading text-ink-text">{service.title}</h3>
                      <p className="t-body mt-1 text-muted">{service.short_description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="t-lead py-8 text-muted">{dict.services.noServices}</p>
            )}
          </div>
        </section>

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
