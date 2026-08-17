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
    <nav className="flex items-center gap-1 p-1 bg-slate-100/85 border border-slate-200/80 rounded-xl overflow-x-auto scrollbar-none" aria-label="Admin navigation">
      {visibleItems.map((item) => {
        const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all whitespace-nowrap ${
              active
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/90 ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <span>{item.label}</span>
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse" aria-hidden="true" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
