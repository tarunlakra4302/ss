import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getEvent } from "@/lib/events/catalog";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const rateStatus = await checkRateLimit(req, "event_order_creation");
    if (!rateStatus.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: rateStatus.headers }
      );
    }

    const { eventId, quantity } = await req.json();

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const event = getEvent(eventId);
    if (!event) {
      return NextResponse.json({ error: "Unknown event" }, { status: 404 });
    }
    if (!event.isActive) {
      return NextResponse.json({ error: "Event is not active" }, { status: 400 });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > event.maxQuantity) {
      return NextResponse.json(
        { error: `Quantity must be between 1 and ${event.maxQuantity}` },
        { status: 400 }
      );
    }

    // Server-computed amount — never trust the client
    const amountINR = event.pricePerTicket * qty;

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amountINR * 100, // paise
      currency: "INR",
      receipt: `receipt_${crypto.randomBytes(8).toString("hex")}`,
      notes: {
        type: "ticket",
        eventId,
        quantity: String(qty),
        source: "sustainable_sundays_event",
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        eventId,
      },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          ...rateStatus.headers,
        },
      }
    );
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
