import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { QuotationsDashboard } from '@/components/admin/quotations-dashboard';
import { createClient } from '@/lib/supabase/server';

export default async function QuotationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('quotations').select('*').order('created_at', { ascending: false });

  return (
    <>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Quotation Requests"
        description="Review incoming event briefs, filter by date and status, record follow-up notes, and track event leads."
      />
      <QuotationsDashboard initialItems={(data ?? []) as any} />
    </>
  );
}
