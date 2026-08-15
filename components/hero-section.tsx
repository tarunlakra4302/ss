"use client";

import React from "react";
import { Menu } from "lucide-react";
import { GradientBackground } from "@/components/ui/silk-blend-gradient";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Background Layer */}
      <GradientBackground className="absolute inset-0 z-0" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Bar (Top) */}
        <header className="flex justify-between items-center w-full p-6 md:p-10">
          {/* Left (Logo) */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
            <img
              src="/SS Logo_white Text clean.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right (Menu) */}
          <button
            type="button"
            className="flex items-center text-white font-semibold text-sm tracking-wide uppercase hover:opacity-80 transition-opacity"
          >
            MENU
            <Menu className="text-white w-6 h-6 ml-2" />
          </button>
        </header>

        {/* Hero Content (Main Body) */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 mt-20 md:mt-32 flex-1">
          <div className="flex flex-col gap-8">
            {/* Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black uppercase leading-[0.9] tracking-tight text-[#CBF6E0] whitespace-pre-line">
              SUSTAINABLE{"\n"}SUNDAYS
            </h1>

            {/* Buttons Row */}
            <div className="flex flex-row items-center gap-4">
              <button
                type="button"
                className="bg-white text-black px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-gray-100 transition-colors"
              >
                Upcoming events
              </button>
              <button
                type="button"
                className="bg-transparent border border-white text-white px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-white/10 transition-colors"
              >
                Donate now
              </button>
            </div>

            {/* Subtext / Paragraph */}
            <p className="max-w-2xl text-[#8BDAB0] text-xl md:text-2xl leading-relaxed font-normal">
              Living sustainably shouldn&apos;t feel like a chore. And we are
              working to distil complex climate science with you through weekly
              rituals and programmes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
