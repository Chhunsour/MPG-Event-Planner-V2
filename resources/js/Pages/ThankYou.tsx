import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiService } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import BrandMark from "@/components/layout/BrandMark";

interface ThankYouProps {
  locale: Locale;
  services: ApiService[];
}

export default function ThankYou({ locale, services }: ThankYouProps) {
  const dict = getDictionary(locale);

  return (
    <>
      <SeoMeta
        title={dict.thank_you.title}
        locale={locale}
        path="/thank-you"
        noindex
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <section className="on-dark bg-ink pb-16 pt-29 text-white lg:pb-24 lg:pt-33">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center bg-accent">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </span>
                <span className="t-meta text-white/70">{dict.thank_you.label}</span>
              </p>

              <h1 className="t-display mt-6 text-white">{dict.thank_you.title}</h1>

              <p className="t-lead mt-5 max-w-[52ch] text-white/80">{dict.thank_you.message}</p>

              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link href={`/${locale}`} className="btn btn-onink">
                  {dict.thank_you.action}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href={`/${locale}/projects`} className="link-rule text-white hover:text-white">
                  {dict.thank_you.secondary}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="t-meta border-b border-white/15 pb-3 text-white/50">{dict.thank_you.details_title}</h2>
              <ol>
                {dict.thank_you.steps.map((step) => (
                  <li key={step} className="flex items-baseline gap-5 border-b border-white/15 py-5">
                    <BrandMark className="h-4 w-4" />
                    <span className="t-body text-white/85">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </AppLayout>
    </>
  );
}
