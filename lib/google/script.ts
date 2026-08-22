import { formatPhoneNumber } from '../utils';

/**
 * Shared utility for submitting form and donation data to Google Apps Script Web App.
 * Routes data to the appropriate sheet tab based on the payload's `formType`.
 */

export const GOOGLE_WEB_APP_URL =
  process.env.GOOGLE_WEB_APP_URL ||
  process.env.GOOGLE_MEMBERSHIP_FORM_URL ||
  "";

export async function submitToGoogleScript(payload: Record<string, any>): Promise<any> {
  try {
    // Normalize formType alias mapping
    const rawType = (payload.formType || 'event').toString().toLowerCase();
    let normalizedType = rawType;
    if (rawType === 'volunteer') normalizedType = 'volunteering';
    
    const rawPhone = payload.phone || payload.phoneNumber || payload.donorPhone || '';
    const formattedPhone = rawPhone ? formatPhoneNumber(rawPhone) : '';

    const formattedPayload = {
      ...payload,
      formType: normalizedType,
      phone: formattedPhone,
      phoneNumber: formattedPhone,
      donorPhone: formattedPhone,
      donationTime: payload.donationTime || new Date().toLocaleString(),
    };

    const response = await fetch(GOOGLE_WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(formattedPayload),
    });

    const text = await response.text();

    // Try to parse as JSON first
    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      // Not JSON — this is an HTML error page from Google
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Google Apps Script returned a non-JSON error.`);
      }
      throw new Error("Google Apps Script returned an error page. Check your Web App URL and deployment status.");
    }

    // We have valid JSON — check if Apps Script reported an error
    if (result.result === "error" || result.status === "error") {
      const errMsg = result.message || result.error || "Google Apps Script returned an error.";
      console.warn("Google Apps Script reported an error:", errMsg);
      
      // Attempt local API route fallback
      const fallbackResult = await fallbackToLocalApi(formattedPayload);
      if (fallbackResult) {
        console.log("Successfully saved submission via local API fallback.");
        return fallbackResult;
      }

      throw new Error(errMsg);
    }

    return result;
  } catch (error) {
    console.warn("Submission error to Google Apps Script. Attempting local API fallback...", error);
    
    // Attempt local API route fallback on fetch/network error
    try {
      const rawType = (payload.formType || 'event').toString().toLowerCase();
      let normalizedType = rawType;
      if (rawType === 'volunteer') normalizedType = 'volunteering';
      const formattedPayload = { ...payload, formType: normalizedType };

      const fallbackResult = await fallbackToLocalApi(formattedPayload);
      if (fallbackResult) {
        console.log("Successfully saved submission via local API fallback.");
        return fallbackResult;
      }
    } catch (fallbackError) {
      console.error("Local API fallback failed:", fallbackError);
    }

    throw error;
  }
}

/**
 * Fallback handler: forwards submissions to Next.js API routes when Apps Script fails
 */
async function fallbackToLocalApi(payload: Record<string, any>): Promise<any> {
  if (typeof window === 'undefined') return null; // Only run on client or when fetch is available

  const formType = (payload.formType || 'event').toString().toLowerCase();

  try {
    if (formType === 'member') {
      const fullName = payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'Member';
      const res = await fetch('/api/forms/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: payload.email || '',
          phone: payload.phone || payload.phoneNumber || '9999999999',
          city: payload.city || 'Bangalore',
          reason: payload.message || payload.reason || 'Member enrollment request',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        return { result: 'success', status: 'success', message: 'Saved via local server API' };
      }
    } else if (formType === 'volunteering' || formType === 'volunteer') {
      const fullName = payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'Volunteer';
      const res = await fetch('/api/forms/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: payload.email || '',
          phone: payload.phone || payload.phoneNumber || '9999999999',
          expertise: payload.expertise || 'General',
          availability: payload.availability || 'WEEKENDS',
          message: payload.message || 'Volunteer application request',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        return { result: 'success', status: 'success', message: 'Saved via local server API' };
      }
    }
  } catch (err) {
    console.warn("fallbackToLocalApi error:", err);
  }

  return null;
}

