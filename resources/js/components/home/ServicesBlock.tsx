import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";
import ServiceIndex from "@/components/sections/ServiceIndex";

export default function ServicesBlock({
  locale,
  dict,
  services,
}: {
  locale: Locale;
  dict: Dictionary;
  services: ApiService[];
}) {
  return (
    <section className="band bg-paper">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            num="03"
            label={dict.services.label}
            title={dict.services.indexTitle}
            lead={dict.services.indexIntro}
            action={
              <Link
                href={`/${locale}/services`}
                className="link-rule text-brand"
              >
                {dict.services.title}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </ScrollReveal>

        <ScrollReveal className="mt-10" delay={60}>
          <ServiceIndex
            locale={locale}
            services={services}
            flagshipLabel={dict.footer.flagship}
            viewLabel={dict.services.view}
            emptyLabel={dict.services.noServices}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
