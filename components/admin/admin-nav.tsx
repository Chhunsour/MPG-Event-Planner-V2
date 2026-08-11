'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['Overview', '/admin'],
  ['Services', '/admin/services'],
  ['Projects', '/admin/projects'],
  ['Blog', '/admin/blog'],
  ['Quotes', '/admin/quotations'],
  ['Alerts', '/admin/announcements'],
  ['Media', '/admin/media'],
  ['Settings', '/admin/settings'],
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {links.map(([label, href]) => {
        const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} aria-current={active ? 'page' : undefined}>{label}</Link>;
      })}
    </nav>
  );
}
