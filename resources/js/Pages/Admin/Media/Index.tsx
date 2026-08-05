import { Link } from "@inertiajs/react";
import { Copy } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import EmptyState from "@/components/admin/EmptyState";
import { useToast } from "@/components/ui/Toast";

interface MediaAsset {
  url: string;
  path: string;
  size: number;
}

interface MediaIndexProps {
  media: MediaAsset[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export default function MediaIndex({ media, total, page, perPage, hasMore }: MediaIndexProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const { toast } = useToast();

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("Image URL copied to clipboard.", "info");
  };

  return (
    <AdminLayout
      title="Media"
      actions={
        <Link href="/admin/services/create" className="bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-deep">
          Upload from an editor
        </Link>
      }
    >
      {/* Intro */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Asset library</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-text">Media</h2>
          <p className="mt-1 text-sm text-muted">Images uploaded through content editors. Files remain available while content is archived or duplicated.</p>
        </div>
        <div className="text-right">
          <strong className="text-2xl font-bold text-ink-text">{total}</strong>
          <span className="ml-1 text-xs text-faint">stored images</span>
        </div>
      </div>

      {media.length === 0 ? (
        <EmptyState
          mark="IMG"
          title="No media yet"
          description="Upload a featured image, gallery image, or inline image from any editor."
          action={
            <Link href="/admin/services/create" className="bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-deep">
              Create content
            </Link>
          }
        />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-label="Stored images">
            {media.map((asset, i) => (
              <figure key={i} className="group relative overflow-hidden border border-line bg-paper">
                <img
                  src={asset.url}
                  alt={asset.path.split("/").pop() ?? ""}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset.url)}
                  className="absolute right-2 top-2 hidden items-center gap-1 rounded bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-xs transition-opacity hover:bg-black group-hover:flex"
                  title="Copy URL"
                >
                  <Copy className="h-3 w-3" /> Copy URL
                </button>
                <figcaption className="p-2">
                  <strong className="block truncate text-[11px] font-semibold text-muted">
                    {asset.path.split("/").pop()}
                  </strong>
                  <span className="text-[10px] text-faint">
                    {Math.round(asset.size / 1024)} KB · {asset.path.split("/").slice(0, -1).join("/")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </section>

          <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Media pages">
            {page > 1 && (
              <Link href={`/admin/media?page=${page - 1}`} className="border border-line-strong px-3 py-1.5 text-xs font-semibold text-muted hover:bg-paper-tint">
                Previous
              </Link>
            )}
            <span className="text-xs text-muted">Page {page} of {totalPages}</span>
            {hasMore && (
              <Link href={`/admin/media?page=${page + 1}`} className="border border-line-strong px-3 py-1.5 text-xs font-semibold text-muted hover:bg-paper-tint">
                Next
              </Link>
            )}
          </nav>
        </>
      )}
    </AdminLayout>
  );
}
