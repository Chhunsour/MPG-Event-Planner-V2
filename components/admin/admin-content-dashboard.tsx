'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Filter,
  ArrowUpDown,
  X,
  ExternalLink,
  Edit3,
  Sparkles,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  Briefcase,
  Layers,
  ChevronRight,
  Eye,
  RotateCcw,
} from 'lucide-react';
import type { Json } from '@/lib/types';
import { localized } from '@/lib/i18n';
import { removeContent } from '@/app/admin/actions';
import { DeleteButton } from './delete-button';

type Kind = 'service' | 'project' | 'blog';

export type DashboardItem = {
  id: number;
  slug: string;
  title: Json;
  description?: Json;
  content?: Json;
  excerpt?: Json;
  cover_image: string | null;
  gallery?: string[] | null;
  is_published: boolean;
  is_featured?: boolean;
  display_order?: number;
  category?: string | null;
  client_name?: string | null;
  location?: string | null;
  event_date?: string | null;
  author_name?: string | null;
  tags?: string[] | null;
  updated_at: string;
  created_at?: string;
  published_at?: string | null;
};

type ViewMode = 'rows' | 'columns';
type DatePreset = 'all' | 'today' | '7d' | '30d' | 'year' | 'custom';
type StatusFilter = 'all' | 'published' | 'draft' | 'featured';
type SortOption = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'order_asc' | 'order_desc';

const config = {
  service: {
    route: 'services',
    table: 'services' as const,
    bucket: 'services',
    singular: 'service',
    plural: 'services',
    icon: Layers,
    publicPrefix: '/services',
  },
  project: {
    route: 'projects',
    table: 'projects' as const,
    bucket: 'projects',
    singular: 'project',
    plural: 'projects',
    icon: Briefcase,
    publicPrefix: '/projects',
  },
  blog: {
    route: 'blog',
    table: 'blog_posts' as const,
    bucket: 'blog',
    singular: 'article',
    plural: 'articles',
    icon: FileText,
    publicPrefix: '/blog',
  },
} as const;

function resolveImageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('/') || path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ygglovzigtcvmsljffqg.supabase.co';
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

function hasLocaleContent(data: Json | undefined, locale: 'en' | 'km' | 'zh'): boolean {
  if (!data) return false;
  if (typeof data === 'object' && !Array.isArray(data)) {
    const val = (data as Record<string, unknown>)[locale];
    return typeof val === 'string' && val.trim().length > 0;
  }
  return false;
}

