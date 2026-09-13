"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PhilosophySectionProps {
  eyebrow?: string;
  headline?: string;
  body?: string;
  className?: string;
}

export function StorySection({
  eyebrow = "(OUR PHILOSOPHY)",
  headline = "We believe Sundays shouldn't just be for resting. By uniting people with a shared purpose, we turn the weekend into a catalyst for climate action.",
  body = "Sunday is the bridge between the week behind us and the week ahead. It's the perfect day to pause, reset, and step outside. Transform your Sunday, and together, we'll change the trajectory of our environment.",
  className = "",
}: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!sectionRef.current) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", // Triggers when the top of the section hits 80% of the viewport height
        toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
      }
    });

    // Eyebrow animation
    tl.fromTo(".story-eyebrow", 
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    // Headline animation
    .fromTo(".story-headline",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
      "-=0.6" // Start slightly before the eyebrow finishes
    )
    // Body paragraph animation
    .fromTo(".story-body",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
      "-=0.7" // Start slightly before the headline finishes
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={`bg-white text-black relative font-sans w-full py-16 md:py-20 pl-6 md:pl-12 lg:pl-16 pr-0 overflow-hidden ${className}`}>
      <div className="w-full">
        {/*
          Layout structure:
          - Desktop: Eyebrow label on left (col-span-3), Heading + Paragraph on the right (col-span-9) with no gap on the right edge of the screen.
          - Mobile: Single column stack.
        */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          {/* ── Column 1 · Eyebrow Label (Top-Left) ── */}
          <div className="col-span-12 md:col-span-3 pt-0 md:pt-1.5">
            <span className="story-eyebrow text-xs font-semibold tracking-wider uppercase block text-[#B5563C] opacity-0 will-change-transform">
              {eyebrow}
            </span>
          </div>

          {/* ── Column 2 · Complete Right Side: Heading + Paragraph ── */}
          <div className="col-span-12 md:col-span-9 w-full text-left pr-0">
            {/* Heading — scales and spans flush to the right edge with no right gap */}
            <h2 className="story-headline text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.5rem,4.2vw,5.5rem)] font-bold text-black tracking-tight leading-[1.05] w-full text-left pr-0 opacity-0 will-change-transform">
              {headline}
            </h2>

            {/* Paragraph — sits indented under the right half of the heading, increased text size */}
            <p className="story-body mt-8 md:mt-12 w-full max-w-xl md:ml-[36%] lg:ml-[40%] text-xl sm:text-2xl md:text-[1.75rem] lg:text-3xl text-black/85 font-normal leading-relaxed tracking-tight text-left pr-6 md:pr-12 opacity-0 will-change-transform">
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

