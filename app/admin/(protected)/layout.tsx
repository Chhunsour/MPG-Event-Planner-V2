import Image from 'next/image';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { requireCrewRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logout } from '../actions';

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
          <Link href="/admin" className="admin-brand" aria-label="MPG admin dashboard">
            <Image src="/images/mpg-logo.png" alt="MPG Event Planner" width={183} height={61} />
            <span>Admin</span>
          </Link>
          <div className="admin-account">
            <Link
              href="/admin/quotations"
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-colors mr-2"
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

            <span className="font-medium text-slate-800">
              {profile.display_name || 'Crew Member'}
            </span>
            <form action={logout}>
              <button type="submit">Sign out</button>
            </form>
          </div>
        </div>
        <div className="border-t border-slate-100/90 py-1.5">
          <div className="shell"><AdminNav role={profile.role} /></div>
        </div>
      </header>
      <main className="shell admin-main">{children}</main>
    </div>
  );
}
