"use client";

import React from "react";
import { motion } from "framer-motion";

interface PhilosophySectionProps {
  eyebrow?: string;
  headline?: string;
  body?: string;
  className?: string;
}

export function PhilosophySection({
  eyebrow = "OUR PHILOSOPHY",
  headline = "We believe Sundays shouldn’t just be for resting. By uniting people with a shared purpose, we turn the weekend into a catalyst for climate action.",
  body = "Sunday is the bridge between the week behind us and the week ahead. It’s the perfect day to pause, reset, and step outside. Transform your Sunday, and together, we’ll change the trajectory of our environment.",
  className = "",
}: PhilosophySectionProps) {
  return (
    <section className={`w-full bg-white text-black py-16 md:py-20 pl-6 md:pl-12 lg:pl-16 pr-0 overflow-hidden ${className}`}>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          {/* Column 1: Label in left column */}
          <div className="col-span-12 md:col-span-3 pt-0 md:pt-2">
            <motion.span
              className="text-base sm:text-lg md:text-[40px] md:leading-[1.1] font-bold tracking-wider md:tracking-normal uppercase block text-[#B5563C]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            >
              {eyebrow}
            </motion.span>
          </div>

          {/* Column 2: Complete Right Side: Heading + Indented Paragraph */}
          <div className="col-span-12 md:col-span-9 w-full text-left pr-0">
            <motion.h2
              className="text-[28px] sm:text-[32px] md:text-[35px] font-bold text-black tracking-tight leading-[1.15] w-full text-left pr-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.77, 0, 0.175, 1] }}
            >
              {headline}
            </motion.h2>

            <motion.p
              className="mt-8 md:mt-12 w-full text-xl sm:text-2xl md:text-[1.75rem] lg:text-3xl text-black/85 font-normal leading-relaxed tracking-tight text-left pr-6 md:pr-12"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.77, 0, 0.175, 1] }}
            >
              {body}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhilosophySection;
