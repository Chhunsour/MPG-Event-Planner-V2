import { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { Locale } from "@/config/site";
import type { ApiProject } from "@/lib/types";

interface WorkGridProps {
  locale: Locale;
  projects?: ApiProject[];
  category?: string;
  dict: {
    filter_all?: string;
    scope: string;
    filterLabel?: string;
    searchPlaceholder?: string;
    empty: string;
    filter_grand_opening?: string;
    filter_corporate?: string;
    filter_launch?: string;
    filter_exhibitions?: string;
    filter_rental?: string;
    items?: Record<string, { title: string; scope: string }>;
  };
  filterable?: boolean;
  limit?: number;
}

const LAYOUT: { span: string; aspect: string }[] = [
  { span: "lg:col-span-7", aspect: "aspect-[4/3] lg:aspect-[16/10]" },
  { span: "lg:col-span-5", aspect: "aspect-[4/3] lg:aspect-[9/8]" },
  { span: "lg:col-span-5", aspect: "aspect-[4/3] lg:aspect-[9/8]" },
  { span: "lg:col-span-7", aspect: "aspect-[4/3] lg:aspect-[16/10]" },
  { span: "lg:col-span-12", aspect: "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]" },
  { span: "lg:col-span-4", aspect: "aspect-[4/3]" },
  { span: "lg:col-span-4", aspect: "aspect-[4/3]" },
  { span: "lg:col-span-4", aspect: "aspect-[4/3]" },
];

export default function WorkGrid({
  locale,
  projects,
  category,
  dict,
  filterable = false,
  limit,
}: WorkGridProps) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const allProjects = useMemo(() => projects ?? [], [projects]);

  const filters = useMemo(() => {
    const seen = new Map<string, string>();
    for (const project of allProjects) {
      if (project.service) seen.set(project.service.slug, project.service.title);
    }
    return [...seen.entries()].map(([slug, title]) => ({ slug, title }));
  }, [allProjects]);

  const visible = useMemo(() => {
    let list = allProjects;
    if (category) {
      list = list.filter(
        (project) =>
          project.event_type === category ||
          project.service?.slug === category ||
          project.service?.slug?.replace("-", "_") === category
      );
    } else if (filterable && filter !== "all") {
      list = list.filter((project) => project.service?.slug === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (project) =>
          project.title.toLowerCase().includes(q) ||
          (project.short_description ?? "").toLowerCase().includes(q) ||
          (project.client_name ?? "").toLowerCase().includes(q) ||
          (project.location ?? "").toLowerCase().includes(q) ||
          (project.event_type ?? "").toLowerCase().includes(q) ||
          (project.service?.title ?? "").toLowerCase().includes(q)
      );
    }
    if (limit && limit > 0) {
      list = list.slice(0, limit);
    }
    return list;
  }, [allProjects, category, filterable, filter, search, limit]);

  if (allProjects.length === 0) {
    return <p className="t-lead py-8 text-muted">{dict.empty}</p>;
  }

  return (
    <div>
      {filterable && (
        <div className="hr mb-10 flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={dict.filterLabel}
          >
            {[{ slug: "all", title: dict.filter_all ?? "All Work" }, ...filters].map(
              (item) => {
                const active = filter === item.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setFilter(item.slug)}
                    aria-pressed={active}
                    className={`t-meta border px-3.5 py-2.5 transition-colors ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-line-strong text-muted hover:border-brand hover:text-brand"
                    }`}
                  >
                    {item.title}
                  </button>
                );
              },
            )}
          </div>

          {filters.length > 1 && (
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={dict.searchPlaceholder ?? "Search projects…"}
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
          )}
        </div>
      )}

      {(search || (filterable && filter !== "all")) && visible.length > 0 && (
        <p className="t-meta mb-6 text-faint">
          {visible.length} {visible.length === 1 ? "result" : "results"}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="t-lead py-10 text-muted">{dict.empty}</p>
      ) : (
        /* 2-Column Mobile Grid for Projects Showcase */
        <ul className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-12">
          {visible.map((project, index) => {
            const layout = LAYOUT[index % LAYOUT.length];
            const scope = project.short_description || project.description;

            return (
              <li key={project.id} className={layout.span}>
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  data-pressable
                  className="group block transition-transform duration-200"
                >
                  <figure className={`frame ${layout.aspect} w-full rounded-lg overflow-hidden`}>
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={project.cover_image_alt ?? project.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="sr-only">{project.title}</span>
                    )}
                    <div className="scrim-b absolute inset-0" />
                    <figcaption className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-5 lg:p-6">
                      {project.service?.title && (
                        <p className="t-meta mb-1 text-[10px] font-bold uppercase tracking-wider text-accent-bright sm:mb-2 sm:text-xs">
                          {project.service.title}
                        </p>
                      )}
                      <p className="t-heading flex items-start gap-1.5 text-xs font-bold text-white sm:text-base lg:text-lg">
                        <span className="line-clamp-1">{project.title}</span>
                        <ArrowUpRight
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4 lg:opacity-0 lg:group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </p>
                      {scope && (
                        <div
                          className="t-meta mt-1 line-clamp-1 text-[11px] text-white/80 sm:mt-2 sm:line-clamp-2 sm:text-xs [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline"
                          dangerouslySetInnerHTML={{ __html: scope }}
                        />
                      )}
                    </figcaption>
                  </figure>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
