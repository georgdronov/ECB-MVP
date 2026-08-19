const requests = new Map<string, { count: number; resetAt: number }>();
const windowMs = 60_000;
const maxRequests = 20;

export function isRateLimited(key: string) {
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > maxRequests;
}
