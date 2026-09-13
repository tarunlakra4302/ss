"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface TypographySectionProps {
  className?: string;
}

export function TypographySection({ className = "" }: TypographySectionProps) {
  return (
    <section className={`w-full bg-white min-h-[85vh] lg:min-h-screen py-28 md:py-40 lg:py-52 flex flex-col justify-center overflow-hidden ${className}`}>
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* 1. HEADING: Large display heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="w-full text-left mb-20 md:mb-28 lg:mb-32"
        >
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold tracking-tight leading-[0.92] text-black select-none font-heading">
            Zero Hub
          </h2>
        </motion.div>

        {/* 2. LABEL + PARAGRAPH WRAP EFFECT (CSS Float Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.77, 0, 0.175, 1] }}
          className="w-full flow-root overflow-hidden"
        >
          {/* Single continuous text node with floated Explore Zero Waste Hub button */}
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-black leading-tight tracking-tight m-0 p-0">
            <Link
              href="/zero-waste-archive"
              className="group float-left inline-flex items-center gap-2.5 px-4 sm:px-5 h-8 sm:h-9 rounded-full bg-black text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.97] select-none mr-4 sm:mr-6 md:mr-8 mb-1 sm:mb-0 relative overflow-hidden will-change-transform"
            >
              {/* Shimmer highlight on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

              <span className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0.5">
                Explore Zero Waste Hub
              </span>

              <span className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:bg-white group-hover:text-black group-hover:translate-x-1 shrink-0">
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-rotate-45" />
              </span>
            </Link>
            We partner with local communities, businesses, and individuals to create a tangible impact on Bangalore&apos;s environmental future through collective action and sustainable rituals.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default TypographySection;
