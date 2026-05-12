"use client";

import { useState } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";

// ─── CONFIG — Edit these values for each event ───────────────────────────────
const EVENT_CONFIG = {
  title: "Sustainable Sundays x Local Artisans: Spring Market 2026",
  date: "Saturday May 30, 2026 @ 9am EDT",
  ticketLabel: "General Admission",
  ticketPrice: 50,          // INR per ticket
  totalAvailable: 400,
  donationPresets: [25, 50, 100, 250],
  bookingFee: 0,
};
// ─────────────────────────────────────────────────────────────────────────────

type Step = "tickets" | "details" | "donate";

export default function EventCheckout() {
  const { openPayment } = useRazorpay();

  // Step state
  const [step, setStep] = useState<Step>("tickets");

  // Ticket state
  const [quantity, setQuantity] = useState(1);

  // Details form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [email, setEmail]         = useState("");

  // Donation state
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
  const [customDonation, setCustomDonation]       = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const ticketTotal =
    EVENT_CONFIG.ticketPrice * quantity + EVENT_CONFIG.bookingFee;

  const resolvedDonation = selectedDonation ?? Number(customDonation);

  const resetError = () => setError(null);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(EVENT_CONFIG.totalAvailable, q + delta)));
  };

  const handleDetailsSubmit = () => {
    resetError();
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!lastName.trim())  { setError("Please enter your last name."); return; }
    if (!phone.trim())     { setError("Please enter your phone number."); return; }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    openPayment({
      amount: ticketTotal,
      type: "ticket",
      quantity,
      description: `${quantity}x ${EVENT_CONFIG.ticketLabel} — ₹${ticketTotal}`,
      prefill: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        contact: phone,
      },
      onDismiss: () => { setIsLoading(false); },
      onError: (msg) => { setIsLoading(false); setError(msg); },
    });
  };

  const handleDonateNow = () => {
    resetError();
    const amount = resolvedDonation;
    if (!amount || isNaN(amount) || amount < 1) {
      setError("Please select or enter a donation amount.");
      return;
    }
    setIsLoading(true);
    openPayment({
      amount,
      type: "donation",
      description: `Donation — Sustainable Sundays ₹${amount}`,
      onDismiss: () => { setIsLoading(false); },
      onError: (msg) => { setIsLoading(false); setError(msg); },
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto shadow-lg">

      {/* ── SCREEN 1: Ticket Selection ── */}
      {step === "tickets" && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {EVENT_CONFIG.title}
          </h2>
          <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
            <span>🕐</span> {EVENT_CONFIG.date}
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">
                {EVENT_CONFIG.ticketLabel}
              </span>
              <span className="font-bold text-gray-900">
                ₹{EVENT_CONFIG.ticketPrice}.00
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Availability
                </p>
                <p className="text-xs font-bold text-gray-700">
                  {EVENT_CONFIG.totalAvailable} Remaining
                </p>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-lg px-4 py-2 border border-gray-200">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="text-gray-600 font-bold text-lg hover:text-gray-900 transition"
                >
                  −
                </button>
                <span className="font-semibold text-gray-900 w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="text-gray-600 font-bold text-lg hover:text-gray-900 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("details")}
            className="w-full bg-[#0f1f3d] text-white py-4 rounded-full font-semibold hover:opacity-90 transition mb-3"
          >
            Continue
          </button>
          <button
            onClick={() => setStep("donate")}
            className="w-full border border-gray-200 text-gray-700 py-4 rounded-full font-semibold hover:bg-gray-50 transition"
          >
            I'd just like to donate
          </button>
        </>
      )}

      {/* ── SCREEN 2: Your Details ── */}
      {step === "details" && (
        <>
          <button
            onClick={() => { setStep("tickets"); resetError(); }}
            className="flex items-center gap-1 text-sm text-gray-600 mb-4 hover:text-gray-900 transition"
          >
            ← Back to tickets
          </button>

          <p className="text-sm text-gray-500 mb-1">
            {quantity}× {EVENT_CONFIG.ticketLabel} — ₹{EVENT_CONFIG.ticketPrice * quantity}.00
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>

          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0f1f3d] transition"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0f1f3d] transition"
            />
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0f1f3d] transition"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0f1f3d] transition"
            />
          </div>

          <div className="border-t border-gray-100 pt-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{quantity}× {EVENT_CONFIG.ticketLabel}</span>
              <span>₹{EVENT_CONFIG.ticketPrice * quantity}.00</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Booking Fee</span>
              <span>₹{EVENT_CONFIG.bookingFee}.00</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
              <span>Total</span>
              <span>₹{ticketTotal}.00</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-3 text-center">{error}</p>
          )}

          <button
            onClick={handleDetailsSubmit}
            disabled={isLoading}
            className="w-full bg-[#0f1f3d] text-white py-4 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60 mb-3"
          >
            {isLoading ? "Processing..." : "Proceed to Payment →"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            🔒 Secure checkout · Razorpay
          </p>
        </>
      )}

      {/* ── SCREEN 3: Donate ── */}
      {step === "donate" && (
        <>
          <button
            onClick={() => { setStep("tickets"); resetError(); }}
            className="flex items-center gap-1 text-sm text-gray-600 mb-4 hover:text-gray-900 transition"
          >
            ← Back to tickets
          </button>

          <h2 className="text-3xl font-black text-[#0f1f3d] uppercase leading-tight mb-3">
            Support Sustainable Sundays
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Every contribution directly funds our community initiatives and
            global impact projects.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {EVENT_CONFIG.donationPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setSelectedDonation(preset);
                  setCustomDonation("");
                  resetError();
                }}
                className={`py-4 rounded-xl border text-sm font-semibold transition ${
                  selectedDonation === preset
                    ? "bg-[#0f1f3d] text-white border-[#0f1f3d]"
                    : "bg-white text-gray-400 border-gray-200 hover:border-[#0f1f3d] hover:text-[#0f1f3d]"
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>

          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              ₹
            </span>
            <input
              type="number"
              placeholder="Custom Amount"
              value={customDonation}
              onChange={(e) => {
                setCustomDonation(e.target.value);
                setSelectedDonation(null);
                resetError();
              }}
              className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:border-[#0f1f3d] transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-3 text-center">{error}</p>
          )}

          <button
            onClick={handleDonateNow}
            disabled={isLoading}
            className="w-full bg-[#0f1f3d] text-white py-4 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {isLoading ? "Processing..." : "Donate Now"}
          </button>
        </>
      )}

    </div>
  );
}
