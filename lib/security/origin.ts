/**
 * Production-ready Same-Origin & CSRF validation utility.
 * Validates whether incoming request origin matches the application host,
 * configured NEXT_PUBLIC_SITE_URL, Vercel preview environments, or localhost.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  
  // If no Origin header is present (e.g. same-origin direct request, server-side fetch), allow
  if (!origin) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host; // e.g. "localhost:3000" or "sustainable-sundays.org"

    // 1. Same-Origin Check: Matches current request host or x-forwarded-host
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    if (host && (originHost === host || originHost === host.split(':')[0])) {
      return true;
    }

    // 2. Configured Site URL Check (NEXT_PUBLIC_SITE_URL or VERCEL_URL)
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
    if (configuredSiteUrl) {
      const formattedSiteUrl = configuredSiteUrl.startsWith('http') 
        ? configuredSiteUrl 
        : `https://${configuredSiteUrl}`;
      const siteHost = new URL(formattedSiteUrl).host;
      if (originHost === siteHost || originHost === siteHost.split(':')[0]) {
        return true;
      }
    }

    // 3. Localhost & development loopback
    if (
      originUrl.hostname === 'localhost' ||
      originUrl.hostname === '127.0.0.1' ||
      originUrl.hostname === '0.0.0.0'
    ) {
      return true;
    }

    // 4. Vercel deployment preview / staging subdomains
    if (originUrl.hostname.endsWith('.vercel.app')) {
      return true;
    }

    return false;
  } catch {
    // Malformed origin header -> reject
    return false;
  }
}
