import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseEnv } from '@/lib/env';
import type { Database } from '@/lib/types';

export function createPublicClient(): SupabaseClient<Database> {
  const env = supabaseEnv();
  return createSupabaseClient<Database>(env.url, env.key);
}
