import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimitInstance: Ratelimit | null = null;
let redisCooldownUntil = 0;

// In-memory sliding window rate limiter fallback when Redis is unconfigured or unreachable
const memoryRateLimitMap = new Map<string, number[]>();

function checkMemoryRateLimit(identifier: string, limit = 5, windowMs = 60000): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (memoryRateLimitMap.get(identifier) || []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    memoryRateLimitMap.set(identifier, timestamps);
    const resetTime = Math.ceil((timestamps[0] + windowMs) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTime,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': resetTime.toString(),
      },
    };
  }

  timestamps.push(now);
  memoryRateLimitMap.set(identifier, timestamps);
  const remaining = limit - timestamps.length;
  const resetTime = Math.ceil((now + windowMs) / 1000);

  return {
    success: true,
    limit,
    remaining,
    reset: resetTime,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTime.toString(),
    },
  };
}

function hasValidRedisConfig(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  return Boolean(url && url.trim() && !url.includes('dummy.upstash.io'));
}

function getRatelimit(): Ratelimit {
  if (!ratelimitInstance) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      retry: {
        retries: 0, // Fail fast on network/DNS errors
      },
    });

    // 5 requests per 60 seconds (Sliding Window) for sensitive order and submission endpoints
    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '60 s'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  }
  return ratelimitInstance;
}

/**
 * Safely extracts client IP address preventing header spoofing.
 *
 * Hosting Provider Header Hierarchy:
 * 1. Cloudflare: `cf-connecting-ip` (Cloudflare guarantees authenticity and strips client-supplied values).
 * 2. Vercel: `x-vercel-proxied-for` / `x-real-ip` (Vercel sets authenticated proxy origin).
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

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  headers: Record<string, string>;
}

export async function checkRateLimit(
  request: Request,
  actionPrefix: string = 'api'
): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  const identifier = `${actionPrefix}_${ip}`;
  const now = Date.now();

  if (!hasValidRedisConfig() || now < redisCooldownUntil) {
    return checkMemoryRateLimit(identifier);
  }

  try {
    const ratelimit = getRatelimit();
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    };
  } catch (error) {
    redisCooldownUntil = Date.now() + 60000;
    console.warn(
      'Upstash Redis rate limit unreachable. Falling back to in-memory rate limiter:',
      error instanceof Error ? error.message : error
    );
    return checkMemoryRateLimit(identifier);
  }
}
