import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminSubmitButton } from '@/components/admin/admin-submit-button';
import { createClient } from '@/lib/supabase/server';
import { updateQuotation } from '../../../actions';

export default async function QuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('quotations').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const details = [
    ['Company', data.company_name || 'Not provided'],
    ['Email', data.email || 'Not provided'],
    ['Phone', data.phone || 'Not provided'],
    ['Event type', data.event_type || 'Not provided'],
    ['Event date', data.event_date || 'To be confirmed'],
    ['Location', data.event_location || 'Not provided'],
    ['Guests', data.estimated_guests ? String(data.estimated_guests) : 'Not provided'],
    ['Budget', data.estimated_budget || 'Not provided'],
  ];
  return <><AdminPageHeader backHref="/admin/quotations" eyebrow={data.reference_code} title={data.customer_name} description={`Received ${new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(data.created_at))}`} /><div className="admin-request-detail"><section><dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="admin-request-detail__section"><h2>Services requested</h2><p>{data.required_services?.join(', ') || 'No services selected.'}</p></div><div className="admin-request-detail__section"><h2>Additional information</h2><p>{data.additional_information || 'No additional information provided.'}</p></div></section><form action={updateQuotation.bind(null, id)}><h2>Follow-up</h2><label>Status<select name="status" defaultValue={data.status}><option value="new">New</option><option value="contacted">Contacted</option><option value="completed">Completed</option><option value="archived">Archived</option></select></label><label>Internal notes <small>Only administrators can see these notes</small><textarea name="internal_notes" defaultValue={data.internal_notes || ''} rows={10} /></label><AdminSubmitButton>Save request</AdminSubmitButton></form></div></>;
}
