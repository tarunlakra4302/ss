"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";

import { useLoading } from "./loading-context";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Hero() {
  const { isComplete } = useLoading();

  return (
    <SectionContainer 
      className="min-h-screen flex items-center justify-center bg-[#a6ff00] relative overflow-hidden"
      style={{
        opacity: isComplete ? 1 : 0,
        transition: 'opacity 0.05s linear'
      }}
    >
      {/* Hero Content - Animates only after expansion complete */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isComplete ? "visible" : "hidden"}
        className="flex flex-col items-start text-left space-y-12 relative z-20 pt-20 w-full px-8 md:px-16 lg:px-24"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-neutral-900">
            Sustainable <br /> <span className="text-neutral-400">Sundays</span>
          </motion.h1>
          <div className="flex flex-wrap gap-3">
            <Link href="/events" className="inline-block">
              <motion.span
                variants={itemVariants}
                className="inline-block px-4 py-1.5 rounded-full border border-neutral-200 bg-white text-black text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-neutral-100 transition-colors shadow-sm"
              >
                Upcoming Events
              </motion.span>
            </Link>
            <motion.span
              variants={itemVariants}
              onClick={() => {
                const element = document.getElementById('donation-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-block px-4 py-1.5 rounded-full border border-neutral-200 bg-neutral-100/50 backdrop-blur-md text-neutral-900 md:text-primary text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-neutral-200 transition-colors"
            >
              Donate us
            </motion.span>
          </div>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="max-w-[700px] text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed tracking-tight"
        >
          Living sustainably shouldn&apos;t feel like a chore. We’ve distilled complex climate science into actionable, weekly rituals.
        </motion.p>

      </motion.div>

      {/* Scroll Indicators - Absolute positioned to bottom right */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={isComplete ? "visible" : "hidden"}
        className="absolute bottom-12 right-8 md:right-16 lg:right-24 flex flex-col items-center gap-6 z-20"
      >
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-neutral-200" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-black">
            Scroll down
          </span>
          <div className="h-[1px] w-12 bg-neutral-200" />
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-5 h-8 rounded-full border-2 border-neutral-200 flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
