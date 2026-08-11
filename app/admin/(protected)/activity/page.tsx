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
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Activity & Audit Trail</h1>
        <p className="text-slate-400 text-sm mt-1">
          Recent administrative actions, content updates, and crew modifications.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-xs font-semibold uppercase text-slate-400 border-b border-white/10">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target Type</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(!logs || logs.length === 0) ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                  No activity logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 font-medium text-white">{log.user_email || 'System / Crew'}</td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400">{log.target_type}</td>
                  <td className="p-4 text-xs text-slate-400 max-w-xs truncate font-mono">
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
