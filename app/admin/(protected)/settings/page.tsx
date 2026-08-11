import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminSubmitButton } from '@/components/admin/admin-submit-button';
import { createClient } from '@/lib/supabase/server';
import { saveSettings } from '../../actions';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*');
  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, typeof row.value === 'string' ? row.value : '']));

  const companyFields = [
    ['company_name', 'Company Name', 'text', 'MPG Event Planner'],
    ['company_email', 'Primary Email', 'email', 'hello@mpgeventplanner.com'],
    ['phone', 'Primary Phone / Telegram', 'tel', '+855 12 345 678'],
    ['phone_secondary', 'Secondary Phone / Hotline', 'tel', '+855 98 765 432'],
    ['office_address', 'Office Address', 'text', 'Phnom Penh, Cambodia'],
    ['working_hours', 'Working Hours', 'text', 'Mon - Sat: 8:00 AM - 6:00 PM'],
  ] as const;

  const socialFields = [
    ['telegram', 'Telegram Channel / Link', 'url', 'https://t.me/mpgeventplanner'],
    ['whatsapp', 'WhatsApp Link / Number', 'text', 'https://wa.me/85512345678'],
    ['facebook', 'Facebook Page URL', 'url', 'https://facebook.com/mpgeventplanner'],
    ['instagram', 'Instagram Profile URL', 'url', 'https://instagram.com/mpgeventplanner'],
    ['linkedin', 'LinkedIn Page URL', 'url', 'https://linkedin.com/company/mpgeventplanner'],
    ['youtube', 'YouTube Channel URL', 'url', 'https://youtube.com/@mpgeventplanner'],
  ] as const;

  const seoFields = [
    ['site_title', 'Global Website Title Tag', 'text', 'MPG Event Planner — Professional Event Planning in Cambodia'],
    ['site_description', 'Global Meta Description', 'text', 'Grand openings, corporate events, product launches, exhibitions and complete event production across Cambodia.'],
    ['google_analytics_id', 'Google Analytics ID (G-XXXXXXX)', 'text', 'G-XXXXXXXXXX'],
    ['inquiry_notification_email', 'Inquiry Notification Alert Email', 'email', 'admin@mpgeventplanner.com'],
  ] as const;

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Site settings"
        description="Manage company contact details, social links, SEO tags, and system preferences."
      />

      <form action={saveSettings} className="grid gap-6 max-w-4xl">
        {/* Company Contact Information */}
        <div className="wp-metabox">
          <div className="wp-metabox-header">
            <h3>🏢 Company & Contact Information</h3>
            <small>Public phone numbers, email address, and office details</small>
          </div>
          <div className="wp-metabox-content grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyFields.map(([name, label, type, placeholder]) => (
              <div key={name} className="wp-field-group">
                <label className="wp-label">{label}</label>
                <input
                  type={type}
                  name={name}
                  defaultValue={settings[name] || ''}
                  placeholder={placeholder}
                  className="wp-input"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Media & Messaging */}
        <div className="wp-metabox">
          <div className="wp-metabox-header">
            <h3>💬 Messaging & Social Media Links</h3>
            <small>Direct contact channels used in headers, footers, and contact cards</small>
          </div>
          <div className="wp-metabox-content grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialFields.map(([name, label, type, placeholder]) => (
              <div key={name} className="wp-field-group">
                <label className="wp-label">{label}</label>
                <input
                  type={type}
                  name={name}
                  defaultValue={settings[name] || ''}
                  placeholder={placeholder}
                  className="wp-input"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SEO & System Preferences */}
        <div className="wp-metabox">
          <div className="wp-metabox-header">
            <h3>🔍 Global SEO Tags & Analytics</h3>
            <small>Default search engine tags and tracking credentials</small>
          </div>
          <div className="wp-metabox-content grid grid-cols-1 gap-4">
            {seoFields.map(([name, label, type, placeholder]) => (
              <div key={name} className="wp-field-group">
                <label className="wp-label">{label}</label>
                {name === 'site_description' ? (
                  <textarea
                    name={name}
                    defaultValue={settings[name] || ''}
                    placeholder={placeholder}
                    rows={3}
                    className="wp-textarea"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    defaultValue={settings[name] || ''}
                    placeholder={placeholder}
                    className="wp-input"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <AdminSubmitButton>Save All Settings</AdminSubmitButton>
        </div>
      </form>
    </>
  );
}
