"use client"

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ArchiveHero() {
  const container = useRef(null);
  const bgImage = useRef(null);

  useGSAP(() => {
    gsap.to(bgImage.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden" ref={container} data-theme="dark">
      {/* Hero Background Image with Parallax */}
      <div className="absolute inset-0 z-0 h-[130%]">
        <img
          ref={bgImage}
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000"
          alt="Sustainability Background"
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/80 via-transparent to-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 pt-24 pb-12 md:pt-32 md:pb-20 max-w-5xl mx-auto"
      >
        <p className="meta-label text-brand-accent tracking-[0.2em] font-bold uppercase mb-4 md:mb-6 drop-shadow-sm">Sustainability Directory</p>
        
        <h1 className="text-[10vw] sm:text-5xl md:text-8xl lg:text-9xl font-serif leading-none tracking-tight md:tracking-tighter text-white mb-6 md:mb-16 drop-shadow-md">
          THE NEW <br />
          <span className="italic text-brand-accent font-light uppercase">MINIMALISM</span>
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-sm md:text-xl font-sans text-white/90 leading-relaxed drop-shadow-sm font-medium">
            A curated exploration of space, void, and the essential sustainable structures defining modern zero-waste living.
          </p>
        </div>
      </motion.div>

      {/* Scroll Indicators - Absolute positioned to bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-6 md:bottom-12 md:right-16 lg:right-24 flex flex-col items-center gap-4 z-20"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-white/20" />
          <span className="text-[9px] uppercase tracking-[0.5em] text-white/60 font-medium">
            Scroll down
          </span>
          <div className="h-[1px] w-8 bg-white/20" />
        </div>

        <div className="w-5 h-9 rounded-full border border-white/10 flex justify-center p-1.5 bg-black/10 backdrop-blur-sm relative">
          <motion.div
            animate={{
              y: [0, 12, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-1.5 bg-brand-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
