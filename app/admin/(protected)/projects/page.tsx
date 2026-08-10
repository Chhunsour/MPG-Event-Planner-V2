import Link from 'next/link';
import { AdminContentList } from '@/components/admin/admin-content-list';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { createClient } from '@/lib/supabase/server';

export default async function ProjectsAdminPage() { const supabase = await createClient(); const { data } = await supabase.from('projects').select('*').order('display_order').order('id'); return <><AdminPageHeader eyebrow="Website content" title="Projects" description="Curate the event portfolio and choose which projects are featured." action={<Link href="/admin/projects/new" className="btn btn-primary">New project</Link>} /><AdminContentList kind="project" items={data ?? []} /></>; }
