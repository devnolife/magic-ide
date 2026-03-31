interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Auto-cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  ip: string,
  { maxAttempts = 5, windowMs = 60 * 1000 }: { maxAttempts?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = ip;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 0, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts, resetIn: Math.ceil(windowMs / 1000) };
  }

  const remaining = Math.max(0, maxAttempts - entry.count);
  const resetIn = Math.ceil((entry.resetAt - now) / 1000);

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetIn };
  }

  return { allowed: true, remaining: remaining, resetIn };
}

export function recordFailedAttempt(
  ip: string,
  { windowMs = 60 * 1000 }: { windowMs?: number } = {}
): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
  } else {
    entry.count++;
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
