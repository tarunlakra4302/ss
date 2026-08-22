import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { appendToSheet } from "@/lib/google/sheets";
import { formatPhoneNumber } from "@/lib/utils";
import { isPaymentProcessed, markPaymentProcessed } from "@/lib/idempotency";

export async function POST(req: NextRequest) {
  try {
    const bodyData = await req.json();
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

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Signature mismatch" },
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

    // Append verified payment record to Google Sheets in background
    (async () => {
      try {
        const timestamp = new Date().toISOString();
        if (type === "donation") {
          const row = [timestamp, name || "Donor", email || "", formattedPhone, amount, `Payment ID: ${razorpay_payment_id}`];
          await appendToSheet("Donation", row);
        } else {
          const row = [timestamp, name || "Attendee", email || "", formattedPhone, eventName || description || "Event Ticket", quantity, amount, `Payment ID: ${razorpay_payment_id}`];
          await appendToSheet("EventRegistration", row);
        }
        
        // Mark as processed in Redis (48h TTL)
        await markPaymentProcessed(razorpay_payment_id);
      } catch (sheetError) {
        console.error("Failed to append payment details to Google Sheets:", sheetError);
      }
    })();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}


