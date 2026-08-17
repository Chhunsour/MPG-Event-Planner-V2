'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CrewRole } from '@/lib/auth';

type NavItem = {
  label: string;
  href: string;
  roles: CrewRole[];
};

const navItems: NavItem[] = [
  { label: 'Overview', href: '/admin', roles: ['owner', 'admin', 'editor', 'viewer'] },
  { label: 'Services', href: '/admin/services', roles: ['owner', 'admin', 'editor'] },
  { label: 'Projects', href: '/admin/projects', roles: ['owner', 'admin', 'editor'] },
  { label: 'Blog', href: '/admin/blog', roles: ['owner', 'admin', 'editor'] },
  { label: 'Quotes', href: '/admin/quotations', roles: ['owner', 'admin', 'editor', 'viewer'] },
  { label: 'Analytics', href: '/admin/analytics', roles: ['owner', 'admin', 'editor', 'viewer'] },
  { label: 'Settings', href: '/admin/settings', roles: ['owner', 'admin'] },
];

export function AdminNav({ role = 'editor' }: { role?: CrewRole }) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="admin-nav flex items-center gap-1 overflow-x-auto py-2" aria-label="Admin navigation">
      {visibleItems.map((item) => {
        const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`px-3 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap ${
              active
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
