import { ContentForm } from '@/components/admin/content-form';
import { saveProject } from '../../../actions';

export default function NewProjectPage() { return <><h1 className="t-heading text-4xl">New project</h1><div className="mt-8 bg-white p-6 md:p-8"><ContentForm kind="project" action={saveProject} /></div></>; }
