import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminSubmitButton } from '@/components/admin/admin-submit-button';
import { createClient } from '@/lib/supabase/server';
import { requireCrewRole } from '@/lib/auth';
import { saveSettings, logout } from '../../actions';

export default async function SettingsPage() {
  await requireCrewRole(['owner', 'admin']);
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
    ['tiktok', 'TikTok Profile URL', 'url', 'https://tiktok.com/@mpgeventplanner'],
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
          <div className="wp-metabox-header flex items-center gap-2">
            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <h3>Company & Contact Information</h3>
              <small>Public phone numbers, email address, and office details</small>
            </div>
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
          <div className="wp-metabox-header flex items-center gap-2">
            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div>
              <h3>Messaging & Social Media Links</h3>
              <small>Direct contact channels used in headers, footers, and contact cards</small>
            </div>
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
          <div className="wp-metabox-header flex items-center gap-2">
            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div>
              <h3>Global SEO Tags & Analytics</h3>
              <small>Default search engine tags and tracking credentials</small>
            </div>
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

      {/* Account & Session Security */}
      <div className="mt-8 max-w-4xl wp-metabox border-slate-200/90 bg-white shadow-xs">
        <div className="wp-metabox-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3>Admin Session & Account Security</h3>
              <small>End your authenticated session safely to prevent unauthorized browser access</small>
            </div>
          </div>
        </div>
        <div className="wp-metabox-content flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
            Signing out will immediately invalidate your active browser session tokens. You will be redirected to the admin login page and will need your password to log back in.
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out from Admin
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
