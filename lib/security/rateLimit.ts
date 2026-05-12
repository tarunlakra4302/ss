import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Reusable Rate Limiting Service using Upstash Redis.
 * Configured for Serverless (Next.js) environments.
 * Threshold: 5 requests per 60 seconds (Sliding Window).
 */

// Lazy initialization to avoid warnings during Next.js static build phases
let ratelimitInstance: Ratelimit | null = null;

function getRatelimit() {
  if (!ratelimitInstance) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "https://dummy.upstash.io",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "dummy",
    });

    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
  }
  return ratelimitInstance;
}

/**
 * Utility: checkRateLimit
 * @param ip User's IP address (isolated context)
 * @returns Object with security metadata
 */
export async function checkRateLimit(ip: string) {
  const ratelimit = getRatelimit();
  
  // If IP is not found, fallback to generic key (though IP is expected)
  const identifier = `form_submit_${ip || 'global'}`;
  
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}
