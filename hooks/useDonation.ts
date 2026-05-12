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
        handler: async (response: RazorpayPaymentResponse) => {
          // Step 3: Verify payment signature on backend
          const verifyRes = await fetch("/api/donate/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            router.push(
              `/donate/success?amount=${amount}&paymentId=${response.razorpay_payment_id}`
            );
          } else {
            setIsLoading(false);
            setError(
              "Payment verification failed. Contact us if amount was deducted."
            );
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
