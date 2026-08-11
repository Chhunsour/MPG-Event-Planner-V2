import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminSubmitButton } from '@/components/admin/admin-submit-button';
import { AutoTranslateAllButton } from '@/components/admin/translation-button';
import { createClient } from '@/lib/supabase/server';
import { requireCrewRole } from '@/lib/auth';
import { saveAnnouncement, toggleAnnouncement } from '../../actions';

export default async function AnnouncementsPage() {
  await requireCrewRole(['owner', 'admin']);
  const supabase = await createClient();

  const [announcementsRes, quotationsRes] = await Promise.all([
    supabase.from('announcements').select('*').limit(1).maybeSingle(),
    supabase.from('quotations').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  const announcement = announcementsRes.data;
  const quotations = quotationsRes.data ?? [];

  const titleObj = announcement?.title && typeof announcement.title === 'object' && !Array.isArray(announcement.title)
    ? (announcement.title as Record<string, string>)
    : {};
  const titleEn = String(titleObj.en ?? '');
  const titleKm = String(titleObj.km ?? '');
  const titleZh = String(titleObj.zh ?? '');
  const link = announcement?.link || '/contact';
  const isActive = announcement?.is_active ?? true;

  return (
    <>
      <AdminPageHeader
        eyebrow="Notifications"
        title="Header Alerts & Announcements"
        description="Manage the announcement banner shown at the top of the public website, translate content across EN/KM/ZH, and view customer alert activity."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Announcement Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Preview Card */}
          <div className="wp-metabox">
            <div className="wp-metabox-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <div>
                  <h3>Live Announcement Bar Preview</h3>
                  <small>This is how the banner appears to visitors at the top of the site</small>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {isActive ? 'Active On Website' : 'Currently Hidden'}
              </span>
            </div>

            <div className="wp-metabox-content">
              <div className="bg-[#051c38] text-white p-3 rounded-lg flex items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>{titleEn.replace(/^📢\s*/, '') || 'Booking open for 2026 Corporate Ceremonies & Grand Openings across Cambodia!'}</span>
                  <span className="px-2 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-bold">
                    Get Quote ↗
                  </span>
                </div>
                <span className="opacity-60 text-sm cursor-default">✕</span>
              </div>
            </div>
          </div>

          {/* Form Editor */}
          <form action={saveAnnouncement} className="wp-metabox space-y-4">
            <div className="wp-metabox-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <div>
                  <h3>Edit Announcement Banner</h3>
                  <small>Enter text in English, Khmer, and Chinese</small>
                </div>
              </div>

              <AutoTranslateAllButton />
            </div>

            <div className="wp-metabox-content space-y-4">
              <div className="wp-field-group">
                <label className="wp-label">English Announcement</label>
                <input
                  type="text"
                  name="title_en"
                  defaultValue={titleEn.replace(/^📢\s*/, '') || 'Booking open for 2026 Corporate Ceremonies & Grand Openings across Cambodia!'}
                  placeholder="English alert message…"
                  className="wp-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="wp-field-group">
                  <label className="wp-label">Khmer Announcement (ភាសាខ្មែរ)</label>
                  <input
                    type="text"
                    name="title_km"
                    defaultValue={titleKm.replace(/^📢\s*/, '') || 'បើកទទួលការកក់សម្រាប់ការរៀបចំកម្មវិធី និងពិធីបើកសម្ពោធឆ្នាំ ២០២៦!'}
                    placeholder="សារជូនដំណឹងភាសាខ្មែរ…"
                    className="wp-input"
                  />
                </div>

                <div className="wp-field-group">
                  <label className="wp-label">Chinese Announcement (中文)</label>
                  <input
                    type="text"
                    name="title_zh"
                    defaultValue={titleZh.replace(/^📢\s*/, '') || '2026年柬埔寨企业典礼与开业仪式策划现已全面开放预订！'}
                    placeholder="中文公告消息…"
                    className="wp-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="wp-field-group">
                  <label className="wp-label">Target CTA URL Link</label>
                  <input
                    type="text"
                    name="link"
                    defaultValue={link}
                    placeholder="/contact or /services"
                    className="wp-input"
                  />
                  <small className="wp-hint">Destination page when visitors click the action button</small>
                </div>

                <div className="wp-field-group flex flex-col justify-center">
                  <label className="wp-checkbox-label inline-flex items-center gap-2 cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={isActive}
                      className="wp-checkbox"
                    />
                    <span className="font-bold text-slate-800 text-sm">Display Alert Banner on Website</span>
                  </label>
                  <small className="wp-hint">Uncheck to hide banner from visitors without deleting text</small>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <AdminSubmitButton>Save Announcement Alert</AdminSubmitButton>
              </div>
            </div>
          </form>
        </div>

        {/* Right 1 Column: Customer Inquiry Notifications Log */}
        <div className="space-y-6">
          <div className="wp-metabox">
            <div className="wp-metabox-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <div>
                  <h3>Inquiries Log</h3>
                  <small>Recent website customer quote submissions</small>
                </div>
              </div>
              <Link href="/admin/quotations" className="text-xs font-bold text-sky-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="wp-metabox-content divide-y divide-slate-100">
              {quotations.length ? (
                quotations.map((q) => (
                  <Link
                    key={q.id}
                    href={`/admin/quotations/${q.id}`}
                    className="block py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600">
                        {q.customer_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.status === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {q.event_type || 'Event Inquiry'} • {q.phone}
                    </p>
                    <time className="text-[10px] text-slate-400 block mt-1">
                      {new Date(q.created_at).toLocaleString()}
                    </time>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No inquiries received yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
