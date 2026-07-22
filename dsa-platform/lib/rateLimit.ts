// Server-only, in-memory sliding-window rate limiter. Good enough to stop a
// single signed-in account from hammering a paid AI route — not a substitute
// for a real distributed limiter (resets per server instance/deploy), but
// meaningfully raises the bar over "no limit at all".
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}
