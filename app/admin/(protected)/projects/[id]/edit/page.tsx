import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentForm } from '@/components/admin/content-form';
import { createClient } from '@/lib/supabase/server';
import { saveProject } from '../../../../actions';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const supabase = await createClient(); const { data } = await supabase.from('projects').select('*').eq('id', Number(id)).maybeSingle(); if (!data) notFound(); return <><AdminPageHeader backHref="/admin/projects" eyebrow="Projects" title="Edit project" description="Update portfolio details without changing the original publish date." /><div className="admin-form-card"><ContentForm kind="project" action={saveProject} item={data} /></div></>; }
