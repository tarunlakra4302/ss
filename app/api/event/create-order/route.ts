import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, type, quantity } = await req.json();
    // type: "ticket" | "donation"
    // amount: total in INR
    // quantity: number of tickets (for ticket orders)

    if (!amount || isNaN(Number(amount)) || Number(amount) < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // paise
      currency: "INR",
      receipt: `receipt_${crypto.randomBytes(8).toString("hex")}`,
      notes: {
        type: type || "ticket",
        quantity: String(quantity || 1),
        source: "sustainable_sundays_event",
      },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
