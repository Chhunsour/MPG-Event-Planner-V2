type MemoryStore = Map<string, { count: number; resetAt: number }>;

const store: MemoryStore = new Map();

export function rateLimit({
  key,
  limit = 5,
  windowMs = 60 * 1000,
}: {
  key: string;
  limit?: number;
  windowMs?: number;
}): { success: boolean; limit: number; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  store.set(key, entry);
  return { success: true, limit, remaining: limit - entry.count, resetAt: entry.resetAt };
}
