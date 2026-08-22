import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Donation bounds (INR)
const MIN_DONATION_INR = 1;
const MAX_DONATION_INR = 500000;

export async function POST(req: NextRequest) {
  try {
    const rateStatus = await checkRateLimit(req, "donate_order_creation");
    if (!rateStatus.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: rateStatus.headers }
      );
    }

    const { amount, note } = await req.json();

    const amountNum = Number(amount);
    if (
      !amount ||
      !Number.isFinite(amountNum) ||
      amountNum < MIN_DONATION_INR ||
      amountNum > MAX_DONATION_INR ||
      !Number.isInteger(amountNum)
    ) {
      return NextResponse.json(
        { error: `Donation must be a whole number between ₹${MIN_DONATION_INR} and ₹${MAX_DONATION_INR}` },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amountNum * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${crypto.randomBytes(8).toString("hex")}`,
      notes: {
        comment: note || "",
        source: "sustainable_sundays_website",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
