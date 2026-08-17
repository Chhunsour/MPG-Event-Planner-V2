import { requireCrewRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { BarChart3, Users, Eye, Globe2, Smartphone, Monitor, Compass, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { AnalyticsEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  await requireCrewRole(['owner', 'admin', 'editor', 'viewer']);
  const supabase = await createClient();

  // Fetch recent events (up to 2000 events for high-speed server aggregation)
  const { data: rawEvents, error } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2000);

  const events: AnalyticsEvent[] = rawEvents || [];

  // Metrics computation
  const totalViews = events.length;
  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;

  const now = Date.now();
  const past24hTime = now - 24 * 60 * 60 * 1000;
  const past7dTime = now - 7 * 24 * 60 * 60 * 1000;

  const views24h = events.filter((e) => new Date(e.created_at).getTime() >= past24hTime).length;
  const views7d = events.filter((e) => new Date(e.created_at).getTime() >= past7dTime).length;

  // Group by Path
  const pathCounts: Record<string, number> = {};
  events.forEach((e) => {
    pathCounts[e.path] = (pathCounts[e.path] || 0) + 1;
  });
  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  // Group by Referrer
  const referrerCounts: Record<string, number> = {};
  events.forEach((e) => {
    const ref = e.referrer && e.referrer !== '' ? e.referrer : 'Direct';
    let cleanRef = ref;
    try {
      if (ref.startsWith('http')) {
        const url = new URL(ref);
        cleanRef = url.hostname.replace(/^www\./, '');
      }
    } catch {
      cleanRef = ref;
    }
    referrerCounts[cleanRef] = (referrerCounts[cleanRef] || 0) + 1;
  });
  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Group by Device
  const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
  events.forEach((e) => {
    const dev = (e.device_type || 'desktop').toLowerCase();
    if (dev in deviceCounts) deviceCounts[dev]++;
    else deviceCounts.desktop++;
  });

  // Group by Browser
  const browserCounts: Record<string, number> = {};
  events.forEach((e) => {
    const b = e.browser || 'Other';
    browserCounts[b] = (browserCounts[b] || 0) + 1;
  });
  const topBrowsers = Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Group by Language / Locale
  const localeCounts: Record<string, number> = {};
  events.forEach((e) => {
    const loc = (e.locale || 'en').toUpperCase();
    localeCounts[loc] = (localeCounts[loc] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Website Traffic & Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time telemetry and visitor engagement collected via consented cookies and session tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/en"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            Visit Live Site <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          Analytics database table is currently initializing or awaiting first visitor events.
        </div>
      ) : null}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Page Views</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">{totalViews.toLocaleString()}</div>
          <p className="mt-1 text-xs text-slate-400">All recorded interactions</p>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Unique Sessions</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">{uniqueSessions.toLocaleString()}</div>
          <p className="mt-1 text-xs text-slate-400">Distinct visitor sessions</p>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Last 24 Hours</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">{views24h.toLocaleString()}</div>
          <p className="mt-1 text-xs text-slate-400">Live 24h traffic activity</p>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Past 7 Days</span>
            <Globe2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">{views7d.toLocaleString()}</div>
          <p className="mt-1 text-xs text-slate-400">Weekly traffic volume</p>
        </div>
      </div>

      {/* Grid: Popular Pages & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span>Most Visited Pages</span>
            <span className="text-xs font-normal text-slate-400">Views</span>
          </h2>
          {topPaths.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No page views recorded yet.</p>
          ) : (
            <div className="space-y-3.5">
              {topPaths.map(([path, count]) => {
                const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                return (
                  <div key={path} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-200 font-mono truncate max-w-[280px]">{path}</span>
                      <span className="text-slate-400">
                        {count} <span className="text-slate-500">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Traffic Sources / Referrers */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span>Traffic Channels & Referrers</span>
            <span className="text-xs font-normal text-slate-400">Visits</span>
          </h2>
          {topReferrers.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No referrer data recorded yet.</p>
          ) : (
            <div className="space-y-3.5">
              {topReferrers.map(([ref, count]) => {
                const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                return (
                  <div key={ref} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-200 capitalize">{ref}</span>
                      <span className="text-slate-400">
                        {count} <span className="text-slate-500">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Devices, Browsers, Languages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" /> Device Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Desktop', count: deviceCounts.desktop, icon: Monitor },
              { label: 'Mobile', count: deviceCounts.mobile, icon: Smartphone },
            ].map(({ label, count, icon: Icon }) => {
              const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
              return (
                <div key={label} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{label}</span>
                  </div>
                  <span className="font-semibold text-slate-200">
                    {count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-sky-400" /> Top Browsers
          </h3>
          <div className="space-y-2.5">
            {topBrowsers.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No browser data</p>
            ) : (
              topBrowsers.map(([browser, count]) => {
                const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                return (
                  <div key={browser} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-slate-300">{browser}</span>
                    <span className="font-semibold text-slate-200">
                      {count} ({percent}%)
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-violet-400" /> Language Breakdown
          </h3>
          <div className="space-y-2.5">
            {Object.entries(localeCounts).length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No language data</p>
            ) : (
              Object.entries(localeCounts).map(([lang, count]) => {
                const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                const langLabel = lang === 'EN' ? 'English (EN)' : lang === 'KM' ? 'Khmer (KM)' : lang === 'ZH' ? 'Chinese (ZH)' : lang;
                return (
                  <div key={lang} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-slate-300">{langLabel}</span>
                    <span className="font-semibold text-slate-200">
                      {count} ({percent}%)
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Real-time Event Stream Table */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Live Visitor Stream (Recent 30 Events)</h2>
          <span className="text-xs text-slate-400">Auto-logged on page views</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Path</th>
                <th className="p-4">Device</th>
                <th className="p-4">Browser & OS</th>
                <th className="p-4">Referrer</th>
                <th className="p-4">Locale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                    No visitor events captured yet. Browse the public site and click &ldquo;Accept All&rdquo; to test live telemetry.
                  </td>
                </tr>
              ) : (
                events.slice(0, 30).map((event) => (
                  <tr key={event.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                      {new Date(event.created_at).toLocaleTimeString()} ·{' '}
                      <span className="text-slate-500">{new Date(event.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4 font-mono text-xs text-emerald-400 font-semibold">{event.path}</td>
                    <td className="p-4 text-xs capitalize text-slate-300">{event.device_type || 'desktop'}</td>
                    <td className="p-4 text-xs text-slate-400">
                      {event.browser || 'Other'} / {event.os || 'Other'}
                    </td>
                    <td className="p-4 text-xs text-slate-400 max-w-xs truncate">{event.referrer || 'Direct'}</td>
                    <td className="p-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-slate-300 font-mono">
                        {event.locale || 'en'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
