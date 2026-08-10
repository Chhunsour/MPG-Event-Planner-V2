import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [services, projects, blog, quotations] = await Promise.all([supabase.from('services').select('id', { count: 'exact', head: true }), supabase.from('projects').select('id', { count: 'exact', head: true }), supabase.from('blog_posts').select('id', { count: 'exact', head: true }), supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'new')]);
  return <><div className="flex items-end justify-between gap-4"><div><p className="t-label text-brand">Operations</p><h1 className="t-heading mt-2 text-4xl">Content dashboard</h1></div><Link href="/en" className="btn btn-outline">View site</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Services', services.count, '/admin/services'], ['Projects', projects.count, '/admin/projects'], ['Blog posts', blog.count, '/admin/blog'], ['New quotations', quotations.count, '/admin/quotations']].map(([label, count, href]) => <Link key={String(href)} href={String(href)} className="border border-line bg-white p-6 hover:border-brand"><p className="text-sm text-muted">{label}</p><p className="mt-3 text-4xl font-bold text-brand">{count ?? 0}</p></Link>)}</div></>;
}
