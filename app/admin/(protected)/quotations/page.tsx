import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { createClient } from '@/lib/supabase/server';

export default async function QuotationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('quotations').select('*').order('created_at', { ascending: false });
  return <><AdminPageHeader eyebrow="Inbox" title="Quotation requests" description="Review incoming event briefs, record follow-up notes, and keep each request moving." /><div className="admin-requests">{(data ?? []).length ? (data ?? []).map((item) => <Link key={item.id} href={`/admin/quotations/${item.id}`}><div><span>{item.reference_code}</span><h2>{item.customer_name}</h2><p>{item.event_type || 'Event type not provided'} · {item.event_location || 'Location not provided'}</p></div><div><small>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.created_at))}</small><strong data-status={item.status}>{item.status}</strong><i aria-hidden="true">→</i></div></Link>) : <div className="admin-empty"><span aria-hidden="true">✓</span><h2>Inbox is clear</h2><p>New quotation requests will appear here as soon as clients submit the website form.</p></div>}</div></>;
}
