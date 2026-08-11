'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireCrewRole, requireOwner, type CrewRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity-logger';

const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();

export async function inviteCrew(formData: FormData) {
  const { profile } = await requireCrewRole(['owner', 'admin']);

  const schema = z.object({
    email: z.string().email(),
    role: z.enum(['admin', 'editor', 'viewer']),
  });

  const parsed = schema.safeParse({
    email: text(formData, 'email').toLowerCase(),
    role: text(formData, 'role'),
  });

  if (!parsed.success) {
    redirect('/admin/team?error=Please+provide+a+valid+email+and+role.');
  }

  const { email, role } = parsed.data;

  if (role === 'admin' && profile.role !== 'owner') {
    redirect('/admin/team?error=Only+the+Owner+can+invite+Admin+crew+members.');
  }

  const supabase = await createClient();

  const { data: existingInvite } = await supabase
    .from('crew_invitations')
    .select('id, status')
    .eq('email', email)
    .eq('status', 'pending')
    .maybeSingle();

  if (existingInvite) {
    redirect('/admin/team?error=A+pending+invitation+has+already+been+sent+to+this+email.');
  }

  const token = crypto.randomUUID().replace(/-/g, '');

  const { error: inviteError } = await supabase.from('crew_invitations').insert({
    email,
    role,
    token,
    invited_by: profile.id,
    status: 'pending',
  });

  if (inviteError) {
    console.error('Invite insert error:', inviteError);
    redirect('/admin/team?error=Failed+to+create+crew+invitation.+Please+try+again.');
  }

  await logActivity({
    action: 'crew_invited',
    targetType: 'crew_invitation',
    details: { email, role },
  });

  redirect('/admin/team?success=invited');
}

export async function updateCrewRole(formData: FormData) {
  const { profile } = await requireCrewRole(['owner', 'admin']);

  const memberId = text(formData, 'member_id');
  const newRole = text(formData, 'role') as CrewRole;

  if (!['owner', 'admin', 'editor', 'viewer'].includes(newRole)) {
    throw new Error('Invalid role specified.');
  }

  if (newRole === 'owner' && profile.role !== 'owner') {
    throw new Error('Only an existing Owner can assign the Owner role.');
  }

  const supabase = await createClient();

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', memberId)
    .single();

  if (targetProfile?.role === 'owner' && profile.role !== 'owner') {
    throw new Error('Only Owners can modify an Owner profile.');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', memberId);

  if (error) throw error;

  await logActivity({
    action: 'role_updated',
    targetType: 'profile',
    targetId: memberId,
    details: { newRole },
  });

  redirect('/admin/team');
}

export async function toggleCrewStatus(formData: FormData) {
  const { profile } = await requireCrewRole(['owner', 'admin']);

  const memberId = text(formData, 'member_id');
  const targetStatus = text(formData, 'status') === 'disabled' ? 'disabled' : 'active';

  const supabase = await createClient();

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', memberId)
    .single();

  if (targetProfile?.role === 'owner' && profile.role !== 'owner') {
    throw new Error('Only Owners can change Owner account status.');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status: targetStatus })
    .eq('id', memberId);

  if (error) throw error;

  await logActivity({
    action: targetStatus === 'disabled' ? 'crew_deactivated' : 'crew_activated',
    targetType: 'profile',
    targetId: memberId,
  });

  redirect('/admin/team');
}

export async function removeCrew(formData: FormData) {
  const { profile } = await requireOwner();

  const memberId = text(formData, 'member_id');
  if (memberId === profile.id) {
    throw new Error('You cannot delete your own account.');
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', memberId);

  if (error) throw error;

  await logActivity({
    action: 'crew_removed',
    targetType: 'profile',
    targetId: memberId,
  });

  redirect('/admin/team');
}

export async function revokeInvitation(formData: FormData) {
  await requireCrewRole(['owner', 'admin']);
  const inviteId = text(formData, 'invite_id');

  const supabase = await createClient();
  const { error } = await supabase
    .from('crew_invitations')
    .update({ status: 'revoked' })
    .eq('id', inviteId);

  if (error) throw error;

  await logActivity({
    action: 'invitation_revoked',
    targetType: 'crew_invitation',
    targetId: inviteId,
  });

  redirect('/admin/team');
}
