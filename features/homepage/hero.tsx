"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { GradientBackground } from "@/components/ui/silk-blend-gradient";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true });
      
      tl.current.fromTo(
        ".hero-element",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 }
      );
      
      tl.current.play();
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <GradientBackground className="w-full h-full" />
      </div>
      
      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col flex-1">
        


        {/* Hero Content (Main Body) */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 mt-32 md:mt-48 flex-1 flex flex-col gap-8">
          <h1 className="hero-element text-6xl md:text-8xl lg:text-[140px] font-black uppercase leading-[0.9] tracking-tight text-black">
            Sustainable
            <br />
            Sundays
          </h1>

          <p className="hero-element max-w-2xl text-black text-xl md:text-2xl leading-relaxed font-normal">
            Living sustainably shouldn&apos;t feel like a chore. And we are working to distil complex climate science with you through weekly rituals and programmes.
          </p>

          <div className="hero-element flex flex-row items-center gap-4">
            <Link href="/events">
              <span className="inline-flex items-center justify-center bg-white text-black px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-gray-100 transition-colors cursor-pointer">
                Upcoming events
              </span>
            </Link>
            <Link href="#donation-section">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center bg-transparent border border-black text-black px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-black/10 transition-colors cursor-pointer"
              >
                Donate now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
