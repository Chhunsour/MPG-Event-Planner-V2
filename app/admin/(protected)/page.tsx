import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [services, projects, blog, quotations, recent] = await Promise.all([
    supabase.from('services').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quotations').select('id,customer_name,reference_code,status,created_at').order('created_at', { ascending: false }).limit(5),
  ]);
  const stats = [
    ['Services', services.count, 'Manage capabilities', '/admin/services'],
    ['Projects', projects.count, 'Keep the portfolio current', '/admin/projects'],
    ['Blog posts', blog.count, 'Publish stories and updates', '/admin/blog'],
    ['New quotes', quotations.count, 'Requests waiting for review', '/admin/quotations'],
  ] as const;

  return (
    <>
      <AdminPageHeader eyebrow="Overview" title="Content dashboard" description="Manage the website and respond to new event enquiries from one place." action={<Link href="/en" className="btn btn-outline" target="_blank">View website ↗</Link>} />
      <section className="admin-stat-grid" aria-label="Content summary">
        {stats.map(([label, count, description, href]) => <Link key={href} href={href}><span>{label}</span><strong>{count ?? 0}</strong><p>{description}</p><i aria-hidden="true">→</i></Link>)}
      </section>
      <section className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="admin-panel__head"><div><p>Inbox</p><h2>Recent quotation requests</h2></div><Link href="/admin/quotations">View all</Link></div>
          <div className="admin-quote-list">
            {(recent.data ?? []).length ? (recent.data ?? []).map((item) => <Link key={item.id} href={`/admin/quotations/${item.id}`}><div><strong>{item.customer_name}</strong><span>{item.reference_code} · {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.created_at))}</span></div><small data-status={item.status}>{item.status}</small></Link>) : <p className="admin-panel__empty">No quotation requests yet.</p>}
          </div>
        </div>
        <aside className="admin-panel admin-quick-actions">
          <div className="admin-panel__head"><div><p>Shortcuts</p><h2>Create content</h2></div></div>
          <Link href="/admin/services/new"><span>New service</span><i>→</i></Link>
          <Link href="/admin/projects/new"><span>New project</span><i>→</i></Link>
          <Link href="/admin/blog/new"><span>New blog post</span><i>→</i></Link>
          <Link href="/admin/media"><span>Upload media</span><i>→</i></Link>
        </aside>
      </section>
    </>
  );
}
