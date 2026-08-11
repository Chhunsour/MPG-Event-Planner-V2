import { requireCrewRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { inviteCrew, updateCrewRole, toggleCrewStatus, removeCrew, revokeInvitation } from '@/app/admin/team-actions';

export const dynamic = 'force-dynamic';

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const { profile: currentProfile } = await requireCrewRole(['owner', 'admin']);
  const { success, error } = await searchParams;

  const supabase = await createClient();

  const [membersResult, invitesResult] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('crew_invitations').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
  ]);

  const members = membersResult.data ?? [];
  const invites = invitesResult.data ?? [];

  const isOwner = currentProfile.role === 'owner';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Crew & Team Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Invite team members, assign permissions, and control dashboard access.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-sm rounded-xl" role="alert">
          ✓ Crew invitation sent successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-500/30 text-red-300 text-sm rounded-xl" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Invite New Crew Member Section */}
      <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Invite New Crew Member</h2>
        <form action={inviteCrew} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="colleague@mpgeventplanner.com"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Role & Permissions
            </label>
            <select
              name="role"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
            >
              <option value="editor">Editor — Manage Services, Projects, Blog & Media</option>
              <option value="viewer">Support / Viewer — View Quotations & Dashboard</option>
              {isOwner && <option value="admin">Admin — Full Content & Team Management</option>}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Send Invitation ✉️
          </button>
        </form>
      </section>

      {/* Pending Invitations Section */}
      {invites.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Pending Invitations ({invites.length})</h2>
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs font-semibold uppercase text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Sent Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-medium text-white">{invite.email}</td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                        {invite.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(invite.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <form action={revokeInvitation} className="inline-block">
                        <input type="hidden" name="invite_id" value={invite.id} />
                        <button
                          type="submit"
                          className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition-colors"
                        >
                          Revoke
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Active Crew Members List */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Active Crew Members ({members.length})</h2>
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-xs font-semibold uppercase text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member) => {
                const memberRole = member.role || (member.is_admin ? 'owner' : 'editor');
                const memberStatus = member.status || 'active';
                const isSelf = member.id === currentProfile.id;
                const isTargetOwner = memberRole === 'owner';

                return (
                  <tr key={member.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{member.display_name || 'Unnamed Crew Member'}</span>
                        {isSelf && <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-md">(You)</span>}
                      </div>
                      <span className="text-xs font-mono text-slate-500 block truncate max-w-xs">{member.id}</span>
                    </td>
                    <td className="p-4">
                      <form action={updateCrewRole} className="inline-flex items-center gap-2">
                        <input type="hidden" name="member_id" value={member.id} />
                        <select
                          name="role"
                          defaultValue={memberRole}
                          disabled={isSelf || (!isOwner && isTargetOwner)}
                          className="px-3 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 disabled:opacity-60"
                        >
                          <option value="owner">Owner (Full Control)</option>
                          <option value="admin">Admin (Dashboard Access)</option>
                          <option value="editor">Editor (Content & Media)</option>
                          <option value="viewer">Viewer (Quotes & Overview)</option>
                        </select>
                        {!isSelf && (isOwner || !isTargetOwner) && (
                          <button
                            type="submit"
                            className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-white/10 transition-colors"
                          >
                            Update
                          </button>
                        )}
                      </form>
                    </td>
                    <td className="p-4">
                      {memberStatus === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!isSelf && (isOwner || !isTargetOwner) && (
                        <div className="inline-flex items-center gap-2">
                          <form action={toggleCrewStatus}>
                            <input type="hidden" name="member_id" value={member.id} />
                            <input type="hidden" name="status" value={memberStatus === 'active' ? 'disabled' : 'active'} />
                            <button
                              type="submit"
                              className={`text-xs px-3 py-1 rounded-lg border font-medium transition-colors ${
                                memberStatus === 'active'
                                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              }`}
                            >
                              {memberStatus === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </form>

                          {isOwner && (
                            <form action={removeCrew}>
                              <input type="hidden" name="member_id" value={member.id} />
                              <button
                                type="submit"
                                className="text-xs px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
