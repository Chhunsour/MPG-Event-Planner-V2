import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';

export function SiteFooter({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  return (
    <footer className="bg-[var(--ink)] text-white">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="t-meta text-[var(--mpg-green-bright)]">MPG / Event Production</p>
          <p className="mt-4 max-w-lg text-2xl font-bold leading-tight">{labels.footer}</p>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/65">Phnom Penh, Cambodia · hello@mpgeventplanner.com</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link href={`/${locale}/contact`} className="btn btn-onink">{labels.getStarted}<ArrowUpRight className="h-4 w-4" /></Link>
          <div className="flex gap-4 text-xs text-white/60">
            <Link href={`/${locale}/privacy`} className="hover:text-white">Privacy</Link>
            <Link href="/admin/login" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
      <div className="shell border-t border-white/15 py-4 text-xs text-white/50">© {new Date().getFullYear()} MPG Event Planner. All rights reserved.</div>
    </footer>
  );
}
