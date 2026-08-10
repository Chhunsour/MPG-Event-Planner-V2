import Link from 'next/link';
import { ArrowUpRight, Menu } from 'lucide-react';
import { localeLabels, type Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';

export function SiteHeader({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const links = [
    [labels.about, 'about'],
    [labels.services, 'services'],
    [labels.projects, 'projects'],
    [labels.journal, 'blog'],
  ] as const;

  return (
    <header className="border-b border-[var(--line)] bg-white">
      <div className="shell flex min-h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-3" aria-label="MPG Event Planner">
          <span className="grid h-10 w-10 place-items-center bg-[var(--mpg-blue)] text-sm font-bold tracking-[-0.08em] text-white">MPG</span>
          <span className="hidden text-sm font-bold uppercase tracking-[0.16em] text-[var(--text)] sm:block">Event Planner</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={`/${locale}/${href}`} className="text-sm text-[var(--text-muted)] transition hover:text-[var(--mpg-blue)]">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 text-xs uppercase tracking-[0.12em] sm:flex">
            {(['en', 'km', 'zh'] as Locale[]).map((code) => (
              <Link key={code} href={`/${code}`} className={`px-2 py-1 ${code === locale ? 'bg-[var(--mpg-blue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--mpg-blue)]'}`} title={localeLabels[code]}>{code}</Link>
            ))}
          </div>
          <Link href={`/${locale}/contact`} className="btn btn-primary hidden sm:inline-flex">{labels.enquire}<ArrowUpRight className="h-4 w-4" /></Link>
          <details className="relative md:hidden">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center border border-[var(--line-strong)]" aria-label="Open menu"><Menu className="h-5 w-5" /></summary>
            <div className="absolute right-0 top-12 z-20 grid min-w-48 gap-1 border border-[var(--line-strong)] bg-white p-3 shadow-xl">
              {links.map(([label, href]) => <Link key={href} href={`/${locale}/${href}`} className="px-3 py-2 text-sm hover:bg-[var(--paper-tint)]">{label}</Link>)}
              <Link href={`/${locale}/contact`} className="mt-2 bg-[var(--mpg-blue)] px-3 py-2 text-sm font-semibold text-white">{labels.enquire}</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
