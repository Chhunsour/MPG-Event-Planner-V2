import { ContentForm } from '@/components/admin/content-form';
import { saveBlog } from '../../../actions';

export default function NewBlogPage() { return <><h1 className="t-heading text-4xl">New post</h1><div className="mt-8 bg-white p-6 md:p-8"><ContentForm kind="blog" action={saveBlog} /></div></>; }
