import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;
let redisCooldownUntil = 0;

// In-memory fallbacks when Redis is unconfigured or unreachable
const memoryIdempotencyStore = new Map<string, { record: IdempotencyRecord; expiresAt: number }>();
const memoryProcessedPayments = new Map<string, number>();

function isRedisAvailable(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  if (!url || !url.trim() || url.includes('dummy.upstash.io')) return false;
  return Date.now() >= redisCooldownUntil;
}

function triggerRedisCooldown(error: unknown) {
  redisCooldownUntil = Date.now() + 60000;
  console.warn(
    'Upstash Redis idempotency check unreachable. Falling back to in-memory store:',
    error instanceof Error ? error.message : error
  );
}

function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      retry: {
        retries: 0, // Fail fast on network/DNS errors
      },
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

  if (!isRedisAvailable()) {
    const entry = memoryIdempotencyStore.get(idempotencyKey);
    if (entry && entry.expiresAt > Date.now()) {
      return { validKey: true, cachedRecord: entry.record };
    }
    return { validKey: true, cachedRecord: null };
  }

  try {
    const redis = getRedis();
    const cached = await redis.get<IdempotencyRecord>(`idempotency:${idempotencyKey}`);
    return { validKey: true, cachedRecord: cached };
  } catch (error) {
    triggerRedisCooldown(error);
    const entry = memoryIdempotencyStore.get(idempotencyKey);
    if (entry && entry.expiresAt > Date.now()) {
      return { validKey: true, cachedRecord: entry.record };
    }
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

  const record: IdempotencyRecord = { status, headers, body };
  memoryIdempotencyStore.set(idempotencyKey, {
    record,
    expiresAt: Date.now() + 86400 * 1000,
  });

  if (!isRedisAvailable()) return;

  try {
    const redis = getRedis();
    // 24 hour TTL (86400 seconds)
    await redis.set(`idempotency:${idempotencyKey}`, record, { ex: 86400 });
  } catch (error) {
    triggerRedisCooldown(error);
  }
}

/**
 * Checks if a payment verification has already been recorded in Redis.
 * Key format: `processed_payment:${razorpay_payment_id}`
 */
export async function isPaymentProcessed(paymentId: string): Promise<boolean> {
  if (!paymentId || typeof paymentId !== 'string') return false;

  const memExpiry = memoryProcessedPayments.get(paymentId);
  if (memExpiry && memExpiry > Date.now()) {
    return true;
  }

  if (!isRedisAvailable()) return false;

  try {
    const redis = getRedis();
    const processed = await redis.get<boolean | string>(`processed_payment:${paymentId}`);
    return Boolean(processed);
  } catch (error) {
    triggerRedisCooldown(error);
    return false;
  }
}

/**
 * Marks a payment as successfully processed in Redis with 48h TTL.
 */
export async function markPaymentProcessed(
  paymentId: string,
  ttlSeconds: number = 172800 // 48 hours
): Promise<void> {
  if (!paymentId || typeof paymentId !== 'string') return;

  memoryProcessedPayments.set(paymentId, Date.now() + ttlSeconds * 1000);

  if (!isRedisAvailable()) return;

  try {
    const redis = getRedis();
    await redis.set(
      `processed_payment:${paymentId}`,
      {
        processedAt: new Date().toISOString(),
      },
      { ex: ttlSeconds }
    );
  } catch (error) {
    triggerRedisCooldown(error);
  }
}

