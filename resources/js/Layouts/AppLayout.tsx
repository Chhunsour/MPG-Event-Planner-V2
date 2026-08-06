import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { siteConfig, isPlaceholder, type Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import HeaderNav from "@/components/layout/HeaderNav";
import BrandMark from "@/components/layout/BrandMark";

interface AppLayoutProps {
  children: ReactNode;
  locale: Locale;
  dict: Dictionary;
  services?: ApiService[];
}

import { useEffect } from "react";

export default function AppLayout({
  children,
  locale,
  dict,
  services = [],
}: AppLayoutProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    const body = document.body;
    const html = document.documentElement;

    html.classList.remove("font-en", "font-km", "font-zh");
    body.classList.remove("font-en", "font-km", "font-zh");

    if (locale === "km") {
      html.classList.add("font-km");
      body.classList.add("font-km");
    } else if (locale === "zh") {
      html.classList.add("font-zh");
      body.classList.add("font-zh");
    } else {
      html.classList.add("font-en");
      body.classList.add("font-en");
    }
  }, [locale]);
  const hasPhone = !isPlaceholder(siteConfig.contact.phone);
  const hasEmail = !isPlaceholder(siteConfig.contact.email);
  const hasTelegram = !isPlaceholder(siteConfig.contact.telegram);
  const hasFacebook = !isPlaceholder(siteConfig.contact.facebook);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <a href="#main" className="skip-link">
        {dict.nav.skip}
      </a>

      <HeaderNav locale={locale} dict={dict.nav} />

      <main id="main" className="flex-1 scroll-mt-24">
        {children}
      </main>

      <footer className="on-dark mt-auto bg-ink text-white/70">
        <div className="shell">
          <div className="grid gap-6 border-b border-white/12 py-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright"
                aria-hidden="true"
              />
              <div>
                <span className="t-meta block text-white/60">
                  {dict.footer.address_label}
                </span>
                <span className="t-body text-white/85">
                  {siteConfig.contact.address[locale]}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright"
                aria-hidden="true"
              />
              <div>
                <span className="t-meta block text-white/60">
                  {dict.footer.phone_label}
                </span>
                {hasPhone ? (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="t-body font-semibold text-white transition-colors hover:text-accent-bright"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                ) : (
                  <span className="t-body text-white/85">
                    {siteConfig.contact.phoneDisplay}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Mail
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright"
                aria-hidden="true"
              />
              <div>
                <span className="t-meta block text-white/60">
                  {dict.footer.email_label}
                </span>
                {hasEmail ? (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="t-body text-white transition-colors hover:text-accent-bright"
                  >
                    {siteConfig.contact.email}
                  </a>
                ) : (
                  <span className="t-body text-white/85">
                    {siteConfig.contact.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <img
                src="/images/mpg-logo.png"
                alt="MPG Event Planner"
                width={366}
                height={121}
                className="h-9.5 w-auto object-contain brightness-0 invert"
              />
              <p className="t-body mt-5 max-w-xs text-white/60">
                {dict.footer.about_desc}
              </p>
            </div>

            <nav className="lg:col-span-3" aria-label={dict.footer.quick_links}>
              <h2 className="t-meta border-b border-white/12 pb-3 text-white">
                {dict.footer.quick_links}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: dict.nav.home, href: `/${locale}` },
                  { label: dict.nav.services, href: `/${locale}/services` },
                  { label: dict.nav.projects, href: `/${locale}/projects` },
                  { label: dict.nav.about, href: `/${locale}/about` },
                  { label: dict.nav.contact, href: `/${locale}/contact` },
                  { label: dict.privacy.title, href: `/${locale}/privacy` },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="t-body text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {services.length > 0 && (
              <nav
                className="lg:col-span-5"
                aria-label={dict.footer.services_title}
              >
                <h2 className="t-meta border-b border-white/12 pb-3 text-white">
                  {dict.footer.services_title}
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/${locale}/services/${service.slug}`}
                        className="t-body flex items-baseline gap-2.5 text-white/70 transition-colors hover:text-white"
                      >
                        <BrandMark className="h-3.5 w-3.5 opacity-70" />
                        <span>{service.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-white/12 py-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-body text-white/60">
              &copy; {new Date().getFullYear()} {dict.footer.copyright}
            </p>
            {(hasFacebook || hasTelegram) && (
              <div className="flex gap-6">
                {hasFacebook && (
                  <a
                    href={siteConfig.contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-meta flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
                  >
                    Facebook
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                {hasTelegram && (
                  <a
                    href={siteConfig.contact.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-meta flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
                  >
                    Telegram
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
