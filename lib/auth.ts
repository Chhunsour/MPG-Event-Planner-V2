import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function currentAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('id, display_name, is_admin').eq('id', user.id).maybeSingle();
  if (!profile?.is_admin) return null;
  return { user, profile };
}

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

