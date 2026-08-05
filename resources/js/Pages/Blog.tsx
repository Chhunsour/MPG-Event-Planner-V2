import { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, Calendar, User, Search, X } from "lucide-react";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiBlogPost, ApiService } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PageHeader from "@/components/layout/PageHeader";

interface BlogProps {
  locale: Locale;
  posts: ApiBlogPost[];
  services: ApiService[];
}

export default function Blog({ locale, posts, services }: BlogProps) {
  const dict = getDictionary(locale);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const post of posts) {
      if (post.category) seen.add(post.category);
    }
    return [...seen].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts;
    if (category !== "all") {
      list = list.filter((post) => post.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          (post.excerpt ?? "").toLowerCase().includes(q) ||
          (post.author_name ?? "").toLowerCase().includes(q) ||
          (post.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, category, search]);

  return (
    <>
      <SeoMeta
        title={dict.blog.metaTitle}
        description={dict.blog.subtitle || undefined}
        locale={locale}
        path="/blog"
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <PageHeader
          label={dict.blog.label}
          titleLine1={dict.blog.headline1}
          titleLine2={dict.blog.headline2}
          lead={dict.blog.subtitle}
          breadcrumbLabel={dict.common.breadcrumb}
          crumbs={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.blog.title },
          ]}
        />

        <section className="band bg-paper">
          <div className="shell">
            {posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="t-heading text-muted">{dict.blog.noPosts}</p>
              </div>
            ) : (
              <>
                {(categories.length > 1 || posts.length > 6) && (
                  <div className="hr mb-10 flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    {categories.length > 1 && (
                      <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
                        <button
                          type="button"
                          onClick={() => setCategory("all")}
                          aria-pressed={category === "all"}
                          className={`t-meta border px-3.5 py-2.5 transition-colors ${
                            category === "all"
                              ? "border-brand bg-brand text-white"
                              : "border-line-strong text-muted hover:border-brand hover:text-brand"
                          }`}
                        >
                          {dict.blog.filterAll ?? "All"}
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            aria-pressed={category === cat}
                            className={`t-meta border px-3.5 py-2.5 transition-colors ${
                              category === cat
                                ? "border-brand bg-brand text-white"
                                : "border-line-strong text-muted hover:border-brand hover:text-brand"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="relative w-full sm:w-64">
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                      />
                      <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={dict.blog.searchPlaceholder ?? "Search articles…"}
                        className="w-full border border-line-strong bg-paper py-2.5 pl-9 pr-9 text-sm text-ink-text placeholder:text-muted focus:border-brand focus:outline-none"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink-text"
                          aria-label="Clear search"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {(search || category !== "all") && filtered.length > 0 && (
                  <p className="t-meta mb-6 text-faint">
                    {filtered.length} {filtered.length === 1 ? "article" : "articles"}
                  </p>
                )}

                {filtered.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="t-heading text-muted">{dict.blog.noPosts}</p>
                  </div>
                ) : (
                  <ScrollReveal stagger>
                  <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post) => {
                  const date = post.published_at
                    ? new Date(post.published_at).toLocaleDateString(
                        locale === "km" ? "km-KH" : locale === "zh" ? "zh-CN" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )
                    : null;

                  return (
                    <li key={post.id}>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="group flex h-full flex-col overflow-hidden border border-line bg-paper transition-all duration-200 hover:border-brand hover:shadow-lg"
                      >
                        <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-alt">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt={post.cover_image_alt || post.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <svg className="h-12 w-12 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5 lg:p-6">
                          <div className="t-meta mb-3 flex flex-wrap items-center gap-3 text-muted">
                            {date && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                                {date}
                              </span>
                            )}
                            {post.author_name && (
                              <span className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" aria-hidden="true" />
                                {post.author_name}
                              </span>
                            )}
                          </div>

                          <h2 className="t-heading mb-2 text-ink-text transition-colors group-hover:text-brand">
                            {post.title}
                          </h2>

                          {post.excerpt && (
                            <p className="t-body mb-4 line-clamp-3 text-muted">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="mt-auto flex items-center gap-2 pt-4">
                            <span className="t-label text-brand">{dict.blog.readMore}</span>
                            <ArrowRight className="h-4 w-4 text-brand transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
                </ul>
                  </ScrollReveal>
                )}
              </>
            )}
          </div>
        </section>
      </AppLayout>
    </>
  );
}
