import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseEnv } from '@/lib/env';
import type { Database } from '@/lib/types';

let client: SupabaseClient<Database> | undefined;

export function createClient() {
  if (client) return client;
  const env = supabaseEnv();
  client = createBrowserClient<Database>(env.url, env.key);
  return client;
}

