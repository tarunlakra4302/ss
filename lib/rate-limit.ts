export interface RateLimitOptions {
  limit?: number; // Maximum allowed requests within window (default: 5)
  windowMs?: number; // Time window in milliseconds (default: 60,000ms / 1 min)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds when the current limit window resets
  headers: Record<string, string>;
}

// In-memory store: Map<identifier, timestamp[]>
const tracker = new Map<string, number[]>();

// Periodic cleanup of stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const threshold = now - windowMs;
  for (const [key, timestamps] of tracker.entries()) {
    const valid = timestamps.filter((t) => t > threshold);
    if (valid.length === 0) {
      tracker.delete(key);
    } else {
      tracker.set(key, valid);
    }
  }
}

/**
 * Safely extracts client IP address preventing header spoofing.
 *
 * Header Priority:
 * 1. Cloudflare: `cf-connecting-ip` (Cloudflare validates and strips spoofed headers).
 * 2. Vercel: `x-vercel-proxied-for` / `x-real-ip`.
 * 3. Standard Reverse Proxies: `x-forwarded-for` (first IP entry).
 * 4. Fallback: `127.0.0.1` for local development.
 */
export function getClientIp(request: Request): string {
  // 1. Cloudflare trusted header
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  // 2. Vercel trusted headers
  const vercelProxiedFor = request.headers.get('x-vercel-proxied-for');
  if (vercelProxiedFor && vercelProxiedFor.trim()) {
    const ips = vercelProxiedFor.split(',').map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // 3. Fallback to standard x-forwarded-for
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  return '127.0.0.1';
}

/**
 * High-performance sliding-window in-memory rate limiter.
 * Zero external Redis or cloud dependencies needed.
 *
 * @param request Request or incoming identifier
 * @param actionPrefix Namespace / Action tag (e.g. 'orders_create', 'member_enrollment')
 * @param options Custom limit and window duration
 */
export async function checkRateLimit(
  request: Request,
  actionPrefix: string = 'api',
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 60_000; // 1 minute default
  const ip = getClientIp(request);
  const identifier = `${actionPrefix}_${ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  cleanupStaleEntries(windowMs);

  const existingTimestamps = tracker.get(identifier) || [];
  const validTimestamps = existingTimestamps.filter((t) => t > windowStart);

  if (validTimestamps.length >= limit) {
    tracker.set(identifier, validTimestamps);
    const earliestValid = validTimestamps[0] || now;
    const resetTimeSec = Math.ceil((earliestValid + windowMs) / 1000);

    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTimeSec,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': resetTimeSec.toString(),
        'Retry-After': Math.max(1, resetTimeSec - Math.ceil(now / 1000)).toString(),
      },
    };
  }

  validTimestamps.push(now);
  tracker.set(identifier, validTimestamps);

  const remaining = limit - validTimestamps.length;
  const resetTimeSec = Math.ceil((now + windowMs) / 1000);

  return {
    success: true,
    limit,
    remaining,
    reset: resetTimeSec,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTimeSec.toString(),
    },
  };
}
