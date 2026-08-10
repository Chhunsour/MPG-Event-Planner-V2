import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentForm } from '@/components/admin/content-form';
import { saveBlog } from '../../../actions';

export default function NewBlogPage() { return <><AdminPageHeader backHref="/admin/blog" eyebrow="Blog" title="New post" description="Create a concise story, planning guide, or production update." /><div className="admin-form-card"><ContentForm kind="blog" action={saveBlog} /></div></>; }
