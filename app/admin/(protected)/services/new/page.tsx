import { ContentForm } from '@/components/admin/content-form';
import { saveService } from '../../../actions';

export default function NewServicePage() { return <><h1 className="t-heading text-4xl">New service</h1><div className="mt-8 bg-white p-6 md:p-8"><ContentForm kind="service" action={saveService} /></div></>; }
