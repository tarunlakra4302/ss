"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isEventUpcoming, setIsEventUpcoming] = useState(true);

  useEffect(() => {
    // Check if the event date has already passed or started
    const eventStartDate = new Date("2026-08-23T10:00:00+05:30");
    if (new Date() >= eventStartDate) {
      setIsEventUpcoming(false);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 10) {
            setIsVisible(false);
          } else if (window.scrollY <= 0) {
            setIsVisible(true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isEventUpcoming) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1], // Smooth custom ease curve
          }}
          className="fixed top-0 left-0 w-full z-[1050] bg-gradient-to-r from-[#EBF0FE] to-[#E3EAFF] py-1.5 px-4 md:px-8 border-b border-blue-100/60 shadow-sm will-change-transform"
        >
          <div className="flex flex-row items-center justify-center gap-2.5 max-w-7xl mx-auto">
            <Link
              href="/events/edible-gardening-workshop"
              className="flex flex-row items-center justify-center gap-2.5 group cursor-pointer text-decoration-none"
            >
              {/* Badge/Button */}
              <span className="inline-flex items-center justify-center bg-[#1149C9] text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase rounded-sm px-2 py-0.5 shrink-0 transition-transform duration-200 group-hover:scale-105">
                REGISTER
              </span>

              {/* Text */}
              <span className="text-black text-[11px] sm:text-xs md:text-sm font-medium tracking-tight text-center">
                Join our upcoming Edible Gardening Workshop. Secure your spot today!
              </span>

              {/* Arrow */}
              <ArrowRight className="w-3.5 h-3.5 text-black shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
