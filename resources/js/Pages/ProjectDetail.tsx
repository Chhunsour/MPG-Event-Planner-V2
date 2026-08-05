import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiProject, ApiService } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import ContentDetail from "@/components/sections/ContentDetail";

interface ProjectDetailProps {
  locale: Locale;
  project: ApiProject;
  projects: ApiProject[];
  services: ApiService[];
}

export default function ProjectDetail({ locale, project, projects, services }: ProjectDetailProps) {
  const dict = getDictionary(locale);

  const related = projects.filter((entry) => entry.slug !== project.slug);

  return (
    <>
      <SeoMeta
        title={project.seo_title || project.title}
        description={project.seo_description || project.short_description || undefined}
        image={project.social_image || project.cover_image || undefined}
        locale={locale}
        path={`/projects/${project.slug}`}
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <ContentDetail
          locale={locale}
          kind="project"
          item={project}
          related={related}
          labels={{
            back: dict.common.breadcrumb,
            related: dict.projects.sectionTitle,
            features: dict.projects.scope,
            gallery: "Project gallery",
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
