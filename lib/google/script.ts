/**
 * Shared utility for submitting form and donation data to Google Apps Script Web App.
 * Routes data to the appropriate sheet tab based on the payload's `formType`.
 */

export const GOOGLE_WEB_APP_URL =
  process.env.NEXT_PUBLIC_GOOGLE_WEB_APP_URL ||
  process.env.NEXT_PUBLIC_MEMBERSHIP_FORM_URL ||
  "https://script.google.com/macros/s/AKfycbzRyGG8z4800rMaTawBXXDnfIHHANECHxROGZw1-dcivIdkc2Guqjilv5A7H_gjkfDm/exec";

export async function submitToGoogleScript(payload: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(GOOGLE_WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
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
    if (result.result === "error") {
      throw new Error(result.message || result.error || "Google Apps Script returned an error.");
    }

    return result;
  } catch (error) {
    console.error("Submission error to Google Apps Script:", error);
    throw error;
  }
}
