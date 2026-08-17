import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { requireCrewRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ActivityLogPage() {
  await requireCrewRole(['owner', 'admin']);
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Security & Audit"
        title="Admin Activity & Audit Trail"
        description="Recent administrative actions, content updates, security events, and crew modifications."
      />

      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200/80">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target Type</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(!logs || logs.length === 0) ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No activity logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 font-semibold text-slate-900">{log.user_email || 'System / Crew'}</td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{log.target_type}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate font-mono">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
