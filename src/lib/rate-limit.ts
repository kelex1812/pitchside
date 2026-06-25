// src/lib/rate-limit.ts — Simple in-memory rate limiter for API routes.
// Works for self-hosted deployments. On Vercel serverless, rate limits
// are per-function-instance (multiple instances may exist).
// This provides basic abuse protection; for production, use Vercel Rate Limit or Upstash.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // per window per IP

function getEntry(key: string): RateLimitEntry {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, entry);
  }

  return entry;
}

/**
 * Check if a request is rate-limited.
 * @returns { allowed: boolean, resetAt: number }
 */
export function checkRateLimit(ip: string): { allowed: boolean; resetAt: number } {
  const entry = getEntry(ip);
  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return { allowed: false, resetAt: entry.resetAt };
  }

  return { allowed: true, resetAt: entry.resetAt };
}

/**
 * Cleanup old entries to prevent memory leaks.
 * Run periodically (e.g., in a cron job or on each request).
 */
export function cleanup(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}
