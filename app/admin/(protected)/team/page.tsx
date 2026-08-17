import { AdminPageHeader } from '@/components/admin/admin-page-header';
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
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Access Control"
        title="Crew & Team Management"
        description="Invite team members, assign permissions, and control dashboard access."
      />

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#1e9a2a] text-sm font-semibold rounded-2xl" role="alert">
          ✓ Crew invitation sent successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Invite New Crew Member Section */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Invite New Crew Member</h2>
        <form action={inviteCrew} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="colleague@mpgeventplanner.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Role & Permissions
            </label>
            <select
              name="role"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            >
              <option value="editor">Editor — Manage Services, Projects, Blog & Media</option>
              <option value="viewer">Support / Viewer — View Quotations & Dashboard</option>
              {isOwner && <option value="admin">Admin — Full Content & Team Management</option>}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Send Invitation ✉️
          </button>
        </form>
      </section>

      {/* Pending Invitations Section */}
      {invites.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Pending Invitations ({invites.length})</h2>
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200/80">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Sent Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{invite.email}</td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                        {invite.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {new Date(invite.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <form action={revokeInvitation} className="inline-block">
                        <input type="hidden" name="invite_id" value={invite.id} />
                        <button
                          type="submit"
                          className="text-xs text-rose-700 hover:text-rose-900 font-semibold px-3 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
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
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Active Crew Members ({members.length})</h2>
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200/80">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => {
                const memberRole = member.role || (member.is_admin ? 'owner' : 'editor');
                const memberStatus = member.status || 'active';
                const isSelf = member.id === currentProfile.id;
                const isTargetOwner = memberRole === 'owner';

                return (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{member.display_name || 'Unnamed Crew Member'}</span>
                        {isSelf && <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 font-semibold px-2 py-0.5 rounded-md">(You)</span>}
                      </div>
                      <span className="text-xs font-mono text-slate-400 block truncate max-w-xs">{member.id}</span>
                    </td>
                    <td className="p-4">
                      <form action={updateCrewRole} className="inline-flex items-center gap-2">
                        <input type="hidden" name="member_id" value={member.id} />
                        <select
                          name="role"
                          defaultValue={memberRole}
                          disabled={isSelf || (!isOwner && isTargetOwner)}
                          className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400 disabled:opacity-50"
                        >
                          <option value="owner">Owner (Full Control)</option>
                          <option value="admin">Admin (Dashboard Access)</option>
                          <option value="editor">Editor (Content & Media)</option>
                          <option value="viewer">Viewer (Quotes & Overview)</option>
                        </select>
                        {!isSelf && (isOwner || !isTargetOwner) && (
                          <button
                            type="submit"
                            className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          >
                            Update
                          </button>
                        )}
                      </form>
                    </td>
                    <td className="p-4">
                      {memberStatus === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-[#1e9a2a] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1e9a2a]" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Disabled
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
                              className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                                memberStatus === 'active'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-[#1e9a2a] border-emerald-200'
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
                                className="text-xs px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold transition-colors cursor-pointer"
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
