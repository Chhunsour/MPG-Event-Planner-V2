import { notFound } from 'next/navigation';
import { ContentForm } from '@/components/admin/content-form';
import { createClient } from '@/lib/supabase/server';
import { saveService } from '../../../../actions';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient(); const { data } = await supabase.from('services').select('*').eq('id', Number(id)).maybeSingle(); if (!data) notFound();
  return <><h1 className="t-heading text-4xl">Edit service</h1><div className="mt-8 bg-white p-6 md:p-8"><ContentForm kind="service" action={saveService} item={data} /></div></>;
}
