import { checkRateLimit as coreCheckRateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * Reusable Rate Limiting Service using Upstash Redis.
 * Configured for Serverless (Next.js) environments.
 * Threshold: 5 requests per 60 seconds (Sliding Window).
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

