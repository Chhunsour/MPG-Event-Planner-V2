import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, isPlaceholder, type Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import { contactImage } from "@/config/content";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import PageHeader from "@/components/layout/PageHeader";
import QuotationForm from "@/components/forms/QuotationForm";

interface ContactProps {
  locale: Locale;
  services: ApiService[];
}

export default function Contact({ locale, services }: ContactProps) {
  const dict = getDictionary(locale);

  const hasPhone = !isPlaceholder(siteConfig.contact.phone);
  const hasEmail = !isPlaceholder(siteConfig.contact.email);
  const hasTelegram = !isPlaceholder(siteConfig.contact.telegram);
  const hasFacebook = !isPlaceholder(siteConfig.contact.facebook);

  return (
    <>
      <SeoMeta
        title={dict.contact_form.title}
        description={dict.cta.subtitle || undefined}
        locale={locale}
        path="/contact"
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <PageHeader
          label={dict.cta.label}
          titleLine1={dict.contact_form.headline1}
          titleLine2={dict.contact_form.headline2}
          lead={dict.contact_form.intro}
          breadcrumbLabel={dict.common.breadcrumb}
          crumbs={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.contact },
          ]}
        />

        <section className="band bg-paper">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
            <aside className="lg:sticky lg:top-26 lg:col-span-4 lg:self-start">
              <p className="rule-tick t-meta text-muted">{dict.contact_form.officeLabel}</p>
              <h2 className="t-display-sm mt-4 text-ink-text">{dict.contact_form.officeTitle}</h2>

              <ul className="hr mt-6 pt-2">
                <li className="flex gap-3 border-b border-line py-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <span className="t-meta block text-faint">{dict.footer.address_label}</span>
                    <span className="t-body text-ink-text">{siteConfig.contact.address[locale]}</span>
                  </div>
                </li>

                <li className="flex gap-3 border-b border-line py-4">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <span className="t-meta block text-faint">{dict.footer.phone_label}</span>
                    {hasPhone ? (
                      <a href={`tel:${siteConfig.contact.phone}`} className="t-heading text-ink-text transition-colors hover:text-brand">
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    ) : (
                      <span className="t-heading text-ink-text">{siteConfig.contact.phoneDisplay}</span>
                    )}
                  </div>
                </li>

                <li className="flex gap-3 border-b border-line py-4">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="t-meta block text-faint">{dict.footer.email_label}</span>
                    {hasEmail ? (
                      <a href={`mailto:${siteConfig.contact.email}`} className="t-body wrap-break-word text-ink-text transition-colors hover:text-brand">
                        {siteConfig.contact.email}
                      </a>
                    ) : (
                      <span className="t-body wrap-break-word text-ink-text">{siteConfig.contact.email}</span>
                    )}
                  </div>
                </li>
              </ul>

              {(hasTelegram || hasFacebook) && (
                <div className="mt-6">
                  <span className="t-meta block text-faint">{dict.contact_form.messagingLabel}</span>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {hasTelegram && (
                      <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                        {dict.cta.telegram_cta}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    )}
                    {hasFacebook && (
                      <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                        {dict.cta.messenger_cta}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <figure className="frame mt-8 hidden aspect-4/3 w-full lg:block">
                <img src={contactImage} alt={dict.hero.imageAlt} className="h-full w-full object-cover" />
              </figure>
            </aside>

            <div className="lg:col-span-8">
              <QuotationForm locale={locale} dict={dict.contact_form} />
            </div>
          </div>
        </section>
      </AppLayout>
    </>
  );
}
