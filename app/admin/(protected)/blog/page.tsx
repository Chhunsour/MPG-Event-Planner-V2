import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { removeContent } from '../../actions';
import { localized } from '@/lib/content';

export default async function BlogAdminPage() { const supabase = await createClient(); const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }); return <><div className="flex items-end justify-between gap-4"><h1 className="t-heading text-4xl">Blog</h1><Link href="/admin/blog/new" className="btn btn-primary">New post</Link></div><div className="mt-8 divide-y divide-line border-y border-line bg-white">{(data ?? []).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-bold">{localized(item.title, 'en')}</h2><p className="text-sm text-muted">/{item.slug} · {item.is_published ? 'Published' : 'Draft'}</p></div><div className="flex gap-4 text-sm font-bold"><Link href={`/admin/blog/${item.id}/edit`} className="text-brand">Edit</Link><form action={removeContent.bind(null, 'blog_posts', String(item.id))}><button type="submit" className="text-red-700">Delete</button></form></div></div>)}</div></>; }
