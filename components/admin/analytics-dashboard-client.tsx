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
    if (!searchQuery.trim()) return filteredEvents.slice(0, 25);
    const q = searchQuery.toLowerCase();
    return filteredEvents
      .filter(
        (e) =>
          e.path.toLowerCase().includes(q) ||
          (e.referrer && e.referrer.toLowerCase().includes(q)) ||
          (e.browser && e.browser.toLowerCase().includes(q)) ||
          (e.os && e.os.toLowerCase().includes(q))
      )
      .slice(0, 25);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-slate-900/60 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live Telemetry
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Tracking consented visitor sessions
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
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh analytics data"
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors ml-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Page Views</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white tracking-tight tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>In selected timeframe</span>
          </div>
        </div>

        {/* Unique Sessions */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-sky-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unique Visitors</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white tracking-tight tabular-nums">
            {uniqueSessions.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Distinct sessions</span>
          </div>
        </div>

        {/* Pages per Session */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pages / Session</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white tracking-tight tabular-nums">
            {avgPagesPerSession}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Engagement depth</span>
          </div>
        </div>

        {/* Top Referral Channel */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Channel</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white tracking-tight truncate">
            {topReferrers.length > 0 ? topReferrers[0][0] : 'Direct'}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>
              {topReferrers.length > 0
                ? `${Math.round((topReferrers[0][1] / (totalViews || 1)) * 100)}% of traffic`
                : 'Organic / Direct'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bento: Content Performance & Audience Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Top Pages vs Referrers */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('pages')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'pages'
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Top Visited Pages
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('referrers')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'referrers'
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Traffic Sources
                </button>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {activeTab === 'pages' ? `${topPaths.length} routes` : `${topReferrers.length} sources`}
              </span>
            </div>

            {/* List */}
            {activeTab === 'pages' ? (
              topPaths.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No page views captured for this time period yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {topPaths.map(([path, count], index) => {
                    const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                    return (
                      <div
                        key={path}
                        className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 p-3 hover:border-white/10 transition-colors group"
                      >
                        {/* Progress Bar underlay */}
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-500/10 rounded-xl transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                        <div className="relative flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 text-slate-500 font-mono text-[10px]">{index + 1}</span>
                            <span className="font-mono text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                              {path}
                            </span>
                            <Link
                              href={path}
                              target="_blank"
                              className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-semibold text-white tabular-nums">{count}</span>
                            <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
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
              <div className="py-12 text-center text-slate-500 text-xs">
                No referral sources captured for this time period yet.
              </div>
            ) : (
              <div className="space-y-2">
                {topReferrers.map(([ref, count], index) => {
                  const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                  return (
                    <div
                      key={ref}
                      className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 p-3 hover:border-white/10 transition-colors"
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-sky-500/10 rounded-xl transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                      <div className="relative flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 text-slate-500 font-mono text-[10px]">{index + 1}</span>
                          <span className="font-medium text-slate-200 capitalize truncate">{ref}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-semibold text-white tabular-nums">{count}</span>
                          <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
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
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" /> Device Distribution
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
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center flex flex-col items-center justify-center gap-1"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-200">{label}</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">{percent}%</span>
                    <span className="text-[10px] text-slate-500">{count} views</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Languages & Browsers Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Languages */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-violet-400" /> Languages
              </h4>
              <div className="space-y-2">
                {localeStats.map(([lang, count]) => {
                  const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                  const label = lang === 'EN' ? 'English' : lang === 'KM' ? 'Khmer' : lang === 'ZH' ? 'Chinese' : lang;
                  return (
                    <div key={lang} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{label}</span>
                      <span className="text-slate-400 font-mono">
                        {count} <span className="text-slate-500">({percent}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Top Browsers
              </h4>
              <div className="space-y-2">
                {topBrowsers.map(([browser, count]) => {
                  const percent = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                  return (
                    <div key={browser} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[90px]">{browser}</span>
                      <span className="text-slate-400 font-mono">
                        {count} <span className="text-slate-500">({percent}%)</span>
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
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Recent Visitor Log
              <span className="text-xs font-normal text-slate-400">({searchedLog.length} events)</span>
            </h2>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by path, OS, browser..."
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-[11px] font-semibold uppercase text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Page Path</th>
                <th className="p-3.5">Device</th>
                <th className="p-3.5">Browser & OS</th>
                <th className="p-3.5">Referrer</th>
                <th className="p-3.5">Lang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {searchedLog.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No visitor logs match your search.
                  </td>
                </tr>
              ) : (
                searchedLog.map((event) => (
                  <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(event.created_at)}
                    </td>
                    <td className="p-3.5 font-mono font-medium text-emerald-400 whitespace-nowrap">
                      {event.path}
                    </td>
                    <td className="p-3.5 capitalize text-slate-300 whitespace-nowrap">
                      {event.device_type || 'desktop'}
                    </td>
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {event.browser || 'Other'} <span className="text-slate-600">/</span> {event.os || 'Other'}
                    </td>
                    <td className="p-3.5 text-slate-400 max-w-xs truncate">
                      {event.referrer || 'Direct'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-slate-300 font-mono text-[10px]">
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
