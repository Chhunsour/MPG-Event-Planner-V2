import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
if (!url || !key || !email) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL, temporary SUPABASE_SERVICE_ROLE_KEY, and ADMIN_EMAIL.');

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, { redirectTo: (process.env.NEXT_PUBLIC_SITE_URL || 'https://mpgeventplanner.com') + '/admin/login' });
if (error || !data.user) throw error || new Error('Admin invitation failed.');
const profile = await supabase.from('profiles').update({ is_admin: true, display_name: email }).eq('id', data.user.id);
if (profile.error) throw profile.error;
console.log('Admin invitation sent. No password was created or stored by this script.');
