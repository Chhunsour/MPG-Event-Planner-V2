import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiProject, ApiService } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PageHeader from "@/components/layout/PageHeader";
import WorkGrid from "@/components/sections/WorkGrid";

interface ProjectsProps {
  locale: Locale;
  projects: ApiProject[];
  services: ApiService[];
}

export default function Projects({ locale, projects, services }: ProjectsProps) {
  const dict = getDictionary(locale);

  return (
    <>
      <SeoMeta
        title={dict.projects.title}
        description={dict.projects.subtitle || undefined}
        locale={locale}
        path="/projects"
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <PageHeader
          label={dict.projects.label}
          titleLine1={dict.projects.headline1}
          titleLine2={dict.projects.headline2}
          lead={dict.projects.subtitle}
          breadcrumbLabel={dict.common.breadcrumb}
          crumbs={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.projects },
          ]}
        />

        <section className="band bg-paper">
          <div className="shell">
            <ScrollReveal delay={60}>
            <WorkGrid
              locale={locale}
              projects={projects}
              dict={dict.projects}
              filterable
            />
            </ScrollReveal>
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
