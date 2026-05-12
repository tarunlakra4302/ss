"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FlowHoverButton } from '@/components/ui/flow-hover-button';
import { ArrowRight } from 'lucide-react';

export function MissionSection() {
  return (
    <section className="relative z-20 bg-background text-foreground h-[120vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight relative text-foreground"
          >
            Join the Sustainable Sundays <span className="text-black/40">Movement</span><br />
            <span className="text-xl md:text-2xl font-normal opacity-90 block mt-6 max-w-2xl mx-auto leading-relaxed">
              Don&apos;t do it alone. Spend your Sundays with people who give a damn and make a tangible impact.
            </span>
            <span className="text-lg md:text-xl font-bold block mt-6 tracking-widest uppercase text-primary">
              LEARN. ACT. SUSTAIN.
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.2,
            }}
          >
            <FlowHoverButton asChild className="relative z-30">
              <Link href="/about" className="flex items-center gap-2">
                Why We Do It
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </FlowHoverButton>
          </motion.div>
          <motion.hr
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.4,
            }}
            className="mt-12 border-t border-gray-300 dark:border-gray-700 w-full"
          />
        </div>
      </div>
    </section>
  );
}
