import { after, NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { appendToSheet } from "@/lib/google/sheets";
import { formatPhoneNumber } from "@/lib/utils";
import { isPaymentProcessed, markPaymentProcessed } from "@/lib/idempotency";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const rateStatus = await checkRateLimit(req, "event_verify_payment", { limit: 10, windowMs: 60_000 });
    if (!rateStatus.success) {
      return NextResponse.json(
        { success: false, error: "Too many verification requests. Please try again later." },
        { status: 429, headers: rateStatus.headers }
      );
    }

    const bodyData = await req.json().catch(() => null);
    if (!bodyData || typeof bodyData !== "object") {
      return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type = "ticket",
      amount = 0,
      quantity = 1,
      name = "",
      email = "",
      phone = "",
      eventName = "",
      description = "",
    } = bodyData;

    const formattedPhone = phone ? formatPhoneNumber(phone) : "";

    // 2. Early Input Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay payment verification fields." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("[Event Verify] RAZORPAY_KEY_SECRET is not configured.");
      return NextResponse.json({ success: false, error: "Payment configuration error." }, { status: 500 });
    }

    // 3. Constant-Time Cryptographic HMAC Verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedHex = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedHex, "hex");
    const providedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid cryptographic signature." },
        { status: 400 }
      );
    }

    // 4. Idempotency Check
    const alreadyProcessed = await isPaymentProcessed(razorpay_payment_id);
    if (alreadyProcessed) {
      return NextResponse.json({
        success: true,
        message: "Payment already verified and processed.",
      }, { headers: rateStatus.headers });
    }

    // Safely execute post-response tasks on Vercel without freezing Lambda
    after(async () => {
      try {
        const timestamp = new Date().toISOString();
        if (type === "donation") {
          const row = [timestamp, name || "Donor", email || "", formattedPhone, amount, `Payment ID: ${razorpay_payment_id}`];
          await appendToSheet("Donation", row);
        } else {
          const row = [timestamp, name || "Attendee", email || "", formattedPhone, eventName || description || "Event Ticket", quantity, amount, `Payment ID: ${razorpay_payment_id}`];
          await appendToSheet("EventRegistration", row);
        }
        
        // Mark as processed in Redis/cache
        await markPaymentProcessed(razorpay_payment_id);
      } catch (sheetError) {
        console.error("Failed to append payment details to Google Sheets:", sheetError);
      }
    });

    return NextResponse.json(
      { success: true, verified: true },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          ...rateStatus.headers,
        },
      }
    );
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}


