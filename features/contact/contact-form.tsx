"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { submitToGoogleScript } from "@/lib/google/script";

export const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const contactData = {
      formType: "contact",
      firstName: firstName || (document.getElementById("firstName") as HTMLInputElement)?.value || "",
      lastName: lastName || (document.getElementById("lastName") as HTMLInputElement)?.value || "",
      email: email || (document.getElementById("email") as HTMLInputElement)?.value || "",
      phone: phone || (document.getElementById("phone") as HTMLInputElement)?.value || "",
      message: message || (document.getElementById("message") as HTMLTextAreaElement)?.value || "",
    };

    try {
      const result = await submitToGoogleScript(contactData);
      if (result && (result.result === "success" || result.status === "success")) {
        alert("Your message has been sent successfully!");
        setStatus("success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
        (e.target as HTMLFormElement).reset();
      } else {
        alert("Failed to send message. Please try again.");
        setErrorMsg("Failed to send message. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Network error. Please try again later.");
      setErrorMsg("Network error. Please try again later.");
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 1.2,
        duration: 0.6,
        ease: "easeOut",
      }}
      className="w-full md:flex-[2] flex flex-col gap-6 md:gap-8"
    >
      <form id="contactForm" onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 mt-1 md:mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-xs md:text-sm font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs md:text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Last name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-xs md:text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs md:text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-xs md:text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
            placeholder="Your message..."
          />
        </div>

        {status === "success" && (
          <p className="text-sm font-semibold text-emerald-600">Your message has been sent successfully!</p>
        )}
        {status === "error" && (
          <p className="text-sm font-semibold text-red-500">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 md:px-8 md:py-2.5 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity w-fit text-sm md:text-base disabled:opacity-50 mt-1"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>

      <div className="mt-3 flex gap-6 justify-start">
        <Link href="https://www.instagram.com" className="text-base md:text-lg hover:underline">
          Instagram
        </Link>
        <Link href="https://wa.me" className="text-base md:text-lg hover:underline">
          Whatsapp
        </Link>
        <Link href="https://linkedin.com" className="text-base md:text-lg hover:underline">
          Linkedin
        </Link>
      </div>
    </motion.div>
  );
};


