import { Link } from "@inertiajs/react";

interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLinks[];
}

export default function Pagination({ links }: PaginationProps) {
  if (links.length <= 1) return null;

  return (
    <nav className="mt-6 flex items-center gap-1" aria-label="Pagination">
      {links.map((link, i) => {
        if (!link.url) {
          return (
            <span
              key={i}
              className="px-3 py-1.5 text-xs text-faint"
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        }
        return (
          <Link
            key={i}
            href={link.url}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              link.active
                ? "bg-brand text-white"
                : "border border-line text-muted hover:border-line-strong hover:bg-paper-tint"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        );
      })}
    </nav>
  );
}
