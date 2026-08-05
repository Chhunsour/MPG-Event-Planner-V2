import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";

interface QuotationRequest {
  id: number;
  reference: string;
  customer_name: string;
  company_name: string | null;
  phone: string;
  event_type: string;
  event_location: string;
  language: string;
  status: string;
  created_at: string;
}

interface MessagesIndexProps {
  requests: {
    data: QuotationRequest[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  statuses: string[];
}

export default function MessagesIndex({ requests, statuses }: MessagesIndexProps) {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState(params.get("status") ?? "");

  return (
    <AdminLayout title="Messages">
      {/* Filters */}
      <div className="mb-5 border border-line bg-paper p-4">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-50">
            <label htmlFor="q" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
              Search
            </label>
            <input
              id="q"
              name="q"
              type="search"
              value={q}
              placeholder="Name, company, phone or email"
              onChange={(e) => setQ(e.target.value)}
              className="w-full border border-line-strong px-3 py-2 text-sm text-ink-text outline-none focus:border-brand"
            />
          </div>
          <div className="min-w-40">
            <label htmlFor="status" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none border border-line-strong bg-paper px-3 py-2 pr-8 text-sm text-ink-text outline-none focus:border-brand"
            >
              <option value="">Any status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="border border-line-strong px-4 py-2 text-xs font-semibold text-muted hover:bg-paper-tint">
              Filter
            </button>
            <Link href="/admin/messages" className="border border-line-strong px-4 py-2 text-xs font-semibold text-muted hover:bg-paper-tint">
              Reset
            </Link>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="border border-line bg-paper">
        {requests.data.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-faint">No quotation requests match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-tint text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {requests.data.map((req) => (
                  <tr key={req.id} className="border-b border-line last:border-0 hover:bg-paper-tint">
                    <td className="px-4 py-3 font-mono text-xs text-muted">{req.reference}</td>
                    <td className="px-4 py-3">
                      <strong className="block text-ink-text">{req.customer_name}</strong>
                      <span className="text-xs text-faint">
                        {req.phone}
                        {req.company_name && ` · ${req.company_name}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{req.event_type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-muted">{req.event_location}</td>
                    <td className="px-4 py-3 text-xs font-bold text-muted">{req.language.toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-faint">
                      {new Date(req.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/messages/${req.id}`}
                        className="border border-line-strong px-3 py-1.5 text-xs font-semibold text-muted hover:bg-paper-tint"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination links={requests.links} />
    </AdminLayout>
  );
}
