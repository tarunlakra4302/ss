import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimitInstance: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (!ratelimitInstance) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy',
    });

    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  }
  return ratelimitInstance;
}

/**
 * Safely extracts client IP address preventing header spoofing.
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

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
}
