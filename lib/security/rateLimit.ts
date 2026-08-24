import { checkRateLimit as coreCheckRateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * Reusable Rate Limiting Service.
 * Lightweight sliding-window in-memory rate limiter with zero external dependencies.
 * Default Threshold: 5 requests per 60 seconds.
 */

export async function checkRateLimit(ipOrRequest: string | Request) {
  if (typeof ipOrRequest === 'string') {
    const fakeRequest = new Request('http://localhost', {
      headers: { 'x-real-ip': ipOrRequest },
    });
    return coreCheckRateLimit(fakeRequest, 'form_submit');
  }

  return coreCheckRateLimit(ipOrRequest, 'form_submit');
}

export { getClientIp };
