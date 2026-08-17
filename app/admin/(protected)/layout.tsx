import Image from 'next/image';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { requireCrewRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireCrewRole(['owner', 'admin', 'editor', 'viewer']);
  const supabase = await createClient();
  const { count: newQuotesCount } = await supabase
    .from('quotations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="shell admin-header__row">
          <Link href="/admin" className="admin-brand flex-shrink-0" aria-label="MPG admin dashboard">
            <Image src="/images/mpg-logo.png" alt="MPG Event Planner" width={140} height={46} priority />
            <span>Admin</span>
          </Link>

          <div className="flex-1 flex justify-center px-4 min-w-0">
            <AdminNav role={profile.role} />
          </div>

          <div className="admin-account flex-shrink-0">
            <Link
              href="/admin/quotations"
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-colors mr-1"
              title={newQuotesCount ? `${newQuotesCount} new quotation requests` : 'No unread notifications'}
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {Boolean(newQuotesCount) && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                  {newQuotesCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin/settings"
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 border border-transparent hover:border-slate-200/80"
              title="Manage account & settings"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[170px]">{profile.display_name || 'Crew Member'}</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="shell admin-main">{children}</main>
    </div>
  );
}
