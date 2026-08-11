import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export type CrewRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type CrewStatus = 'active' | 'invited' | 'disabled';

export type CrewProfile = {
  id: string;
  display_name: string | null;
  is_admin: boolean;
  role: CrewRole;
  status: CrewStatus;
  invited_by: string | null;
  invited_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CurrentCrewUser = {
  user: User;
  profile: CrewProfile;
};

export async function getCurrentCrewUser(): Promise<CurrentCrewUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) return null;

    const role: CrewRole = (profile.role as CrewRole) || (profile.is_admin ? 'owner' : 'editor');
    const status: CrewStatus = (profile.status as CrewStatus) || 'active';

    if (status !== 'active') return null;

    const crewProfile: CrewProfile = {
      id: profile.id,
      display_name: profile.display_name,
      is_admin: profile.is_admin || role === 'owner' || role === 'admin',
      role,
      status,
      invited_by: profile.invited_by ?? null,
      invited_at: profile.invited_at ?? null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    return { user, profile: crewProfile };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error && String((error as { digest: string }).digest).includes('DYNAMIC_SERVER_USAGE')) {
      throw error;
    }
    console.error('Error fetching current crew user:', error);
    return null;
  }
}

export async function requireCrewRole(allowedRoles: CrewRole[]): Promise<CurrentCrewUser> {
  const crew = await getCurrentCrewUser();
  if (!crew) {
    redirect('/admin/login');
  }

  if (!allowedRoles.includes(crew.profile.role)) {
    redirect('/admin?error=unauthorized');
  }

  return crew;
}

export async function currentAdmin(): Promise<CurrentCrewUser | null> {
  const crew = await getCurrentCrewUser();
  if (!crew) return null;
  if (!['owner', 'admin'].includes(crew.profile.role)) return null;
  return crew;
}

export async function requireAdmin(): Promise<CurrentCrewUser> {
  return requireCrewRole(['owner', 'admin']);
}

export async function requireOwner(): Promise<CurrentCrewUser> {
  return requireCrewRole(['owner']);
}

export function canManageContent(role: CrewRole): boolean {
  return ['owner', 'admin', 'editor'].includes(role);
}

export function canManageTeam(role: CrewRole): boolean {
  return ['owner', 'admin'].includes(role);
}

export function canManageSettings(role: CrewRole): boolean {
  return ['owner', 'admin'].includes(role);
}

export function canDeleteContent(role: CrewRole): boolean {
  return ['owner', 'admin'].includes(role);
}
