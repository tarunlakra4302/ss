import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, note } = await req.json();

    if (!amount || isNaN(Number(amount)) || Number(amount) < 1) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // convert to paise
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
