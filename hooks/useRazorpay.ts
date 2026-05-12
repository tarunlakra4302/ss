"use client";

import { useRouter } from "next/navigation";

interface OpenPaymentOptions {
  amount: number;           // in INR
  type: "ticket" | "donation";
  quantity?: number;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  description?: string;
  onDismiss?: () => void;
  onError?: (msg: string) => void;
  successRedirect?: string; // path to redirect on success
}

export function useRazorpay() {
  const router = useRouter();

  const openPayment = async (options: OpenPaymentOptions) => {
    const {
      amount,
      type,
      quantity = 1,
      prefill,
      description,
      onDismiss,
      onError,
      successRedirect,
    } = options;

    try {
      // Step 1: Create order
      const orderRes = await fetch("/api/event/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type, quantity }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        onError?.(orderData.error || "Could not initiate payment.");
        return;
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        onError?.("Razorpay SDK failed to load. Please refresh and try again.");
        return;
      }

      // Step 2: Open Razorpay modal
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: "INR",
        name: "Sustainable Sundays",
        description: description || "Sustainable Sundays",
        order_id: orderData.orderId,
        prefill: prefill || {},
        theme: { color: "#0f1f3d" },
        modal: {
          ondismiss: () => {
            onDismiss?.();
          },
        },
        handler: async (response: RazorpayPaymentResponse) => {
          // Step 3: Verify signature
          const verifyRes = await fetch("/api/event/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            const redirectPath =
              successRedirect ||
              `/event/success?type=${type}&amount=${amount}&paymentId=${response.razorpay_payment_id}`;
            router.push(redirectPath);
          } else {
            onError?.("Payment verification failed. Contact us if amount was deducted.");
          }
        },
      });

      rzp.on("payment.failed", (res: any) => {
        onError?.(res.error?.description || "Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      onError?.(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return { openPayment };
}
