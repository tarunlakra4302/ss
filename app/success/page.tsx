"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EventSuccessView } from "@/components/EventSuccessView";

function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "ticket";
  const amount = searchParams.get("amount") || "700";
  const paymentId = searchParams.get("paymentId") || searchParams.get("razorpay_payment_id") || undefined;
  const legacyStatus = searchParams.get("razorpay_payment_link_status");
  const eventTitle = searchParams.get("eventTitle") || (type === "donation" ? undefined : "Edible Gardening Workshop");
  const ticketTime = searchParams.get("ticketTime") || (type === "donation" ? undefined : "Sunday Aug 23, 2026 @ 10am IST");
  const date = searchParams.get("date") || undefined;

  const isSuccess = searchParams.get("amount") || searchParams.get("paymentId")
    ? true
    : legacyStatus
    ? legacyStatus === "paid"
    : true;

  if (!isSuccess) {
    return (
      <main className="h-screen flex items-center justify-center bg-[#181818] px-4">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-5">🌿</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Payment Incomplete
          </h1>
          <p className="text-gray-600 mb-6">
            It looks like the payment didn&apos;t go through. No amount was
            deducted. Please try again.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/#donation-section"
              className="inline-block bg-[#181818] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="inline-block border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition"
            >
              Back to Sustainable Sundays
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex items-center justify-center bg-[#181818] p-4 overflow-hidden">
      <div className="-translate-y-2 sm:-translate-y-4 w-full flex justify-center">
        <EventSuccessView
          type={type}
          amount={amount}
          paymentId={paymentId}
          eventTitle={eventTitle}
          ticketTime={ticketTime}
          date={date}
          ticketCount={1}
          description={
            type === "donation"
              ? "Seeds are going in the ground and tools are in the hands of our weekend volunteers — because of you."
              : undefined
          }
        />
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="h-screen w-full flex items-center justify-center bg-[#181818] p-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
