"use client";

import { useRouter } from "next/navigation";

interface OpenPaymentOptions {
  eventId: string;         // server catalog key
  quantity?: number;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  description?: string;
  onDismiss?: () => void;
  onError?: (msg: string) => void;
  onSuccess?: (paymentId: string) => void;
  successRedirect?: string; // path to redirect on success
}

export function useRazorpay() {
  const router = useRouter();

  const openPayment = async (options: OpenPaymentOptions) => {
    const {
      eventId,
      quantity = 1,
      prefill,
      description,
      onDismiss,
      onError,
      onSuccess,
      successRedirect,
    } = options;

    // Prefetch target success route so client chunks are instant in memory
    try {
      router.prefetch(successRedirect || "/event/success");
    } catch (_) {}

    try {
      // Step 1: Create order — server computes the amount
      const orderRes = await fetch("/api/event/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, quantity }),
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

      // Server-authoritative amount (in paise)
      const serverAmountPaise = orderData.amount;
      const serverAmountINR = serverAmountPaise / 100;

      // Step 2: Open Razorpay modal
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: serverAmountPaise,
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
        handler: (response: RazorpayPaymentResponse) => {
          let redirectPath =
            successRedirect ||
            `/event/success?type=ticket&amount=${serverAmountINR}&paymentId=${response.razorpay_payment_id}`;
          if (successRedirect && !redirectPath.includes("paymentId=") && response.razorpay_payment_id) {
            const separator = redirectPath.includes("?") ? "&" : "?";
            redirectPath = `${redirectPath}${separator}paymentId=${response.razorpay_payment_id}`;
          }

          // Fire verification non-blocking in background with keepalive
          fetch("/api/event/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({
              ...response,
              type: "ticket",
              eventId,
              quantity,
              name: prefill?.name || "",
              email: prefill?.email || "",
              phone: prefill?.contact || "",
              description: description || "Event Registration",
            }),
          }).catch((err) => {
            console.error("Background payment verification error:", err);
          });

          onSuccess?.(response.razorpay_payment_id);

          // Instantaneous client-side navigation without full document reload
          try {
            router.replace(redirectPath);
          } catch (_) {
            window.location.replace(redirectPath);
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

