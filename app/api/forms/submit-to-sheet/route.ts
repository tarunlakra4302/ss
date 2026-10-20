import { NextRequest, NextResponse } from "next/server";
import { submitToGoogleScript } from "@/lib/google/script";
import { checkRateLimit } from "@/lib/rate-limit";
import { isAllowedOrigin } from "@/lib/security/origin";

/**
 * Server-side proxy for Google Apps Script submissions.
 * Client components POST here instead of calling the Apps Script URL directly,
 * keeping the URL out of the client bundle.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (15 req/min)
    const rateStatus = await checkRateLimit(req, "submit_to_sheet", { limit: 15, windowMs: 60_000 });
    if (!rateStatus.success) {
      return NextResponse.json(
        { result: "error", message: "Too many submission attempts. Please try again in a minute." },
        { status: 429, headers: rateStatus.headers }
      );
    }

    // 2. Origin & CSRF Check
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ result: "error", message: "Forbidden: Invalid origin" }, { status: 403 });
    }

    const payload = await req.json().catch(() => null);

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await submitToGoogleScript(payload);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        ...rateStatus.headers,
      },
    });
  } catch (err) {
    console.error("submit-to-sheet proxy error:", err);
    return NextResponse.json(
      { result: "error", message: "Failed to submit to Google Sheets" },
      { status: 500 }
    );
  }
}
