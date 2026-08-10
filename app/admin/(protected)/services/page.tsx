import Link from 'next/link';
import { AdminContentList } from '@/components/admin/admin-content-list';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { createClient } from '@/lib/supabase/server';

export default async function ServicesAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('services').select('*').order('display_order').order('id');
  return <><AdminPageHeader eyebrow="Website content" title="Services" description="Manage the services shown across the public website." action={<Link href="/admin/services/new" className="btn btn-primary">New service</Link>} /><AdminContentList kind="service" items={data ?? []} /></>;
}
