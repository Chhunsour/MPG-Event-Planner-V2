'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Eye,
  Users,
  Compass,
  Globe2,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { AnalyticsEvent } from '@/lib/types';

type TimeRange = '24h' | '7d' | '30d' | 'all';

export function AnalyticsDashboardClient({ initialEvents }: { initialEvents: AnalyticsEvent[] }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [activeTab, setActiveTab] = useState<'pages' | 'referrers'>('pages');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter events based on selected timeRange
  const filteredEvents = useMemo(() => {
    const now = Date.now();
    let cutoff = 0;
    if (timeRange === '24h') cutoff = now - 24 * 60 * 60 * 1000;
    else if (timeRange === '7d') cutoff = now - 7 * 24 * 60 * 60 * 1000;
    else if (timeRange === '30d') cutoff = now - 30 * 24 * 60 * 60 * 1000;

    if (cutoff === 0) return initialEvents;
    return initialEvents.filter((e) => new Date(e.created_at).getTime() >= cutoff);
  }, [initialEvents, timeRange]);

  // Aggregate Metrics
  const totalViews = filteredEvents.length;
  const uniqueSessions = useMemo(() => new Set(filteredEvents.map((e) => e.session_id)).size, [filteredEvents]);
  const avgPagesPerSession = uniqueSessions > 0 ? (totalViews / uniqueSessions).toFixed(1) : '0';

  // Group by Path
  const topPaths = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEvents.forEach((e) => {
      counts[e.path] = (counts[e.path] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [filteredEvents]);

  // Group by Referrer
  const topReferrers = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEvents.forEach((e) => {
      const ref = e.referrer && e.referrer !== '' ? e.referrer : 'Direct / Organic';
      let cleanRef = ref;
      try {
        if (ref.startsWith('http')) {
          const url = new URL(ref);
          cleanRef = url.hostname.replace(/^www\./, '');
        }
      } catch {
        cleanRef = ref;
      }
      counts[cleanRef] = (counts[cleanRef] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [filteredEvents]);

  // Devices Breakdown
  const deviceStats = useMemo(() => {
    const counts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    filteredEvents.forEach((e) => {
      const d = (e.device_type || 'desktop').toLowerCase();
      if (d in counts) counts[d]++;
      else counts.desktop++;
    });
    return counts;
  }, [filteredEvents]);

  // Browsers Breakdown
  const topBrowsers = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEvents.forEach((e) => {
      const b = e.browser || 'Other';
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredEvents]);

  // Locales Breakdown
  const localeStats = useMemo(() => {
    const counts: Record<string, number> = { EN: 0, KM: 0, ZH: 0 };
    filteredEvents.forEach((e) => {
      const loc = (e.locale || 'en').toUpperCase();
      if (loc in counts) counts[loc]++;
      else counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredEvents]);

  // Filter Live Log
  const searchedLog = useMemo(() => {
    if (!searchQuery.trim()) return filteredEvents.slice(0, 30);
    const q = searchQuery.toLowerCase();
    return filteredEvents
      .filter(
        (e) =>
          e.path.toLowerCase().includes(q) ||
          (e.referrer && e.referrer.toLowerCase().includes(q)) ||
          (e.browser && e.browser.toLowerCase().includes(q)) ||
          (e.os && e.os.toLowerCase().includes(q))
      )
      .slice(0, 30);
  }, [filteredEvents, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Time Range Selector & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#1e9a2a] border border-emerald-200/80 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e9a2a]" />
            </span>
            Live Telemetry Active
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            Tracking consented visitor sessions in real time
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(
            [
              ['24h', 'Today'],
              ['7d', '7 Days'],
              ['30d', '30 Days'],
              ['all', 'All Time'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setTimeRange(val)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                timeRange === val
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh analytics data"
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Page Views</span>
            <Eye className="w-4 h-4 text-[#1e9a2a]" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            In selected timeframe
          </div>
        </div>

        {/* Unique Sessions */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unique Visitors</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {uniqueSessions.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Distinct visitor sessions
          </div>
        </div>

        {/* Pages per Session */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pages / Session</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {avgPagesPerSession}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Average browsing depth
          </div>
        </div>

        {/* Top Referral Channel */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Top Channel</span>
            <Compass className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {topReferrers.length > 0 ? topReferrers[0][0] : 'Direct'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {topReferrers.length > 0
              ? `${Math.round((topReferrers[0][1] / (totalViews || 1)) * 100)}% of traffic`
              : 'Direct / Organic'}
          </div>
        </div>
      </div>

      {/* Main Bento: Content Performance & Audience Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Top Pages vs Referrers */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('pages')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'pages'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Top Visited Pages
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('referrers')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'referrers'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Traffic Sources
                </button>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {activeTab === 'pages' ? `${topPaths.length} routes` : `${topReferrers.length} sources`}
              </span>
            </div>

            {/* List */}
            {activeTab === 'pages' ? (
              topPaths.length === 0 ? (
                <div className="py-14 text-center text-slate-400 text-xs">
                  No page views captured for this time period yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {topPaths.map(([path, count], index) => {
                    const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                    return (
                      <div
                        key={path}
                        className="relative overflow-hidden rounded-xl bg-slate-50/80 border border-slate-200/60 p-3 hover:border-slate-300 transition-colors group"
                      >
                        {/* Progress Bar underlay */}
                        <div
                          className="absolute inset-y-0 left-0 bg-[#1e9a2a]/10 rounded-xl transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                        <div className="relative flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 text-slate-400 font-mono text-[10px]">{index + 1}</span>
                            <span className="font-mono text-slate-800 truncate group-hover:text-[#1e9a2a] transition-colors font-medium">
                              {path}
                            </span>
                            <Link
                              href={path}
                              target="_blank"
                              className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-bold text-slate-900 tabular-nums">{count}</span>
                            <span className="text-[11px] font-mono text-slate-500 w-10 text-right">
                              {percent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : topReferrers.length === 0 ? (
              <div className="py-14 text-center text-slate-400 text-xs">
                No referral sources captured for this time period yet.
              </div>
            ) : (
              <div className="space-y-2">
                {topReferrers.map(([ref, count], index) => {
                  const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                  return (
                    <div
                      key={ref}
                      className="relative overflow-hidden rounded-xl bg-slate-50/80 border border-slate-200/60 p-3 hover:border-slate-300 transition-colors"
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-sky-500/10 rounded-xl transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                      <div className="relative flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 text-slate-400 font-mono text-[10px]">{index + 1}</span>
                          <span className="font-semibold text-slate-800 capitalize truncate">{ref}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-slate-900 tabular-nums">{count}</span>
                          <span className="text-[11px] font-mono text-slate-500 w-10 text-right">
                            {percent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Audience & Tech Insights */}
        <div className="lg:col-span-5 space-y-6">
          {/* Device Distribution */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-[#1e9a2a]" /> Device Distribution
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: 'Desktop', count: deviceStats.desktop, icon: Monitor },
                { label: 'Mobile', count: deviceStats.mobile, icon: Smartphone },
                { label: 'Tablet', count: deviceStats.tablet, icon: Tablet },
              ].map(({ label, count, icon: Icon }) => {
                const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                return (
                  <div
                    key={label}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center flex flex-col items-center justify-center gap-1"
                  >
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-800">{label}</span>
                    <span className="text-xs text-[#1e9a2a] font-mono font-bold">{percent}%</span>
                    <span className="text-[10px] text-slate-500">{count} views</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Languages & Browsers Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Languages */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-violet-600" /> Languages
              </h4>
              <div className="space-y-2">
                {localeStats.map(([lang, count]) => {
                  const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                  const label = lang === 'EN' ? 'English' : lang === 'KM' ? 'Khmer' : lang === 'ZH' ? 'Chinese' : lang;
                  return (
                    <div key={lang} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{label}</span>
                      <span className="text-slate-500 font-mono">
                        {count} <span className="text-slate-400">({percent}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Top Browsers
              </h4>
              <div className="space-y-2">
                {topBrowsers.map(([browser, count]) => {
                  const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                  return (
                    <div key={browser} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium truncate max-w-[90px]">{browser}</span>
                      <span className="text-slate-500 font-mono">
                        {count} <span className="text-slate-400">({percent}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Visitor Event Stream Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Recent Visitor Activity Log
              <span className="text-xs font-normal text-slate-500">({searchedLog.length} events)</span>
            </h2>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by path, OS, browser..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Page Path</th>
                <th className="p-3.5">Device</th>
                <th className="p-3.5">Browser & OS</th>
                <th className="p-3.5">Referrer</th>
                <th className="p-3.5">Lang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {searchedLog.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No visitor logs recorded yet or matching your search filter.
                  </td>
                </tr>
              ) : (
                searchedLog.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">
                      {formatRelativeTime(event.created_at)}
                    </td>
                    <td className="p-3.5 font-mono font-medium text-[#1e9a2a] whitespace-nowrap">
                      {event.path}
                    </td>
                    <td className="p-3.5 capitalize text-slate-700 whitespace-nowrap">
                      {event.device_type || 'desktop'}
                    </td>
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">
                      {event.browser || 'Other'} <span className="text-slate-400">/</span> {event.os || 'Other'}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">
                      {event.referrer || 'Direct'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 uppercase text-slate-700 font-mono text-[10px] font-semibold">
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
