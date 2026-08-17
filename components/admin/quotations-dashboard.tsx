'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Filter,
  ArrowUpDown,
  X,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  Inbox,
  Building,
} from 'lucide-react';

export type QuotationItem = {
  id: string | number;
  reference_code: string;
  customer_name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  event_type?: string | null;
  event_location?: string | null;
  event_date?: string | null;
  guest_count?: string | null;
  budget_range?: string | null;
  services?: string[] | null;
  message?: string | null;
  status: 'new' | 'contacted' | 'completed' | 'archived';
  is_read?: boolean;
  internal_notes?: string | null;
  created_at: string;
  updated_at?: string;
};

type ViewMode = 'rows' | 'columns';
type DatePreset = 'all' | 'today' | '7d' | '30d' | 'year' | 'custom';
type StatusFilter = 'all' | 'new' | 'contacted' | 'completed' | 'archived';
type SortOption = 'newest' | 'oldest' | 'event_date' | 'name_asc';

export function QuotationsDashboard({ initialItems }: { initialItems: QuotationItem[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>('rows');
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Load view preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mpg_view_mode_quotations') as ViewMode | null;
      if (saved === 'rows' || saved === 'columns') {
        setViewMode(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('mpg_view_mode_quotations', mode);
    } catch {
      // ignore
    }
  };

  // Distinct Event Types
  const eventTypes = useMemo(() => {
    const set = new Set<string>();
    initialItems.forEach((item) => {
      if (item.event_type && item.event_type.trim()) set.add(item.event_type.trim());
    });
    return Array.from(set).sort();
  }, [initialItems]);

  // Counts
  const totalCount = initialItems.length;
  const newCount = useMemo(() => initialItems.filter((i) => i.status === 'new').length, [initialItems]);
  const contactedCount = useMemo(() => initialItems.filter((i) => i.status === 'contacted').length, [initialItems]);
  const completedCount = useMemo(() => initialItems.filter((i) => i.status === 'completed').length, [initialItems]);
  const archivedCount = useMemo(() => initialItems.filter((i) => i.status === 'archived').length, [initialItems]);

  // Filter & Sort Pipeline
  const filteredItems = useMemo(() => {
    const now = new Date();
    const query = searchQuery.trim().toLowerCase();

    return initialItems
      .filter((item) => {
        // Search
        if (query) {
          const name = (item.customer_name || '').toLowerCase();
          const email = (item.email || '').toLowerCase();
          const phone = (item.phone || '').toLowerCase();
          const ref = (item.reference_code || '').toLowerCase();
          const comp = (item.company_name || '').toLowerCase();
          const type = (item.event_type || '').toLowerCase();
          const loc = (item.event_location || '').toLowerCase();

          const matches =
            name.includes(query) ||
            email.includes(query) ||
            phone.includes(query) ||
            ref.includes(query) ||
            comp.includes(query) ||
            type.includes(query) ||
            loc.includes(query);

          if (!matches) return false;
        }

        // Status
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;

        // Event Type
        if (eventTypeFilter !== 'all' && item.event_type !== eventTypeFilter) return false;

        // Date
        const itemDate = new Date(item.created_at || now);
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
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortOption === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortOption === 'event_date') {
          const dateA = a.event_date ? new Date(a.event_date).getTime() : Infinity;
          const dateB = b.event_date ? new Date(b.event_date).getTime() : Infinity;
          return dateA - dateB;
        }
        if (sortOption === 'name_asc') {
          return (a.customer_name || '').localeCompare(b.customer_name || '');
        }
        return 0;
      });
  }, [initialItems, searchQuery, statusFilter, eventTypeFilter, datePreset, customStartDate, customEndDate, sortOption]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    statusFilter !== 'all' ||
    eventTypeFilter !== 'all' ||
    datePreset !== 'all' ||
    customStartDate ||
    customEndDate
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setEventTypeFilter('all');
    setDatePreset('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const getStatusBadge = (status: QuotationItem['status']) => {
    switch (status) {
      case 'new':
        return {
          label: 'New Inquiry',
          className: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500 animate-pulse',
        };
      case 'contacted':
        return {
          label: 'Contacted',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'completed':
        return {
          label: 'Completed / Won',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'archived':
        return {
          label: 'Archived',
          className: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-100">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Total Requests</span>
            <span className="text-xl font-bold text-slate-900">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-100">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">New / Pending</span>
            <span className="text-xl font-bold text-rose-600">{newCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Contacted</span>
            <span className="text-xl font-bold text-amber-700">{contactedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Completed / Won</span>
            <span className="text-xl font-bold text-emerald-700">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Unified Filtering & View Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-4">
        
        {/* Top Controls Row: Search + View Switcher + Sorting */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, ref code, email, phone, location…"
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
                <option value="newest">Newest Request First</option>
                <option value="oldest">Oldest Request First</option>
                <option value="event_date">Event Date (Soonest)</option>
                <option value="name_asc">Customer Name (A → Z)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Second Row: Date Filter + Status Filter + Event Type Filter */}
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
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('new')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'new'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
              }`}
            >
              New ({newCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('contacted')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'contacted'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              Contacted ({contactedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              Completed ({completedCount})
            </button>
            {archivedCount > 0 && (
              <button
                type="button"
                onClick={() => setStatusFilter('archived')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === 'archived'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Archived ({archivedCount})
              </button>
            )}
          </div>

          {/* Date Range Selector & Event Type Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Event Type Dropdown */}
            {eventTypes.length > 0 && (
              <div className="relative">
                <select
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All Event Types ({eventTypes.length})</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
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

        {/* Custom Date Range Pickers */}
        {datePreset === 'custom' && (
          <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-lg flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-sky-950 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              Filter by Date Submitted:
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

        {/* Active Filters Bar */}
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

              {eventTypeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                  Event: {eventTypeFilter}
                  <button type="button" onClick={() => setEventTypeFilter('all')} className="hover:text-rose-600">
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
          <strong className="text-slate-900 font-bold">{totalCount}</strong> inquiries
        </span>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
          View: {viewMode === 'rows' ? 'Table Rows' : 'Card Columns'}
        </span>
      </div>

      {/* 3. Empty States */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {hasActiveFilters ? 'No inquiries match filters' : 'Inbox is clear'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {hasActiveFilters
              ? 'No quotation inquiries matched your search and filter criteria. Try resetting your filters.'
              : 'New quotation requests will appear here as soon as clients submit the quote form on the website.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear all filters
            </button>
          )}
        </div>
      ) : viewMode === 'rows' ? (

        /* 4. ROW / TABLE LIST VIEW */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 pl-4 pr-3">Ref & Customer</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3">Event Brief</th>
                  <th className="py-3.5 px-3">Event Date</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Submitted</th>
                  <th className="py-3.5 pl-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const badge = getStatusBadge(item.status);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Ref & Customer */}
                      <td className="py-3 pl-4 pr-3">
                        <div className="font-mono font-bold text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 inline-block mb-1">
                          {item.reference_code}
                        </div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                          <Link href={`/admin/quotations/${item.id}`}>{item.customer_name}</Link>
                        </div>
                        {item.company_name && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{item.company_name}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact Channels */}
                      <td className="py-3 px-3">
                        <div className="text-slate-700 font-medium flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`mailto:${item.email}`} className="hover:underline hover:text-sky-600">
                            {item.email}
                          </a>
                        </div>
                        {item.phone && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <a href={`tel:${item.phone}`} className="hover:underline">
                              {item.phone}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Event Brief */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">
                          {item.event_type || 'Event type not specified'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.event_location || 'Location not specified'}</span>
                        </div>
                        {(item.budget_range || item.guest_count) && (
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                            {item.guest_count && <span>👥 {item.guest_count} guests</span>}
                            {item.budget_range && <span>💰 {item.budget_range}</span>}
                          </div>
                        )}
                      </td>

                      {/* Event Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        {item.event_date ? (
                          <div className="font-medium">
                            {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.event_date))}
                          </div>
                        ) : (
                          <span className="text-slate-400">Not set</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        <div>
                          {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                            new Date(item.created_at)
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/quotations/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <span>Review</span> <ChevronRight className="w-3 h-3" />
                        </Link>
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
            const badge = getStatusBadge(item.status);

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Reference & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-100">
                      {item.reference_code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Customer Name & Company */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-sky-600 transition-colors mb-0.5">
                    <Link href={`/admin/quotations/${item.id}`}>{item.customer_name}</Link>
                  </h3>
                  {item.company_name && (
                    <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.company_name}</span>
                    </p>
                  )}

                  {/* Event Brief Card Specs */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-100 mb-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">{item.event_type || 'Custom Event'}</span>
                    </div>
                    {item.event_location && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{item.event_location}</span>
                      </div>
                    )}
                    {item.event_date && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>
                          Target: {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.event_date))}
                        </span>
                      </div>
                    )}
                    {(item.budget_range || item.guest_count) && (
                      <div className="flex flex-wrap gap-2 pt-1 mt-1 border-t border-slate-200/60 text-[11px] font-semibold text-slate-700">
                        {item.guest_count && <span>👥 {item.guest_count} guests</span>}
                        {item.budget_range && <span>💰 {item.budget_range}</span>}
                      </div>
                    )}
                  </div>

                  {/* Contact Snippet */}
                  <div className="text-xs text-slate-500 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <a href={`mailto:${item.email}`} className="hover:underline hover:text-sky-600 truncate">
                        {item.email}
                      </a>
                    </div>
                    {item.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <a href={`tel:${item.phone}`} className="hover:underline truncate">
                          {item.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Submitted Time & Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                      new Date(item.created_at)
                    )}
                  </span>
                  <Link
                    href={`/admin/quotations/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <span>Manage Brief</span> <ChevronRight className="w-3 h-3" />
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
