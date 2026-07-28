"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { submitToGoogleScript } from "@/lib/google/script";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function TicketSidebarCard() {
  const [view, setView] = useState<"summary" | "form">("summary");
  const [quantity, setQuantity] = useState(1);

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  // Quantity controls
  const handleMinus = () => setQuantity((q) => Math.max(1, q - 1));
  const handlePlus = () => setQuantity((q) => Math.min(10, q + 1));

  // Field updates
  const handleFieldChange =
    (field: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields({ ...fields, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    };

  // Validation
  const validateField = (field: keyof typeof fields, value: string) => {
    switch (field) {
      case "firstName":
        return value.trim() ? "" : "Please enter your first name";
      case "lastName":
        return value.trim() ? "" : "Please enter your last name";
      case "phone":
        return /^\d{10}$/.test(value.replace(/\D/g, ""))
          ? ""
          : "Enter a valid 10-digit mobile number";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Enter a valid email address";
      default:
        return "";
    }
  };

  const handleBlur = (field: keyof typeof fields) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, fields[field]),
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      firstName: validateField("firstName", fields.firstName),
      lastName: validateField("lastName", fields.lastName),
      phone: validateField("phone", fields.phone),
      email: validateField("email", fields.email),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((err) => err !== "")) {
      setSubmitState("loading");
      try {
        await submitToGoogleScript({
          formType: "event",
          firstName: fields.firstName,
          lastName: fields.lastName,
          phone: fields.phone,
          email: fields.email,
          quantity,
          donationTime: new Date().toLocaleString(),
        });
      } catch (e) {
        console.warn("Error submitting ticket data:", e);
      }
      setSubmitState("success");
    }
  };

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl p-6 w-full md:w-[360px] overflow-hidden ${dmSans.className}`}
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
    >
      <AnimatePresence mode="wait">
        {view === "summary" ? (
          <motion.div
            key="summary"
            initial={false}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            className="flex flex-col"
          >
            <h2
              className={`${playfair.className} text-[22px] font-bold text-[#1C1C1C] leading-[1.3]`}
            >
              Sustainable Sundays x ASRT Foundation: Fundraising Party at ASTRO 2026
            </h2>

            <div className="flex items-center text-[#6B7280] text-[14px] mt-2">
              <svg
                className="w-[14px] h-[14px] mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Sunday Sep 27, 2026 @ 7pm EDT
            </div>

            <hr className="my-5 border-[#E5E7EB]" />

            <div className="bg-[#F5F5F5] rounded-xl p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[14px] text-[#1C1C1C]">
                  General Admission
                </span>
                <span className="font-bold text-[20px] text-[#1C1C1C]">
                  ₹30.00
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest text-[#6B7280] uppercase">
                    Availability
                  </span>
                  <span className="text-[11px] font-semibold text-[#1C1C1C] uppercase mt-0.5">
                    400 Remaining
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMinus}
                    className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
                  >
                    <span className="text-[20px] leading-none mb-[2px] font-medium text-[#1C1C1C]">
                      -
                    </span>
                  </button>
                  <motion.span
                    key={quantity}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[18px] font-bold text-[#1C1C1C] min-w-[32px] text-center block"
                  >
                    {quantity}
                  </motion.span>
                  <button
                    onClick={handlePlus}
                    className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
                  >
                    <span className="text-[20px] leading-none mb-[2px] font-medium text-[#1C1C1C]">
                      +
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={() => setView("form")}
                className="w-full h-[52px] bg-[#0F172A] text-white font-bold text-[15px] tracking-[0.02em] rounded-full hover:bg-[#1E293B] hover:scale-[1.01] transition-all duration-200"
              >
                Continue
              </button>
              <button className="w-full h-[52px] bg-white text-[#374151] font-medium text-[14px] rounded-full border-[1.5px] border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-[#FAFAFA] transition-colors">
                I'd just like to donate
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            className="flex flex-col"
          >
            <button
              onClick={() => {
                setView("summary");
                setSubmitState("idle");
              }}
              className="text-[#6B7280] text-[13px] hover:text-[#1C1C1C] self-start transition-colors mb-4 flex items-center"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back
            </button>

            <div className="text-[12px] text-[#6B7280] mb-1">
              {quantity} × General Admission — ₹{(quantity * 30).toFixed(2)}
            </div>

            <h2
              className={`${playfair.className} text-[20px] font-bold text-[#1C1C1C] mb-5`}
            >
              Your Details
            </h2>

            <div className="flex flex-col gap-[14px]">
              {(["firstName", "lastName", "phone", "email"] as const).map(
                (field) => (
                  <div key={field} className="flex flex-col">
                    <input
                      type={
                        field === "phone"
                          ? "tel"
                          : field === "email"
                          ? "email"
                          : "text"
                      }
                      placeholder={
                        field === "firstName"
                          ? "First Name"
                          : field === "lastName"
                          ? "Last Name"
                          : field === "phone"
                          ? "+91 XXXXX XXXXX"
                          : "Email Address"
                      }
                      value={fields[field]}
                      onChange={handleFieldChange(field)}
                      onBlur={() => handleBlur(field)}
                      className={`w-full bg-transparent py-[12px] text-[15px] text-[#1C1C1C] placeholder-[#9CA3AF] border-b-[1.5px] transition-colors duration-200 outline-none focus:outline-none ${
                        errors[field]
                          ? "border-[#EF4444]"
                          : "border-[#D1D5DB] focus:border-[#0F172A]"
                      }`}
                    />
                    <AnimatePresence>
                      {errors[field] && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            height: "auto",
                            marginTop: 4,
                          }}
                          exit={{ opacity: 0, y: -4, height: 0, marginTop: 0 }}
                          className="text-[#EF4444] text-[11px]"
                        >
                          {errors[field]}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              )}
            </div>

            <hr className="my-6 border-[#E5E7EB] border-t-[1px]" />

            <div className="flex flex-col gap-2 text-[13px] text-[#374151] mb-6">
              <div className="flex justify-between">
                <span>{quantity} × General Admission</span>
                <span>₹{(quantity * 30).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Fee</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-[#E5E7EB]">
                <span>Total</span>
                <span>₹{(quantity * 30).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitState === "loading" || submitState === "success"}
              className={`w-full h-[52px] text-white font-bold text-[15px] rounded-full transition-all duration-200 flex items-center justify-center ${
                submitState === "success"
                  ? "bg-[#16A34A]"
                  : "bg-[#0F172A] hover:bg-[#1E293B]"
              }`}
            >
              <AnimatePresence mode="wait">
                {submitState === "idle" && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Proceed to Payment →
                  </motion.span>
                )}
                {submitState === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </motion.div>
                )}
                {submitState === "success" && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    ✓ You're in!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="text-center text-[#9CA3AF] text-[12px] mt-4 flex items-center justify-center">
              <span className="mr-1">🔒</span> Secure checkout · Razorpay
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
