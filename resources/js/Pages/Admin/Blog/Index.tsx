import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Edit, Copy, Archive, RotateCcw } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import LanguageTrack from "@/components/admin/LanguageTrack";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";

interface BlogPost {
  id: number;
  title_en: string;
  title_km: string | null;
  title_zh: string | null;
  slug: string;
  excerpt_en: string | null;
  category: string | null;
  author_name: string | null;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  deleted_at: string | null;
  updated_at: string | null;
}

interface BlogIndexProps {
  posts: {
    data: BlogPost[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
  };
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

export default function BlogIndex({ posts, status }: BlogIndexProps) {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(params.get("status") ?? "");
  const [langFilter, setLangFilter] = useState(params.get("language") ?? "");
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("publish");

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected((prev) => prev.length === posts.data.length ? [] : posts.data.map((p) => p.id));
  };

  const handleBulk = () => {
    if (selected.length === 0) return;
    router.post("/admin/blog/bulk", { ids: selected, action: bulkAction }, { preserveScroll: true });
  };

  const hasFilters = q || statusFilter || langFilter;

  return (
    <AdminLayout
      title="Blog posts"
      actions={
        <Link href="/admin/blog/create" className="bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-deep">
          New post
        </Link>
      }
    >
      {/* Filters */}
      <div className="mb-4 border border-line bg-paper p-4">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-50">
            <input type="text" name="q" value={q} placeholder="Search title, excerpt, category"
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
          <button type="submit" className="border border-line-strong px-4 py-2 text-xs font-semibold text-muted hover:bg-paper-tint">Filter</button>
          {hasFilters && <Link href="/admin/blog" className="text-xs font-semibold text-brand hover:text-brand-deep">Clear</Link>}
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
        {posts.data.length === 0 ? (
          <EmptyState
            mark="POST"
            title={status === "archived" ? "No archived posts" : "No posts found"}
            description={hasFilters ? "Try a different filter or write a new post." : "Write the first post to share your expertise."}
            action={<Link href="/admin/blog/create" className="bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-deep">New post</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-tint text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selected.length === posts.data.length && posts.data.length > 0}
                      onChange={toggleAll} aria-label="Select all posts"
                      className="h-4 w-4 rounded border-line-strong text-brand" />
                  </th>
                  <th className="px-4 py-3">Post</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Languages</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.data.map((post) => {
                  const postStatus = post.deleted_at ? "archived"
                    : (post.is_published && post.published_at && new Date(post.published_at) > new Date() ? "scheduled"
                      : (post.is_published ? "published" : "draft"));
                  return (
                    <tr key={post.id} className="border-b border-line last:border-0 hover:bg-paper-tint">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(post.id)}
                          onChange={() => toggleSelect(post.id)} aria-label={`Select ${post.title_en}`}
                          className="h-4 w-4 rounded border-line-strong text-brand" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ImageCell src={post.cover_image} alt="" fallbackLetter="B" />
                          <div>
                            <strong className="block text-ink-text">{post.title_en}</strong>
                            <span className="text-xs text-faint">/{post.slug}{post.author_name && ` · ${post.author_name}`}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{post.category ?? "—"}</td>
                      <td className="px-4 py-3">
                        <LanguageTrack en={post.title_en} km={post.title_km} zh={post.title_zh} />
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={postStatus} /></td>
                      <td className="px-4 py-3 text-xs text-faint">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {!post.deleted_at ? (
                            <>
                              <Link href={`/admin/blog/${post.id}/edit`} className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-brand">
                                <Edit className="h-3.5 w-3.5" /> Edit
                              </Link>
                              <form method="POST" action={`/admin/blog/${post.id}/publish`}>
                                <input type="hidden" name="is_published" value={post.is_published ? "0" : "1"} />
                                <button type="submit" className="text-xs font-semibold text-muted hover:text-slate-800">
                                  {post.is_published ? "Unpublish" : "Publish"}
                                </button>
                              </form>
                              <form method="POST" action={`/admin/blog/${post.id}`} onSubmit={(e) => { if (!confirm(`Archive ${post.title_en}?`)) e.preventDefault(); }}>
                                <input type="hidden" name="_method" value="DELETE" />
                                <button type="submit" className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600">
                                  <Archive className="h-3.5 w-3.5" /> Archive
                                </button>
                              </form>
                            </>
                          ) : (
                            <form method="POST" action={`/admin/blog/${post.id}/restore`}>
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

      <Pagination links={posts.links} />
    </AdminLayout>
  );
}
