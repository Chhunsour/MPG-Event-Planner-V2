import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireAdmin();
  return <div className="min-h-screen bg-paper-tint"><header className="border-b border-line bg-white"><div className="shell flex flex-wrap items-center justify-between gap-4 py-5"><Link href="/admin" className="font-bold text-brand">MPG CMS</Link><nav className="flex flex-wrap items-center gap-4 text-sm font-bold"><Link href="/admin/services">Services</Link><Link href="/admin/projects">Projects</Link><Link href="/admin/blog">Blog</Link><Link href="/admin/quotations">Quotes</Link><Link href="/admin/media">Media</Link><Link href="/admin/settings">Settings</Link><form action={logout}><button className="text-muted" type="submit">Sign out</button></form></nav></div></header><main className="shell py-10"><p className="mb-8 text-sm text-muted">Signed in as {profile.display_name || 'administrator'}</p>{children}</main></div>;
}
