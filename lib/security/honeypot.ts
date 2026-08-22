/**
 * Reusable Honeypot & Bot Detection Utility.
 * 
 * Inspects hidden off-screen fields and minimum time-to-submit timestamps.
 * When spam or bot behavior is detected, returns `isSpam: true` so the route
 * can return a silent HTTP 200/201 success response without performing any operations.
 */

export interface HoneypotResult {
  isSpam: boolean;
  reason?: string;
}

export function checkHoneypot(payload: Record<string, any>): HoneypotResult {
  if (!payload || typeof payload !== 'object') {
    return { isSpam: false };
  }

  // 1. Check off-screen honeypot input values (should always be empty for real users)
  const honeypotFields = ['website', 'hp_confirm', 'company_url'];
  for (const field of honeypotFields) {
    const val = payload[field];
    if (typeof val === 'string' && val.trim().length > 0) {
      return { isSpam: true, reason: `Honeypot field "${field}" filled` };
    }
  }

  // 2. Check minimum time-to-submit (< 2000ms is inhumanly fast for completing form)
  const startTime = payload._formStartTime || payload.timestamp;
  if (startTime) {
    const startMs = Number(startTime);
    if (!isNaN(startMs) && startMs > 0) {
      const elapsedMs = Date.now() - startMs;
      // If completed in less than 2 seconds, treat as bot submission
      if (elapsedMs < 2000) {
        return { isSpam: true, reason: `Form completed too quickly (${elapsedMs}ms)` };
      }
    }
  }

  return { isSpam: false };
}
