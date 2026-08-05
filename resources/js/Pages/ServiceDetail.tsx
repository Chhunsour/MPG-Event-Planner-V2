import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiService, ApiProject } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import ContentDetail from "@/components/sections/ContentDetail";

interface ServiceDetailProps {
  locale: Locale;
  service: ApiService;
  services: ApiService[];
  projects: ApiProject[];
}

export default function ServiceDetail({ locale, service, services, projects }: ServiceDetailProps) {
  const dict = getDictionary(locale);

  const related = projects.length > 0
    ? projects
    : services.filter((entry) => entry.slug !== service.slug);

  return (
    <>
      <SeoMeta
        title={service.seo_title || service.title}
        description={service.seo_description || service.short_description || undefined}
        image={service.social_image || service.image || undefined}
        locale={locale}
        path={`/services/${service.slug}`}
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <ContentDetail
          locale={locale}
          kind="service"
          item={service}
          related={related}
          labels={{
            back: dict.common.breadcrumb,
            related: dict.services.indexTitle,
            features: dict.services.includedLabel,
            gallery: "Related projects",
            inquire: dict.cta.quote_cta,
            projectIndex: dict.projects.label,
            serviceIndex: dict.services.label,
            location: dict.projects.location,
            year: dict.projects.year,
          }}
        />
      </AppLayout>
    </>
  );
}
