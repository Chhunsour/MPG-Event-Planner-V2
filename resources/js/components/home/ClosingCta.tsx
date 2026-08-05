import { Link } from "@inertiajs/react";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { isPlaceholder, siteConfig, type Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ClosingCta({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const hasPhone = !isPlaceholder(siteConfig.contact.phone);
  const hasEmail = !isPlaceholder(siteConfig.contact.email);

  return (
    <section className="closing-brief band text-ink-text">
      <div className="shell">
        <ScrollReveal className="closing-brief__frame grid lg:grid-cols-12" stagger>
          <div className="py-10 lg:col-span-7 lg:py-14 lg:pr-14">
            <div className="flex items-center gap-4">
              <span className="t-num text-[0.6875rem] tracking-[0.08em] text-accent">
                09
              </span>
              <span className="sec-head__tick" aria-hidden="true" />
              <p className="t-meta text-muted">{dict.cta.label}</p>
            </div>
            <h2 className="t-display-lg mt-7 max-w-[15ch] text-ink-text">
              {dict.cta.titleLine1}
              <br />
              {dict.cta.titleLine2}
            </h2>
            <p className="t-lead mt-5 max-w-[52ch] text-muted">
              {dict.cta.subtitle}
            </p>
          </div>

          <div className="closing-brief__action flex flex-col justify-center gap-7 p-7 sm:p-9 lg:col-span-5 lg:p-12">
            <Link
              href={`/${locale}/contact`}
              className="btn btn-primary btn-lg w-full"
            >
              {dict.cta.quote_cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            {(hasPhone || hasEmail) && (
              <div className="grid gap-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-1">
                {hasPhone && (
                  <div className="flex items-start gap-3">
                    <Phone
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="t-meta text-muted">
                        {dict.footer.phone_label}
                      </p>
                      <a
                        href={`tel:${siteConfig.contact.phone}`}
                        className="t-heading mt-1 block text-ink-text transition-colors hover:text-brand"
                      >
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    </div>
                  </div>
                )}

                {hasEmail && (
                  <div className="flex items-start gap-3">
                    <Mail
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="t-meta text-muted">
                        {dict.footer.email_label}
                      </p>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="t-body mt-1 block break-all text-ink-text transition-colors hover:text-brand"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
