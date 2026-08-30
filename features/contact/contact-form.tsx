"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formStartTime = useRef<number>(0);

  useEffect(() => {
    formStartTime.current = Date.now();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const fn = firstName || (document.getElementById("firstName") as HTMLInputElement)?.value || "";
    const ln = lastName || (document.getElementById("lastName") as HTMLInputElement)?.value || "";
    const em = email || (document.getElementById("email") as HTMLInputElement)?.value || "";
    const ph = phone || (document.getElementById("phone") as HTMLInputElement)?.value || "";
    const msg = message || (document.getElementById("message") as HTMLTextAreaElement)?.value || "";

    const contactData = {
      formType: "contact",
      firstName: fn,
      lastName: ln,
      name: `${fn} ${ln}`.trim(),
      email: em,
      phone: ph,
      message: msg,
      website: honeypot,
      _formStartTime: formStartTime.current,
    };

    try {
      const res = await fetch("/api/forms/submit-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      const result = await res.json();
      if (res.ok && (result.result === "success" || result.status === "success")) {
        setStatus("success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setHoneypot("");
        (e.target as HTMLFormElement).reset();
        return;
      }
    } catch (error) {
      console.warn("Contact form submission warning, trying fallback...", error);
    }

    // Server fallback try
    try {
      const res = await fetch("/api/forms/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${fn} ${ln}`.trim() || "Contact Inquiry",
          email: em,
          phone: ph || "9999999999",
          city: "Bangalore",
          reason: `[Contact Form Message]: ${msg}`,
          website: honeypot,
          _formStartTime: formStartTime.current,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setHoneypot("");
        (e.target as HTMLFormElement).reset();
        return;
      }
    } catch (fallbackErr) {
      console.error("Server API fallback error:", fallbackErr);
    }

    setErrorMsg("Failed to send message. Please try again.");
    setStatus("error");
    setIsSubmitting(false);
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
      className="w-full max-w-md lg:max-w-lg flex flex-col gap-3 md:gap-8 -mt-6 sm:-mt-4 md:mt-0"
    >
      <form id="contactForm" onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3 md:gap-4 mt-0 w-full">
        {/* Anti-spam Honeypot field — visually hidden off-screen */}
        <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
          <label htmlFor="contact_website">Website</label>
          <input
            type="text"
            id="contact_website"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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

      <div className="mt-1 sm:mt-2 flex gap-6 justify-start">
        <a href="https://www.instagram.com/sustainable_sundays_blr/" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:underline">
          Instagram
        </a>
        <a href="https://www.whatsapp.com/channel/0029Vb8Ade0CHDyiSG6zlB0f" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:underline">
          WhatsApp
        </a>
        <a href="https://www.linkedin.com/company/sustainable-sundays" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:underline">
          LinkedIn
        </a>
      </div>
    </motion.div>
  );
};


