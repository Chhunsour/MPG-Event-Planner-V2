import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import PageHeader from "@/components/layout/PageHeader";

interface PrivacyProps {
  locale: Locale;
  services: ApiService[];
}

export default function Privacy({ locale, services }: PrivacyProps) {
  const dict = getDictionary(locale);

  return (
    <>
      <SeoMeta
        title={dict.privacy.title}
        locale={locale}
        path="/privacy"
        noindex
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <PageHeader
          label={dict.footer.quick_links}
          titleLine1={dict.privacy.title}
          breadcrumbLabel={dict.common.breadcrumb}
          crumbs={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.privacy.title },
          ]}
        />

        <section className="band bg-paper">
          <div className="shell">
            <div className="max-w-[68ch]">
              <p className="t-meta text-faint">{dict.privacy.last_updated}</p>
              <p className="t-lead hr mt-6 pt-6 text-muted">{dict.privacy.content}</p>
            </div>
          </div>
        </section>
      </AppLayout>
    </>
  );
}
