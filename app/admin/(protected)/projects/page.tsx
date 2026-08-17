import Link from 'next/link';
import { AdminContentDashboard } from '@/components/admin/admin-content-dashboard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';

export default async function ProjectsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('projects').select('*').order('display_order').order('id');

  return (
    <>
      <AdminPageHeader
        eyebrow="Website content"
        title="Projects"
        description="Curate the event portfolio showcase, upload event photo galleries, and highlight featured projects on the homepage."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        }
      />
      <AdminContentDashboard kind="project" items={data ?? []} />
    </>
  );
}
