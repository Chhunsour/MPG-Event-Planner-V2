import Link from 'next/link';
import { BreadcrumbsJsonLd } from '@/components/seo/json-ld';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  const jsonLdItems = items.map((item) => ({
    name: item.label,
    url: item.href,
  }));

  return (
    <>
      <BreadcrumbsJsonLd items={jsonLdItems} />
      <nav aria-label="Breadcrumb navigation" className="py-3 px-4 bg-slate-900/40 text-slate-300 text-xs border-b border-white/10">
        <div className="shell flex items-center gap-2 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <span key={item.href} className="flex items-center gap-2">
                {index > 0 && <span className="text-slate-500 font-mono">/</span>}
                {isLast ? (
                  <span className="text-white font-medium truncate max-w-[240px] sm:max-w-md" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
      </nav>
    </>
  );
}
