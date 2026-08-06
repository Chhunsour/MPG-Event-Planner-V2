import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Edit, Copy, Archive, RotateCcw, Star } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import LanguageTrack from "@/components/admin/LanguageTrack";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";

interface Project {
  id: number;
  title_en: string;
  title_km: string | null;
  title_zh: string | null;
  slug: string;
  client_name: string | null;
  location: string | null;
  category: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  deleted_at: string | null;
  updated_at: string | null;
  year: number | null;
  images_count: number;
  service: { id: number; title_en: string } | null;
}

interface ServiceOption {
  id: number;
  title_en: string;
}

interface ProjectsIndexProps {
  projects: {
    data: Project[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
  };
  services: ServiceOption[];
  years: number[];
  status: string;
}

function ImageCell({ src, alt, fallbackLetter }: { src: string | null; alt: string; fallbackLetter: string }) {
  const [error, setError] = useState(false);
  const imageUrl = src ? (src.startsWith("/") || src.startsWith("http") ? src : `/storage/${src}`) : null;

  if (!imageUrl || error) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-paper-tint text-xs font-bold text-faint">
        {fallbackLetter}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={() => setError(true)}
      className="h-10 w-10 shrink-0 rounded border border-line object-cover"
    />
  );
}

export default function ProjectsIndex({ projects, services, years, status }: ProjectsIndexProps) {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(params.get("status") ?? "");
  const [langFilter, setLangFilter] = useState(params.get("language") ?? "");
  const [serviceFilter, setServiceFilter] = useState(params.get("service") ?? "");
  const [yearFilter, setYearFilter] = useState(params.get("year") ?? "");
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("publish");

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected((prev) => prev.length === projects.data.length ? [] : projects.data.map((p) => p.id));
  };

  const handleBulk = () => {
    if (selected.length === 0) return;
    router.post("/admin/projects/bulk", { ids: selected, action: bulkAction }, { preserveScroll: true });
  };

  const hasFilters = q || statusFilter || langFilter || serviceFilter || yearFilter;

  return (
    <AdminLayout
      title="Projects"
      actions={
        <Link href="/admin/projects/create" className="bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-deep">
          New project
        </Link>
      }
    >
      {/* Filters */}
      <div className="mb-4 border border-line bg-paper p-4">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-50">
            <label htmlFor="q" className="sr-only">Search projects</label>
            <input id="q" name="q" type="text" value={q} placeholder="Search title, client, location"
              onChange={(e) => setQ(e.target.value)}
              className="w-full border border-line-strong px-3 py-2 text-sm text-ink-text outline-none focus:border-brand" />
          </div>
          <div className="min-w-35">
            <select name="status" value={statusFilter}
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
            <select name="language" value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full appearance-none border border-line-strong bg-paper px-3 py-2 pr-8 text-sm text-ink-text outline-none focus:border-brand">
              <option value="">Any language</option>
              <option value="km">Khmer ready</option>
              <option value="zh">Chinese ready</option>
            </select>
          </div>
          <div className="min-w-40">
            <select name="service" value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full appearance-none border border-line-strong bg-paper px-3 py-2 pr-8 text-sm text-ink-text outline-none focus:border-brand">
              <option value="">All services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.title_en}</option>
              ))}
            </select>
          </div>
          {years.length > 0 && (
            <div className="min-w-25">
              <select name="year" value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full appearance-none border border-line-strong bg-paper px-3 py-2 pr-8 text-sm text-ink-text outline-none focus:border-brand">
                <option value="">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
          <button type="submit" className="border border-line-strong px-4 py-2 text-xs font-semibold text-muted hover:bg-paper-tint">Filter</button>
          {hasFilters && (
            <Link href="/admin/projects" className="text-xs font-semibold text-brand hover:text-brand-deep">Clear</Link>
          )}
        </form>
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
      </div>

      {/* Table */}
      <div className="border border-line bg-paper">
        {projects.data.length === 0 ? (
          <EmptyState
            mark="PRJ"
            title={status === "archived" ? "No archived projects" : "No projects found"}
            description={hasFilters ? "Try a different filter or create a new project." : "Create the first project to showcase your work."}
            action={<Link href="/admin/projects/create" className="bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-deep">New project</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-tint text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selected.length === projects.data.length && projects.data.length > 0}
                      onChange={toggleAll} aria-label="Select all projects"
                      className="h-4 w-4 rounded border-line-strong text-brand" />
                  </th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Languages</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.data.map((project) => {
                  const projectStatus = project.deleted_at ? "archived"
                    : (project.is_published && project.published_at && new Date(project.published_at) > new Date() ? "scheduled"
                      : (project.is_published ? "published" : "draft"));
                  return (
                    <tr key={project.id} className="border-b border-line last:border-0 hover:bg-paper-tint">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(project.id)}
                          onChange={() => toggleSelect(project.id)} aria-label={`Select ${project.title_en}`}
                          className="h-4 w-4 rounded border-line-strong text-brand" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ImageCell src={project.cover_image} alt={project.cover_image_alt ?? ""} fallbackLetter="P" />
                          <div>
                            <strong className="flex items-center gap-1 text-ink-text">
                              {project.title_en}
                              {project.is_featured && <Star className="h-3 w-3 fill-accent-bright text-accent-bright" />}
                            </strong>
                            <span className="text-xs text-faint">
                              /{project.slug}
                              {project.client_name && ` · ${project.client_name}`}
                              {project.location && ` · ${project.location}`}
                              {project.year && ` · ${project.year}`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{project.service?.title_en ?? "—"}</td>
                      <td className="px-4 py-3">
                        <LanguageTrack en={project.title_en} km={project.title_km} zh={project.title_zh} />
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={projectStatus} /></td>
                      <td className="px-4 py-3 text-xs text-faint">
                        {project.updated_at ? new Date(project.updated_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {!project.deleted_at ? (
                            <>
                              <Link href={`/admin/projects/${project.id}/edit`} className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-brand">
                                <Edit className="h-3.5 w-3.5" /> Edit
                              </Link>
                              <form method="POST" action={`/admin/projects/${project.id}/publish`}>
                                <input type="hidden" name="is_published" value={project.is_published ? "0" : "1"} />
                                <button type="submit" className="text-xs font-semibold text-muted hover:text-slate-800">
                                  {project.is_published ? "Unpublish" : "Publish"}
                                </button>
                              </form>
                              <form method="POST" action={`/admin/projects/${project.id}`} onSubmit={(e) => { if (!confirm(`Archive ${project.title_en}?`)) e.preventDefault(); }}>
                                <input type="hidden" name="_method" value="DELETE" />
                                <button type="submit" className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600">
                                  <Archive className="h-3.5 w-3.5" /> Archive
                                </button>
                              </form>
                            </>
                          ) : (
                            <form method="POST" action={`/admin/projects/${project.id}/restore`}>
                              <button type="submit" className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-deep">
                                <RotateCcw className="h-3.5 w-3.5" /> Restore
                              </button>
                            </form>
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

      <Pagination links={projects.links} />
    </AdminLayout>
  );
}
