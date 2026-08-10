import { notFound } from 'next/navigation';
import { ContentForm } from '@/components/admin/content-form';
import { createClient } from '@/lib/supabase/server';
import { saveBlog } from '../../../../actions';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const supabase = await createClient(); const { data } = await supabase.from('blog_posts').select('*').eq('id', Number(id)).maybeSingle(); if (!data) notFound(); return <><h1 className="t-heading text-4xl">Edit post</h1><div className="mt-8 bg-white p-6 md:p-8"><ContentForm kind="blog" action={saveBlog} item={data} /></div></>; }
