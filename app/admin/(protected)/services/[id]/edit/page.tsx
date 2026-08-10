import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentForm } from '@/components/admin/content-form';
import { createClient } from '@/lib/supabase/server';
import { saveService } from '../../../../actions';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient(); const { data } = await supabase.from('services').select('*').eq('id', Number(id)).maybeSingle(); if (!data) notFound();
  return <><AdminPageHeader backHref="/admin/services" eyebrow="Services" title="Edit service" description="Update the service details, translations, media, and publishing state." /><div className="admin-form-card"><ContentForm kind="service" action={saveService} item={data} /></div></>;
}
