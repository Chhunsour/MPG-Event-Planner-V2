import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentForm } from '@/components/admin/content-form';
import { saveService } from '../../../actions';

export default function NewServicePage() { return <><AdminPageHeader backHref="/admin/services" eyebrow="Services" title="New service" description="Add a service and prepare its translations before publishing." /><div className="admin-form-card"><ContentForm kind="service" action={saveService} /></div></>; }
