import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Edit, Copy, Archive, RotateCcw, ExternalLink, Search, X } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import LanguageTrack from "@/components/admin/LanguageTrack";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";

interface Service {
  id: number;
  title_en: string;
  title_km: string | null;
  title_zh: string | null;
  slug: string;
  category: string | null;
  image: string | null;
  image_alt: string | null;
  is_published: boolean;
  published_at: string | null;
  deleted_at: string | null;
  updated_at: string | null;
  projects_count: number;
}

interface ServicesIndexProps {
  services: {
    data: Service[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
  };
  status: string;
}

export default function ServicesIndex({ services, status }: ServicesIndexProps) {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(params.get("status") ?? "");
  const [langFilter, setLangFilter] = useState(params.get("language") ?? "");
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("publish");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected((prev) => prev.length === services.data.length ? [] : services.data.map((s) => s.id));
  };

  const handleBulk = () => {
    if (selected.length === 0) return;
    router.post("/admin/services/bulk", { ids: selected, action: bulkAction }, { preserveScroll: true });
  };

  const hasFilters = q || statusFilter || langFilter;

  const applyFilters = useCallback((overrides: Record<string, string> = {}) => {
    const next = { q, status: statusFilter, language: langFilter, ...overrides };
    const query: Record<string, string> = {};
    if (next.q) query.q = next.q;
    if (next.status) query.status = next.status;
    if (next.language) query.language = next.language;
    router.visit("/admin/services", {
      data: query,
      preserveScroll: true,
      preserveState: true,
      only: ["services", "status"],
    });
  }, [q, statusFilter, langFilter]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, statusFilter, langFilter, applyFilters]);

  return (
    <AdminLayout
      title="Services"
      actions={
        <Link href="/admin/services/create" className="bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-deep">
          New service
        </Link>
      }
    >
      {/* Intro */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Content library</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-text">Services</h2>
          <p className="mt-1 text-sm text-muted">Keep the services page clear, current, and easy to translate.</p>
        </div>
        <div className="text-right">
          <strong className="text-2xl font-bold text-ink-text">{services.total}</strong>
          <span className="ml-1 text-xs text-faint">matching services</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 border border-line bg-paper p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative flex-1 min-w-50">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden="true" />
            <label htmlFor="q" className="sr-only">Search services</label>
            <input id="q" type="text" value={q} placeholder="Search title or category…"
              onChange={(e) => setQ(e.target.value)}
              className="w-full border border-line-strong py-2 pl-9 pr-9 text-sm text-ink-text outline-none focus:border-brand" />
            {q && (
              <button type="button" onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-ink-text" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="min-w-35">
            <label htmlFor="status" className="sr-only">Status</label>
            <select id="status" value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none border border-line-strong bg-paper px-3 py-2 pr-8 text-sm text-ink-text outline-none focus:border-brand">
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="min-w-35">
            <label htmlFor="language" className="sr-only">Language</label>
            <select id="language" value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full appearance-none border border-line-strong bg-paper px-3 py-2 pr-8 text-sm text-ink-text outline-none focus:border-brand">
              <option value="">Any language</option>
              <option value="en">English source</option>
              <option value="km">Khmer ready</option>
              <option value="zh">Chinese ready</option>
            </select>
          </div>
          {hasFilters && (
            <button type="button" onClick={() => { setQ(""); setStatusFilter(""); setLangFilter(""); }}
              className="text-xs font-semibold text-brand hover:text-brand-deep">Clear</button>
          )}
        </div>
        <p className="mt-2 text-[11px] text-faint">Results update as you type.</p>
      </div>

      {/* Bulk bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted">{selected.length} selected</span>
        <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}
          className="appearance-none border border-line-strong bg-paper px-3 py-1.5 text-xs text-muted outline-none focus:border-brand">
          <option value="publish">Publish</option>
          <option value="draft">Move to draft</option>
          <option value="archive">Archive</option>
          {status === "archived" && <option value="restore">Restore</option>}
        </select>
        <button type="button" onClick={handleBulk} disabled={selected.length === 0}
          className="border border-line-strong px-3 py-1.5 text-xs font-semibold text-muted hover:bg-paper-tint disabled:opacity-50">
          Apply
        </button>
        <span className="text-[11px] text-faint">Drafts and archived services stay off the public website.</span>
      </div>

      {/* Table */}
      <div className="border border-line bg-paper">
        {services.data.length === 0 ? (
          <EmptyState
            mark="SVC"
            title={status === "archived" ? "No archived services" : "No services found"}
            description={hasFilters ? "Try a different filter or create a new service." : "Create the first service to give clients a clear way into your work."}
            action={<Link href="/admin/services/create" className="bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-deep">New service</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-tint text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selected.length === services.data.length && services.data.length > 0}
                      onChange={toggleAll} aria-label="Select all services"
                      className="h-4 w-4 rounded border-line-strong text-brand" />
                  </th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Languages</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.data.map((service) => {
                  const serviceStatus = service.deleted_at ? "archived"
                    : (service.is_published && service.published_at && new Date(service.published_at) > new Date() ? "scheduled"
                      : (service.is_published ? "published" : "draft"));
                  return (
                    <tr key={service.id} className="border-b border-line last:border-0 hover:bg-paper-tint">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(service.id)}
                          onChange={() => toggleSelect(service.id)} aria-label={`Select ${service.title_en}`}
                          className="h-4 w-4 rounded border-line-strong text-brand" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {service.image ? (
                            <img src={`/storage/${service.image}`} alt={service.image_alt ?? ""}
                              className="h-10 w-10 shrink-0 object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-paper-tint text-xs font-bold text-faint">S</div>
                          )}
                          <div>
                            <strong className="block text-ink-text">{service.title_en}</strong>
                            <span className="text-xs text-faint">/{service.slug} · {service.projects_count} projects</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{service.category ?? "—"}</td>
                      <td className="px-4 py-3">
                        <LanguageTrack en={service.title_en} km={service.title_km} zh={service.title_zh} />
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={serviceStatus} /></td>
                      <td className="px-4 py-3 text-xs text-faint">
                        {service.updated_at ? new Date(service.updated_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {!service.deleted_at ? (
                            <>
                              <Link href={`/admin/services/${service.id}/edit`} className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-brand">
                                <Edit className="h-3.5 w-3.5" /> Edit
                              </Link>
                              <button type="button" onClick={() => router.post(`/admin/services/${service.id}/duplicate`, {}, { preserveScroll: true })}
                                className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-brand">
                                <Copy className="h-3.5 w-3.5" /> Duplicate
                              </button>
                              {service.is_published && (
                                <Link href={`/en/services/${service.slug}`} className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-brand">
                                  <ExternalLink className="h-3.5 w-3.5" /> View
                                </Link>
                              )}
                              <button type="button" onClick={() => router.post(`/admin/services/${service.id}/publish`, { is_published: service.is_published ? 0 : 1 }, { preserveScroll: true })}
                                className={`flex items-center gap-1 text-xs font-semibold ${service.is_published ? "text-muted hover:text-ink-text" : "text-accent hover:text-accent-deep"}`}>
                                {service.is_published ? "Unpublish" : "Publish"}
                              </button>
                              <button type="button" onClick={() => { if (confirm(`Archive ${service.title_en}? It will disappear from the website but can be restored.`)) router.delete(`/admin/services/${service.id}`, { preserveScroll: true }); }}
                                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600">
                                <Archive className="h-3.5 w-3.5" /> Archive
                              </button>
                            </>
                          ) : (
                            <button type="button" onClick={() => router.post(`/admin/services/${service.id}/restore`, {}, { preserveScroll: true })}
                              className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-deep">
                              <RotateCcw className="h-3.5 w-3.5" /> Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination links={services.links} />
    </AdminLayout>
  );
}
