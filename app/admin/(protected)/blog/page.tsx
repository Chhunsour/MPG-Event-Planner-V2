import Link from 'next/link';
import { AdminContentDashboard } from '@/components/admin/admin-content-dashboard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';

export default async function BlogAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });

  return (
    <>
      <AdminPageHeader
        eyebrow="Website content"
        title="Blog"
        description="Write and publish event planning guides, venue recommendations, industry insights, and company news."
        action={
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Link>
        }
      />
      <AdminContentDashboard kind="blog" items={data ?? []} />
    </>
  );
}
