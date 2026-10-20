import Razorpay from "razorpay";

/**
 * Singleton Razorpay Client with Lazy Initialization.
 * Deferring client instantiation avoids top-level execution during serverless
 * container cold starts and reuses the initialized client across warm requests.
 */

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (razorpayInstance) return razorpayInstance;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Missing Razorpay environment variables (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).");
  }

  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });

  return razorpayInstance;
}
