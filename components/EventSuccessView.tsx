"use client";

import React, { useState, useEffect } from "react";
import { House } from "@phosphor-icons/react";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
} from "@/components/ReceiptPrinter";
import { TactileButton } from "@/components/TactileButton";

export interface EventSuccessViewProps {
  type?: string;
  amount?: string | number;
  paymentId?: string;
  orderId?: string;
  paymentMethod?: string;
  date?: string;
  eventTitle?: string;
  eventDate?: string;
  ticketTime?: string;
  ticketCount?: number;
  description?: string;
  onReset?: () => void;
  className?: string;
}

function BrandLogo() {
  return (
    <div className="flex items-center h-10">
      <img
        src="/SS Logo_white Text clean.png"
        alt="Sustainable Sundays"
        className="h-9 sm:h-10 w-auto max-w-[180px] object-contain select-none"
      />
    </div>
  );
}

export function EventSuccessView({
  type = "ticket",
  amount,
  paymentId,
  orderId = "ORD-2048",
  paymentMethod = "Razorpay · UPI / Card",
  date,
  eventTitle = "Edible Gardening Workshop",
  eventDate = "Aug 23, 2026",
  ticketTime = "Sunday Aug 23, 2026 @ 10am IST",
  ticketCount = 1,
  description,
  className = "",
}: EventSuccessViewProps) {
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");
  const [formattedDate, setFormattedDate] = useState<string>(date || "");

  useEffect(() => {
    if (date) {
      setFormattedDate(date);
    } else {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
      ];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setFormattedDate(`${day} ${month} ${year} · ${hours}:${minutes}`);
    }
  }, [date]);

  const isTicket = type === "ticket";
  const numAmount = amount ? Number(amount) : NaN;
  const displayAmount = amount
    ? !isNaN(numAmount)
      ? numAmount.toLocaleString("en-IN")
      : String(amount)
    : "5,000";
  const displayOrderId = orderId || (paymentId ? `ORD-${paymentId.slice(-4).toUpperCase()}` : "ORD-2048");

  useEffect(() => {
    // Stage 1: Brief processing indicator on receipt screen
    const printTimer = setTimeout(() => {
      setStage("printing");
    }, 400);

    // Stage 2: Full paper feeding animation (1.75s printing duration) -> complete
    const completeTimer = setTimeout(() => {
      setStage("complete");
    }, 2300);

    return () => {
      clearTimeout(printTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className={`flex flex-col items-center w-full max-w-md mx-auto ${className}`}>
      {/* ─── Receipt Printer Component ─── */}
      <ReceiptPrinter.Root stage={stage} className="w-full">
        <ReceiptPrinter.Machine>
          <ReceiptPrinter.Header>
            <BrandLogo />
            <TactileButton depth="shallow" href="/" size="sm">
              <House aria-hidden="true" size={13} weight="fill" />
              Home
            </TactileButton>
          </ReceiptPrinter.Header>

          <ReceiptPrinter.Screen>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="font-semibold text-sm text-neutral-100 line-clamp-1">
                    {isTicket ? eventTitle : "Direct Donation"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {isTicket
                      ? `${ticketCount}x General Admission`
                      : "Community & Impact Projects"}
                  </p>
                </div>
                <strong className="text-emerald-400 text-sm whitespace-nowrap">
                  ₹{displayAmount}
                </strong>
              </div>
              <ReceiptPrinter.Status />
            </div>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper>
            <div className="flex flex-col h-full text-xs font-mono space-y-2.5">
              {/* Receipt Header */}
              <div className="text-center pb-2 border-b border-dashed border-neutral-400">
                <p className="font-bold tracking-widest uppercase text-sm">
                  SUSTAINABLE SUNDAYS
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-wider">
                  OFFICIAL RECEIPT
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-1.5 py-1.5 border-b border-dashed border-neutral-400">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {isTicket ? eventTitle : "Mission Donation"}
                  </span>
                  <span className="font-semibold">₹{displayAmount}</span>
                </div>
                {isTicket ? (
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400 space-y-0.5">
                    <p>Qty: {ticketCount} × General Admission</p>
                    <p>Event: {ticketTime || eventDate}</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-tight">
                    {description ||
                      "Seeds are going in the ground and tools are in the hands of our weekend volunteers — because of you."}
                  </p>
                )}
              </div>

              {/* Totals Section */}
              <div className="pt-1.5 pb-2 border-b border-dashed border-neutral-400 space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL PAID</span>
                  <span>₹{displayAmount}</span>
                </div>
                {paymentId && (
                  <p className="text-[10px] text-neutral-500 break-all font-mono">
                    Ref ID: {paymentId}
                  </p>
                )}
                <div className="flex justify-between text-[10px] text-neutral-500 pt-0.5">
                  <span>Status</span>
                  <span className="text-emerald-700 font-bold uppercase">PAID & VERIFIED</span>
                </div>
              </div>

              {/* Order Metadata Details (Left-aligned & vertically stacked) */}
              <div className="py-2 flex flex-col gap-2.5 text-left text-[11px]">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold leading-none mb-1">
                    Order
                  </p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                    {displayOrderId}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold leading-none mb-1">
                    Paid with
                  </p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                    {paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold leading-none mb-1">
                    Date
                  </p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 text-center text-[10px] text-neutral-500 border-t border-dashed border-neutral-300 mt-auto">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {isTicket
                    ? "See you at the event! 🎉"
                    : "Thank you for making a difference! 🌱"}
                </p>
                <p className="text-[9px] mt-0.5">Keep this for your records</p>
              </div>
            </div>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>
    </div>
  );
}
