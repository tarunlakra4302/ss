import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { appendToSheet } from "@/lib/google/sheets";
import { formatPhoneNumber } from "@/lib/utils";
import { isPaymentProcessed, markPaymentProcessed } from "@/lib/idempotency";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donorName = "",
      donorEmail = "",
      donorPhone = "",
      amount = 0,
      note = "",
    } = payload;

    const formattedPhone = donorPhone ? formatPhoneNumber(donorPhone) : "";

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Idempotency: Check if this payment ID was already processed
    const alreadyProcessed = await isPaymentProcessed(razorpay_payment_id);
    if (alreadyProcessed) {
      return NextResponse.json({
        success: true,
        message: "Payment already verified and processed.",
      });
    }

    // Append verified donation details to Google Sheets in background
    (async () => {
      try {
        const timestamp = new Date().toISOString();
        const row = [timestamp, donorName || "Donor", amount, donorEmail || "", formattedPhone, note || `Payment ID: ${razorpay_payment_id}`];
        await appendToSheet("Donation", row);

        // Mark as processed in Redis (48h TTL)
        await markPaymentProcessed(razorpay_payment_id);
      } catch (sheetErr) {
        console.error("Failed to log donation to Google Sheets:", sheetErr);
      }
    })();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Payment verification failed:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}


