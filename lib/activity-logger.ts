import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/types';

export type LogActivityParams = {
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: Record<string, unknown> | null;
};

export async function logActivity({ action, targetType, targetId, details }: LogActivityParams) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc('log_activity', {
      p_action: action,
      p_target_type: targetType,
      p_target_id: targetId ?? null,
      p_details: (details ?? {}) as Json,
    });

    if (error) {
      console.error('Failed to log activity via RPC:', error.message);
    }
  } catch (err) {
    console.error('Error logging admin activity:', err);
  }
}
