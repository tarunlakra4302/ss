import { NextRequest, NextResponse } from "next/server";
import { submitToGoogleScript } from "@/lib/google/script";

/**
 * Server-side proxy for Google Apps Script submissions.
 * Client components POST here instead of calling the Apps Script URL directly,
 * keeping the URL out of the client bundle.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await submitToGoogleScript(payload);
    return NextResponse.json(result);
  } catch (err) {
    console.error("submit-to-sheet proxy error:", err);
    return NextResponse.json(
      { result: "error", message: "Failed to submit to Google Sheets" },
      { status: 500 }
    );
  }
}
