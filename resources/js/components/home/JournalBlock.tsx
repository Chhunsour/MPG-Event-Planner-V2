import { Link } from "@inertiajs/react";
import { ArrowUpRight, BookOpen } from "lucide-react";
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

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Main Featured Lead Article */}
          <ScrollReveal className="lg:col-span-7">
            <Link
              href={`/${locale}/blog/${lead.slug}`}
              data-pressable
              className="group block"
            >
              {lead.cover_image && (
                <figure className="frame aspect-16/10 w-full overflow-hidden rounded-xl">
                  <img
                    src={lead.cover_image}
                    alt={lead.cover_image_alt || lead.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </figure>
              )}
              <div className="mt-5">
                {leadDate && (
                  <span className="t-meta text-faint">{leadDate}</span>
                )}
                <h3 className="t-display-sm mt-2 max-w-[28ch] text-ink-text transition-colors group-hover:text-brand">
                  {lead.title}
                </h3>
                {lead.excerpt && (
                  <p className="t-body mt-3 max-w-[58ch] text-muted">
                    {lead.excerpt}
                  </p>
                )}
                <span className="t-label mt-5 inline-flex items-center gap-2 text-brand font-semibold">
                  {dict.blog.readMore}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </ScrollReveal>

          {/* Secondary Articles with Image Thumbnails */}
          {rest.length > 0 && (
            <ScrollReveal className="lg:col-span-5" stagger>
              <ul className="space-y-6">
                {rest.map((post) => {
                  const date = formatDate(post.published_at, locale);
                  return (
                    <li key={post.id} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        data-pressable
                        className="group flex items-start gap-4 sm:gap-5"
                      >
                        {post.cover_image && (
                          <figure className="frame aspect-4/3 w-28 shrink-0 overflow-hidden rounded-lg sm:w-36 border border-line">
                            <img
                              src={post.cover_image}
                              alt={post.cover_image_alt || post.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </figure>
                        )}
                        <span className="min-w-0 flex-1">
                          {date && (
                            <span className="t-meta block text-xs text-faint">
                              {date}
                            </span>
                          )}
                          <span className="t-heading mt-1 block text-sm font-bold text-ink-text transition-colors group-hover:text-brand sm:text-base">
                            {post.title}
                          </span>
                          {post.excerpt && (
                            <span className="t-body mt-1.5 block line-clamp-2 text-xs text-muted sm:text-sm">
                              {post.excerpt}
                            </span>
                          )}
                        </span>
                        <ArrowUpRight
                          className="mt-1 h-4 w-4 shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
