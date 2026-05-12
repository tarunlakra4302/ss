"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export const ContactForm = () => {
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
      <div className="contact-copy">
        <h2 className="text-2xl md:text-3xl">Got any questions?</h2>
      </div>
      <div className="contact-copy">
        <Link className="text-xl md:text-3xl hover:underline break-all" href="mailto:sustainablesundays@gmail.com">
          sustainablesundays@gmail.com
        </Link>
      </div>

      <form className="flex flex-col gap-4 md:gap-6 mt-2 md:mt-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm md:text-base"
            placeholder="Your message..."
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 md:px-8 md:py-3 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity w-fit text-sm md:text-base"
        >
          Send Message
        </button>
      </form>

      <div className="mt-8 md:absolute md:bottom-6 flex gap-8 justify-center md:justify-start">
        <Link href="https://www.instagram.com" className="text-lg hover:underline">
          Instagram
        </Link>
        <Link href="https://wa.me" className="text-lg hover:underline">
          Whatsapp
        </Link>
        <Link href="https://linkedin.com" className="text-lg hover:underline">
          Linkedin
        </Link>
      </div>
    </motion.div>
  );
};
