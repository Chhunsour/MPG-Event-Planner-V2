import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminSubmitButton } from '@/components/admin/admin-submit-button';
import { createClient } from '@/lib/supabase/server';
import { saveSettings } from '../../actions';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*');
  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, typeof row.value === 'string' ? row.value : '']));
  const fields = [
    ['company_email', 'Company email', 'email', 'hello@mpgeventplanner.com'],
    ['phone', 'Phone', 'tel', '+855 …'],
    ['telegram', 'Telegram URL', 'url', 'https://t.me/…'],
    ['instagram', 'Instagram URL', 'url', 'https://instagram.com/…'],
    ['facebook', 'Facebook URL', 'url', 'https://facebook.com/…'],
  ] as const;
  return <><AdminPageHeader eyebrow="Configuration" title="Site settings" description="Keep the contact details and social links used across the website up to date." /><form action={saveSettings} className="admin-settings-form">{fields.map(([name, label, type, placeholder]) => <label key={name}>{label}<input type={type} name={name} defaultValue={settings[name] || ''} placeholder={placeholder} /></label>)}<div><AdminSubmitButton>Save settings</AdminSubmitButton></div></form></>;
}
