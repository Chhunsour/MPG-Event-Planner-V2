import Link from 'next/link';
import { AdminContentList } from '@/components/admin/admin-content-list';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { createClient } from '@/lib/supabase/server';

export default async function BlogAdminPage() { const supabase = await createClient(); const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }); return <><AdminPageHeader eyebrow="Website content" title="Blog" description="Write and publish planning advice, production notes, and company updates." action={<Link href="/admin/blog/new" className="btn btn-primary">New post</Link>} /><AdminContentList kind="blog" items={data ?? []} /></>; }
