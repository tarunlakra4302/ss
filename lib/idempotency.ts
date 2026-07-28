import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy',
    });
  }
  return redisInstance;
}

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface IdempotencyRecord {
  status: number;
  headers: Record<string, string>;
  body: any;
}

/**
 * Validates Idempotency-Key format and checks if a cached response exists in Redis.
 */
export async function getCachedIdempotentResponse(
  idempotencyKey: string | null
): Promise<{ validKey: boolean; cachedRecord: IdempotencyRecord | null }> {
  if (!idempotencyKey) {
    return { validKey: true, cachedRecord: null };
  }

  if (!UUID_V4_REGEX.test(idempotencyKey)) {
    return { validKey: false, cachedRecord: null };
  }

  try {
    const redis = getRedis();
    const cached = await redis.get<IdempotencyRecord>(`idempotency:${idempotencyKey}`);
    return { validKey: true, cachedRecord: cached };
  } catch (error) {
    console.error('Idempotency Redis Fetch Error:', error);
    return { validKey: true, cachedRecord: null };
  }
}

/**
 * Stores response in Redis under the Idempotency-Key with 24h expiration.
 */
export async function saveIdempotentResponse(
  idempotencyKey: string,
  status: number,
  body: any,
  headers: Record<string, string> = {}
): Promise<void> {
  if (!idempotencyKey || !UUID_V4_REGEX.test(idempotencyKey)) return;

  try {
    const redis = getRedis();
    const record: IdempotencyRecord = { status, headers, body };
    // 24 hour TTL (86400 seconds)
    await redis.set(`idempotency:${idempotencyKey}`, record, { ex: 86400 });
  } catch (error) {
    console.error('Idempotency Redis Save Error:', error);
  }
}
