import { Link } from "@inertiajs/react";
import { ArrowUpRight, BookOpen, Clock, Calendar } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import type { ApiBlogPost } from "@/lib/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHead from "@/components/home/SectionHead";

const DATE_LOCALE: Record<Locale, string> = {
  en: "en-US",
  km: "km-KH",
  zh: "zh-CN",
};

function formatDate(value: string | null, locale: Locale) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(DATE_LOCALE[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function JournalBlock({
  locale,
  dict,
  posts,
}: {
  locale: Locale;
  dict: Dictionary;
  posts: ApiBlogPost[];
}) {
  const [lead, ...rest] = posts;
  if (!lead) return null;

  const leadDate = formatDate(lead.published_at, locale);

  return (
    <section className="band bg-paper-tint">
      <div className="shell">
        <ScrollReveal>
          <SectionHead
            icon={BookOpen}
            label={dict.blog.label}
            title={`${dict.blog.headline1} ${dict.blog.headline2}`}
            variant="inline"
            action={
              <Link href={`/${locale}/blog`} className="link-rule text-brand">
                {dict.blog.title}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </ScrollReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Main Featured Lead Article Card */}
          <ScrollReveal className="lg:col-span-7">
            <Link
              href={`/${locale}/blog/${lead.slug}`}
              data-pressable
              className="group block overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:border-brand/40 hover:shadow-xl sm:p-6"
            >
              {lead.cover_image && (
                <figure className="frame aspect-16/10 w-full overflow-hidden rounded-xl">
                  <img
                    src={lead.cover_image}
                    alt={lead.cover_image_alt || lead.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="scrim-b absolute inset-0" />
                  <span className="absolute top-4 left-4 z-10 rounded-full border border-white/20 bg-ink/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    Featured Insight
                  </span>
                </figure>
              )}
              <div className="mt-6">
                {leadDate && (
                  <div className="flex items-center gap-2 text-xs font-medium text-faint">
                    <Calendar className="h-3.5 w-3.5 text-brand" />
                    <span>{leadDate}</span>
                  </div>
                )}
                <h3 className="t-display-sm mt-2.5 text-ink-text transition-colors group-hover:text-brand">
                  {lead.title}
                </h3>
                {lead.excerpt && (
                  <p className="t-body mt-3 text-muted line-clamp-3">
                    {lead.excerpt}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-brand">
                  <span>{dict.blog.readMore}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Secondary Cards Column */}
          {rest.length > 0 && (
            <ScrollReveal className="flex flex-col gap-5 lg:col-span-5" stagger>
              {rest.map((post) => {
                const date = formatDate(post.published_at, locale);
                return (
                  <Link
                    key={post.id}
                    href={`/${locale}/blog/${post.slug}`}
                    data-pressable
                    className="group flex flex-col justify-between rounded-xl border border-line bg-paper p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md sm:flex-row sm:items-start sm:gap-5"
                  >
                    {post.cover_image && (
                      <figure className="frame aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg sm:w-36 border border-line">
                        <img
                          src={post.cover_image}
                          alt={post.cover_image_alt || post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </figure>
                    )}
                    <span className="mt-3 min-w-0 flex-1 sm:mt-0">
                      {date && (
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-faint">
                          <Clock className="h-3 w-3 text-brand" />
                          <span>{date}</span>
                        </span>
                      )}
                      <span className="t-heading mt-1.5 block text-sm font-bold text-ink-text transition-colors group-hover:text-brand sm:text-base">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <span className="t-body mt-1.5 block line-clamp-2 text-xs text-muted">
                          {post.excerpt}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      className="hidden sm:block mt-1 h-4 w-4 shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
