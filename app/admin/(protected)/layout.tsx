import Image from 'next/image';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireAdmin();
  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="shell admin-header__row">
          <Link href="/admin" className="admin-brand" aria-label="MPG admin dashboard">
            <Image src="/images/mpg-logo.png" alt="MPG Event Planner" width={183} height={61} />
            <span>Admin</span>
          </Link>
          <div className="admin-account">
            <span>{profile.display_name || 'Administrator'}</span>
            <form action={logout}><button type="submit">Sign out</button></form>
          </div>
        </div>
        <div className="shell"><AdminNav /></div>
      </header>
      <main className="shell admin-main">{children}</main>
    </div>
  );
}
