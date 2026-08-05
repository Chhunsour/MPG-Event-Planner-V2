import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import type { ApiProject } from "@/lib/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";
import WorkGrid from "@/components/sections/WorkGrid";

export default function WorkBlock({
  locale,
  dict,
  projects,
}: {
  locale: Locale;
  dict: Dictionary;
  projects: ApiProject[];
}) {
  if (projects.length === 0) return null;

  return (
    <section className="band bg-paper-tint">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            num="04"
            label={dict.projects.label}
            title={dict.projects.sectionTitle}
            variant="inline"
            action={
              <Link
                href={`/${locale}/projects`}
                className="link-rule text-brand"
              >
                {dict.projects.viewAll}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </ScrollReveal>

        <ScrollReveal className="mt-9" delay={60}>
          <WorkGrid
            locale={locale}
            projects={projects}
            dict={dict.projects}
            limit={5}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
