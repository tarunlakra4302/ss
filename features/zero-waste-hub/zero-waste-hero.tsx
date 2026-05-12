"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionContainer } from "@/components/layout/section-container";
import TextAnimation1 from "@/components/TextAnimation1";

export function ZeroWasteHero() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.5,
    })
    .from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    }, "-=0.8");

  }, { scope: container });

  return (
    <SectionContainer 
      ref={container}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center bg-[#f5f5f5] relative overflow-hidden pt-32"
    >
      <div className="relative z-10 space-y-6 max-w-5xl px-6">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-neutral-900"
        >
          Zero Waste <br /> 
          <span className="text-neutral-400">Hub</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-neutral-600 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Redefining our relationship with resources. Join the movement towards a circular, waste-free future.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    </SectionContainer>
  );
}
