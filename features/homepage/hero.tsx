"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FlowHoverButton } from "@/components/ui/flow-hover-button";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    // Attempt programmatic play to satisfy mobile autoplay policies
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser power-saving or policy
        });
      }
    }

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
    <section ref={containerRef} data-theme="dark" className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          {...{ "webkit-playsinline": "true" }}
          preload="auto"
          poster="/videos/hero-bg-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="/images/events/Children%20at%20Sapling%20Care%20%281%29.MOV" type="video/quicktime" />
        </video>
        {/* Cinematic dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col flex-1">
        


        {/* Hero Content (Main Body) */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 mt-auto pb-20 sm:pb-24 md:mt-48 md:pb-16 flex flex-col gap-6 md:gap-8">
          <h1 className="hero-element text-[clamp(2.5rem,11vw,8.75rem)] font-black uppercase leading-[0.9] tracking-tight text-white">
            Sustainable
            <br />
            Sundays
          </h1>

          <p className="hero-element max-w-2xl text-neutral-200 text-base sm:text-xl md:text-2xl leading-relaxed font-normal">
            Living sustainably shouldn&apos;t feel like a chore. And we are working to distil complex climate science with you through weekly rituals and programmes.
          </p>

          <div className="hero-element flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <FlowHoverButton
              asChild
              className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-medium text-[15px] h-auto border-none hover:text-white before:bg-black transition-all inline-flex items-center justify-center shadow-lg"
            >
              <Link href="/events" className="inline-flex items-center justify-center">
                Upcoming events
              </Link>
            </FlowHoverButton>
            <Link href="#donation-section" className="w-full sm:w-auto">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center w-full sm:w-auto bg-transparent border border-white text-white px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-white/10 transition-colors cursor-pointer text-center"
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
