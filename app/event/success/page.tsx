"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EventSuccessView } from "@/components/EventSuccessView";

function EventSuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "ticket";
  const amount = searchParams.get("amount") || "700";
  const paymentId = searchParams.get("paymentId") || undefined;
  const eventTitle = searchParams.get("eventTitle") || "Edible Gardening Workshop";
  const ticketTime = searchParams.get("ticketTime") || "Sunday Aug 23, 2026 @ 10am IST";
  const date = searchParams.get("date") || undefined;

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
        />
      </div>
    </main>
  );
}

export default function EventSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="h-screen w-full flex items-center justify-center bg-[#181818] p-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <EventSuccessContent />
    </Suspense>
  );
}
