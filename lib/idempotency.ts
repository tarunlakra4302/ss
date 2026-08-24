// In-memory idempotency & payment verification stores
const memoryIdempotencyStore = new Map<string, { record: IdempotencyRecord; expiresAt: number }>();
const memoryProcessedPayments = new Map<string, number>();

// Periodic cleanup of expired entries every 10 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, val] of memoryIdempotencyStore.entries()) {
    if (val.expiresAt <= now) {
      memoryIdempotencyStore.delete(key);
    }
  }

  for (const [key, expiresAt] of memoryProcessedPayments.entries()) {
    if (expiresAt <= now) {
      memoryProcessedPayments.delete(key);
    }
  }
}

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface IdempotencyRecord {
  status: number;
  headers: Record<string, string>;
  body: any;
}

/**
 * Validates Idempotency-Key format and checks if a cached response exists.
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

  cleanupExpired();

  const entry = memoryIdempotencyStore.get(idempotencyKey);
  if (entry && entry.expiresAt > Date.now()) {
    return { validKey: true, cachedRecord: entry.record };
  }

  return { validKey: true, cachedRecord: null };
}

/**
 * Stores response under the Idempotency-Key with 24h expiration.
 */
export async function saveIdempotentResponse(
  idempotencyKey: string,
  status: number,
  body: any,
  headers: Record<string, string> = {}
): Promise<void> {
  if (!idempotencyKey || !UUID_V4_REGEX.test(idempotencyKey)) return;

  cleanupExpired();

  const record: IdempotencyRecord = { status, headers, body };
  memoryIdempotencyStore.set(idempotencyKey, {
    record,
    expiresAt: Date.now() + 86400 * 1000, // 24 hours
  });
}

/**
 * Checks if a payment verification has already been recorded.
 * Key format: `processed_payment:${razorpay_payment_id}`
 */
export async function isPaymentProcessed(paymentId: string): Promise<boolean> {
  if (!paymentId || typeof paymentId !== 'string') return false;

  cleanupExpired();

  const memExpiry = memoryProcessedPayments.get(paymentId);
  if (memExpiry && memExpiry > Date.now()) {
    return true;
  }

  return false;
}

/**
 * Marks a payment as successfully processed with 48h TTL.
 */
export async function markPaymentProcessed(
  paymentId: string,
  ttlSeconds: number = 172800 // 48 hours
): Promise<void> {
  if (!paymentId || typeof paymentId !== 'string') return;

  cleanupExpired();

  memoryProcessedPayments.set(paymentId, Date.now() + ttlSeconds * 1000);
}
