import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentForm } from '@/components/admin/content-form';
import { createClient } from '@/lib/supabase/server';
import { saveBlog } from '../../../../actions';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const supabase = await createClient(); const { data } = await supabase.from('blog_posts').select('*').eq('id', Number(id)).maybeSingle(); if (!data) notFound(); return <><AdminPageHeader backHref="/admin/blog" eyebrow="Blog" title="Edit post" description="Update the article, translations, image, and publishing state." /><div className="admin-form-card"><ContentForm kind="blog" action={saveBlog} item={data} /></div></>; }