export function AdminContentDashboard({ kind, items }: { kind: Kind; items: DashboardItem[] }) {
  const conf = config[kind];

  // View Mode: Persistent in localStorage
  const [viewMode, setViewMode] = useState<ViewMode>('rows');
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>(kind === 'blog' ? 'newest' : 'order_asc');

  // Load saved view mode on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`mpg_view_mode_${kind}`) as ViewMode | null;
      if (saved === 'rows' || saved === 'columns') {
        setViewMode(saved);
      }
    } catch {
      // ignore
    }
  }, [kind]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(`mpg_view_mode_${kind}`, mode);
    } catch {
      // ignore
    }
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category && item.category.trim()) set.add(item.category.trim());
      if (Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          if (tag && tag.trim()) set.add(tag.trim());
        });
      }
    });
    return Array.from(set).sort();
  }, [items]);

  // Key KPI stats
  const totalCount = items.length;
  const publishedCount = useMemo(() => items.filter((i) => i.is_published).length, [items]);
  const draftCount = totalCount - publishedCount;
  const featuredCount = useMemo(() => items.filter((i) => i.is_featured).length, [items]);

  // Filter & Sort Pipeline
  const filteredItems = useMemo(() => {
    const now = new Date();
    const query = searchQuery.trim().toLowerCase();

    return items
      .filter((item) => {
        // 1. Search Query Filter
        if (query) {
          const titleEn = localized(item.title, 'en', '').toLowerCase();
          const titleKm = localized(item.title, 'km', '').toLowerCase();
          const titleZh = localized(item.title, 'zh', '').toLowerCase();
          const slug = (item.slug || '').toLowerCase();
          const category = (item.category || '').toLowerCase();
          const client = (item.client_name || '').toLowerCase();
          const author = (item.author_name || '').toLowerCase();
          const location = (item.location || '').toLowerCase();

          const matches =
            titleEn.includes(query) ||
            titleKm.includes(query) ||
            titleZh.includes(query) ||
            slug.includes(query) ||
            category.includes(query) ||
            client.includes(query) ||
            author.includes(query) ||
            location.includes(query);

          if (!matches) return false;
        }

        // 2. Status Filter
        if (statusFilter === 'published' && !item.is_published) return false;
        if (statusFilter === 'draft' && item.is_published) return false;
        if (statusFilter === 'featured' && !item.is_featured) return false;

        // 3. Category Filter
        if (categoryFilter !== 'all') {
          const hasCategory = item.category === categoryFilter;
          const hasTag = Array.isArray(item.tags) && item.tags.includes(categoryFilter);
          if (!hasCategory && !hasTag) return false;
        }

        // 4. Date Filter
        const itemDate = new Date(item.updated_at || item.created_at || now);
        if (datePreset === 'today') {
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (itemDate < startOfToday) return false;
        } else if (datePreset === '7d') {
          const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (itemDate < cutoff) return false;
        } else if (datePreset === '30d') {
          const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (itemDate < cutoff) return false;
        } else if (datePreset === 'year') {
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          if (itemDate < startOfYear) return false;
        } else if (datePreset === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate);
            if (itemDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (itemDate > end) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') {
          const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
          const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
          return dateB - dateA;
        }
        if (sortOption === 'oldest') {
          const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
          const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
          return dateA - dateB;
        }
        if (sortOption === 'title_asc') {
          const titleA = localized(a.title, 'en', '').toLowerCase();
          const titleB = localized(b.title, 'en', '').toLowerCase();
          return titleA.localeCompare(titleB);
        }
        if (sortOption === 'title_desc') {
          const titleA = localized(a.title, 'en', '').toLowerCase();
          const titleB = localized(b.title, 'en', '').toLowerCase();
          return titleB.localeCompare(titleA);
        }
        if (sortOption === 'order_asc') {
          return (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id;
        }
        if (sortOption === 'order_desc') {
          return (b.display_order ?? 0) - (a.display_order ?? 0) || b.id - a.id;
        }
        return 0;
      });
  }, [items, searchQuery, statusFilter, categoryFilter, datePreset, customStartDate, customEndDate, sortOption]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    datePreset !== 'all' ||
    customStartDate ||
    customEndDate
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDatePreset('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-100">
            <conf.icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Total {conf.plural}</span>
            <span className="text-xl font-bold text-slate-900">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Published (Live)</span>
            <span className="text-xl font-bold text-emerald-700">{publishedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 border border-slate-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Draft / Hidden</span>
            <span className="text-xl font-bold text-slate-700">{draftCount}</span>
          </div>
        </div>

        {kind === 'project' && (
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Featured on Home</span>
              <span className="text-xl font-bold text-amber-700">{featuredCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Unified Filtering & View Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-4">
        
        {/* Top Controls Row: Search + View Switcher + Quick Actions */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${conf.plural} by title, slug, tag, client…`}
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200/60"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Side: View Mode Toggle (Row vs Column) + Sorting */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* View Mode Segmented Pill (Column / Row) */}
            <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => handleViewModeChange('rows')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  viewMode === 'rows'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Table / Row List View"
              >
                <List className="w-3.5 h-3.5 text-slate-700" />
                <span>Rows</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('columns')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  viewMode === 'columns'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Cards / Column Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-700" />
                <span>Columns</span>
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-7 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {kind !== 'blog' && <option value="order_asc">Display Order (Asc)</option>}
                {kind !== 'blog' && <option value="order_desc">Display Order (Desc)</option>}
                <option value="newest">Recently Updated</option>
                <option value="oldest">Oldest Updated</option>
                <option value="title_asc">Title (A → Z)</option>
                <option value="title_desc">Title (Z → A)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Second Row: Date Filter + Status Filter + Category Filter */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 justify-between">
          
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'published'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Drafts ({draftCount})
            </button>
            {kind === 'project' && featuredCount > 0 && (
              <button
                type="button"
                onClick={() => setStatusFilter('featured')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === 'featured'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Featured ⭐ ({featuredCount})
              </button>
            )}
          </div>

          {/* Date Range Selector & Category Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Category Dropdown (if present) */}
            {categories.length > 0 && (
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All Categories ({categories.length})</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Preset Selector */}
            <div className="relative inline-flex items-center">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value as DatePreset)}
                className="appearance-none text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">📅 All Time</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Date Range…</option>
              </select>
            </div>

          </div>
        </div>

        {/* Custom Date Range Pickers (Visible when 'custom' is selected) */}
        {datePreset === 'custom' && (
          <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-lg flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-sky-950 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              Filter by Date Range:
            </span>
            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-medium">From:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-medium">To:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-sky-700 hover:text-sky-900 underline font-semibold ml-auto"
              >
                Clear Dates
              </button>
            )}
          </div>
        )}

        {/* Active Filter Chips & Reset All */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-medium">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                  Search: “{searchQuery}”
                  <button type="button" onClick={() => setSearchQuery('')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium capitalize">
                  Status: {statusFilter}
                  <button type="button" onClick={() => setStatusFilter('all')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                  Category: {categoryFilter}
                  <button type="button" onClick={() => setCategoryFilter('all')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {datePreset !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                  Date: {datePreset}
                  <button type="button" onClick={() => setDatePreset('all')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold underline"
            >
              <RotateCcw className="w-3 h-3" /> Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900 font-bold">{filteredItems.length}</strong> of{' '}
          <strong className="text-slate-900 font-bold">{totalCount}</strong> {conf.plural}
        </span>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
          View: {viewMode === 'rows' ? 'Table Rows' : 'Card Columns'}
        </span>
      </div>

      {/* 3. Empty States */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No {conf.plural} found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {hasActiveFilters
              ? 'No items matched your current search and filter criteria. Try resetting your filters.'
              : `You have not created any ${conf.plural} yet.`}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear all filters
            </button>
          ) : (
            <Link
              href={`/admin/${conf.route}/new`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-xs"
            >
              + Create new {conf.singular}
            </Link>
          )}
        </div>
      ) : viewMode === 'rows' ? (
        
        /* 4. ROW / TABLE LIST VIEW */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 pl-4 pr-3 w-16 text-center">Cover</th>
                  <th className="py-3.5 px-3 min-w-[200px]">Title & Slug</th>
                  <th className="py-3.5 px-3">Languages</th>
                  <th className="py-3.5 px-3">Status</th>
                  {kind !== 'blog' && <th className="py-3.5 px-3 text-center">Position</th>}
                  {kind === 'project' && <th className="py-3.5 px-3">Event Date / Client</th>}
                  {kind === 'blog' && <th className="py-3.5 px-3">Author</th>}
                  <th className="py-3.5 px-3">Last Updated</th>
                  <th className="py-3.5 pl-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const titleEn = localized(item.title, 'en', 'Untitled');
                  const image = resolveImageUrl(conf.bucket, item.cover_image);
                  const hasEn = hasLocaleContent(item.title, 'en');
                  const hasKm = hasLocaleContent(item.title, 'km');
                  const hasZh = hasLocaleContent(item.title, 'zh');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Cover Thumbnail */}
                      <td className="py-3 pl-4 pr-3 text-center">
                        <div className="relative w-12 h-9 rounded-md overflow-hidden bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center flex-shrink-0">
                          {image ? (
                            <Image src={image} alt="" fill sizes="48px" className="object-cover" />
                          ) : (
                            <span className="text-[9px] text-slate-400 font-bold">No img</span>
                          )}
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                          <Link href={`/admin/${conf.route}/${item.id}/edit`}>{titleEn}</Link>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <span>/{conf.route}/{item.slug}</span>
                          {item.category && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-sans text-[10px] font-semibold">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Multilingual Translation Chips */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              hasEn ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-400'
                            }`}
                            title={hasEn ? 'English translation ready' : 'English missing'}
                          >
                            EN
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              hasKm ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                            }`}
                            title={hasKm ? 'Khmer translation ready' : 'Khmer missing'}
                          >
                            KM
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              hasZh ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-400'
                            }`}
                            title={hasZh ? 'Chinese translation ready' : 'Chinese missing'}
                          >
                            ZH
                          </span>
                        </div>
                      </td>

                      {/* Published Status Pill */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.is_published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                        {item.is_featured && (
                          <span className="ml-1.5 inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            ⭐ Home
                          </span>
                        )}
                      </td>

                      {/* Display Order Position */}
                      {kind !== 'blog' && (
                        <td className="py-3 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[11px]">
                            #{item.display_order ?? 0}
                          </span>
                        </td>
                      )}

                      {/* Project Event Date & Client */}
                      {kind === 'project' && (
                        <td className="py-3 px-3 text-slate-600">
                          <div className="font-semibold text-slate-800">{item.client_name || '—'}</div>
                          <div className="text-[11px] text-slate-400">
                            {item.event_date ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.event_date)) : item.location || '—'}
                          </div>
                        </td>
                      )}

                      {/* Blog Author */}
                      {kind === 'blog' && (
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {item.author_name || 'MPG Editorial Team'}
                        </td>
                      )}

                      {/* Last Updated Date */}
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        <div className="font-medium text-slate-700">
                          {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                            new Date(item.updated_at || item.created_at || Date.now())
                          )}
                        </div>
                      </td>

                      {/* Quick Action Links */}
                      <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Link
                            href={`${conf.publicPrefix}/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="View Public Page (Opens in new tab)"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/${conf.route}/${item.id}/edit`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </Link>
                          <DeleteButton
                            action={removeContent.bind(null, conf.table, String(item.id))}
                            itemName={titleEn}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (

        /* 5. COLUMN / CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const titleEn = localized(item.title, 'en', 'Untitled');
            const descEn = localized(item.description || item.excerpt, 'en', '');
            const image = resolveImageUrl(conf.bucket, item.cover_image);
            const hasEn = hasLocaleContent(item.title, 'en');
            const hasKm = hasLocaleContent(item.title, 'km');
            const hasZh = hasLocaleContent(item.title, 'zh');

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
              >
                {/* Card Image Header */}
                <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden border-b border-slate-200/80">
                  {image ? (
                    <Image
                      src={image}
                      alt={titleEn}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                      No cover image
                    </div>
                  )}

                  {/* Overlaid Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs backdrop-blur-xs ${
                        item.is_published
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-slate-800/80 text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.is_published ? 'bg-white' : 'bg-slate-400'}`} />
                      {item.is_published ? 'Published' : 'Draft'}
                    </span>

                    <div className="flex items-center gap-1">
                      {item.is_featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                          ⭐ Featured
                        </span>
                      )}
                      {kind !== 'blog' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/90 text-slate-800 shadow-xs">
                          #{item.display_order ?? 0}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex-1 flex flex-col">
                  
                  {/* Category & Tags */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    {item.category ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {item.category}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">/{conf.route}/{item.slug}</span>
                    )}

                    {/* Language Badges */}
                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-bold px-1 rounded ${hasEn ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-400'}`}>EN</span>
                      <span className={`text-[9px] font-bold px-1 rounded ${hasKm ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>KM</span>
                      <span className={`text-[9px] font-bold px-1 rounded ${hasZh ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-400'}`}>ZH</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-sky-600 transition-colors mb-2 line-clamp-2">
                    <Link href={`/admin/${conf.route}/${item.id}/edit`}>{titleEn}</Link>
                  </h3>

                  {/* Short Description */}
                  {descEn && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                      {descEn}
                    </p>
                  )}

                  {/* Additional Metadata Info */}
                  <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {kind === 'project' && item.client_name ? `Client: ${item.client_name}` : kind === 'blog' && item.author_name ? `By ${item.author_name}` : `Updated ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(item.updated_at || Date.now()))}`}
                    </span>
                    <Link
                      href={`${conf.publicPrefix}/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-slate-700 inline-flex items-center gap-0.5 font-medium"
                    >
                      <span>Preview</span> <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>

                </div>

                {/* Card Action Buttons Footer */}
                <div className="bg-slate-50 border-t border-slate-200/80 px-4 py-2.5 flex items-center justify-between gap-2">
                  <DeleteButton
                    action={removeContent.bind(null, conf.table, String(item.id))}
                    itemName={titleEn}
                  />
                  <Link
                    href={`/admin/${conf.route}/${item.id}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <Edit3 className="w-3 h-3" /> Edit {conf.singular}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
