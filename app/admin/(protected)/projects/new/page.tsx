import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentForm } from '@/components/admin/content-form';
import { saveProject } from '../../../actions';

export default function NewProjectPage() { return <><AdminPageHeader backHref="/admin/projects" eyebrow="Projects" title="New project" description="Add a completed event to the portfolio." /><div className="admin-form-card"><ContentForm kind="project" action={saveProject} /></div></>; }
