"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


interface UseDonationOptions {
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
}

export function useDonation(options: UseDonationOptions = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateDonation = async (amount: number, note?: string) => {
    setError(null);
    setIsLoading(true);

    // Record donation to Google Sheets via server proxy in background
    fetch("/api/forms/submit-to-sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        formType: "donation",
        amount: Number(amount),
        donationTime: new Date().toLocaleString(),
        note: note || "",
        donorName: options.donorName || "",
        donorEmail: options.donorEmail || "",
        donorPhone: options.donorPhone || "",
      }),
    }).catch((e) => console.warn("Failed to log donation to Google Sheets:", e));


    try {
      router.prefetch("/donate/success");
    } catch (_) {}

    try {
      // Step 1: Create Razorpay order from backend
      const orderRes = await fetch("/api/donate/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, note }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Step 2: Open Razorpay checkout modal
      const rzpOptions: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: "INR",
        name: "Sustainable Sundays",
        description: "Donation — Seeds & Tools for Weekend Volunteers",
        order_id: orderData.orderId,
        prefill: {
          name: options.donorName || "",
          email: options.donorEmail || "",
          contact: options.donorPhone || "",
        },
        theme: {
          color: "#0f1f3d",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setError("Payment was cancelled. You can try again.");
          },
        },
        handler: (response: RazorpayPaymentResponse) => {
          const redirectUrl = `/donate/success?amount=${amount}&paymentId=${response.razorpay_payment_id}`;

          // Non-blocking background verification
          fetch("/api/donate/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({
              ...response,
              donorName: options.donorName || "",
              donorEmail: options.donorEmail || "",
              donorPhone: options.donorPhone || "",
              amount,
              note: note || "",
            }),
          }).catch((err) => console.error("Background donation verification error:", err));

          // Instantaneous client-side navigation without full document reload
          try {
            router.replace(redirectUrl);
          } catch (_) {
            window.location.replace(redirectUrl);
          }
        },
      };

      const rzp = new window.Razorpay(rzpOptions);

      rzp.on("payment.failed", (response: unknown) => {
        setIsLoading(false);
        const errorResponse = response as { error?: { description?: string } };
        setError(
          `Payment failed: ${errorResponse.error?.description || "Please try again."}`
        );
      });

      rzp.open();
    } catch (err: unknown) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    }
  };

  return { initiateDonation, isLoading, error };
}
