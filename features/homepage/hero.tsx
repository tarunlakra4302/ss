"use client";

import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { Calendar, HeartHandshake } from "lucide-react";
import { useLoading } from "./loading-context";

export function Hero() {
  const { heroImage } = useLoading();

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE HERO SECTION (< md) - Matches small screen UI screenshot         */}
      {/* ========================================================================= */}
      <SectionContainer 
        data-theme="dark"
        isFullWidth
        className="md:hidden min-h-screen flex items-center justify-center bg-[#071F16] relative overflow-hidden pt-28 pb-20"
      >
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-[#071F16]/90 z-[1]" />
          </>
        )}

        <div className="flex flex-col items-center text-center space-y-6 relative z-20 w-full px-6 max-w-sm mx-auto">
          <div className="space-y-4 text-center items-center flex flex-col w-full">
            <h1 className="text-4xl sm:text-5xl font-sora font-black tracking-tight uppercase leading-[0.9] text-white text-center">
              Sustainable <br /> <span className="text-white">Sundays</span>
            </h1>

            <p className="max-w-[310px] text-[15px] text-white/80 font-sans font-normal leading-relaxed tracking-tight text-center pt-1">
              Living sustainably shouldn&apos;t feel like a chore. And we are working to distil complex climate science with you through weekly rituals and programmes.
            </p>

            <div className="flex flex-row items-center justify-center gap-4 w-full pt-3">
              <Link href="/events">
                <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black text-[15px] font-medium tracking-tight hover:opacity-90 hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm whitespace-nowrap">
                  Upcoming events
                </span>
              </Link>
              <Link href="#donation-section">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-[1.5px] border-white bg-transparent text-white text-[15px] font-medium tracking-tight hover:bg-white/10 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  Donate now
                </span>
              </Link>
            </div>
          </div>

          <div className="pt-2 flex flex-col items-center gap-2 w-full">
            <div className="h-6 w-[1px] bg-white/30 mb-1" />
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-bold flex flex-col items-center leading-tight">
              <span>Scroll</span>
              <span>Down</span>
            </div>
            <div className="w-4 h-6 rounded-full border-2 border-white/60 flex justify-center p-1 mt-0.5">
              <div className="w-1 h-1.5 bg-white rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Mobile Floating Badge Bottom Left */}
        <div className="fixed bottom-6 left-5 z-40 md:hidden pointer-events-auto">
          <div className="bg-[#121212]/90 border border-white/10 rounded-xl px-3 py-2 text-[11px] font-bold text-white tracking-widest shadow-lg flex items-center justify-center">
            S/S
          </div>
        </div>

        {/* Mobile Floating Widget Bottom Right */}
        <div className="fixed bottom-6 right-5 z-40 md:hidden pointer-events-auto">
          <div className="bg-[#0D281E] border border-white/10 rounded-2xl p-1.5 flex flex-col gap-1.5 shadow-2xl">
            <Link href="/events" className="p-2.5 rounded-xl bg-[#1E4334] text-white flex items-center justify-center shadow-inner hover:bg-[#25503e] transition-colors" aria-label="Events">
              <Calendar className="w-5 h-5" />
            </Link>
            <Link 
              href="#donation-section" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2.5 rounded-xl text-white/70 hover:text-white flex items-center justify-center transition-colors" 
              aria-label="Donate"
            >
              <HeartHandshake className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </SectionContainer>

      {/* ========================================================================= */}
      {/* DESKTOP HERO SECTION (>= md) - Original UI restored 100%                 */}
      {/* ========================================================================= */}
      <SectionContainer 
        data-theme="dark"
        isFullWidth
        className="hidden md:flex min-h-screen items-center justify-start bg-primary-container relative overflow-hidden"
      >
        {/* Hero background image */}
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-primary-container/75 z-[1]" />
          </>
        )}

        {/* Hero Content */}
        <div className="flex flex-col items-start text-left space-y-12 relative z-20 py-20 w-full px-12 lg:px-16">
          <div className="space-y-4 text-left items-start flex flex-col">
            <h1 className="text-7xl lg:text-9xl font-sora font-black tracking-tight uppercase leading-[0.9] text-primary-fixed-dim text-left">
              Sustainable <br /> <span className="text-outline-variant">Sundays</span>
            </h1>
            <div className="flex flex-row items-center justify-start gap-4">
              <Link href="/events" className="inline-block">
                <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black text-[15px] font-medium tracking-tight hover:opacity-90 hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm">
                  Upcoming events
                </span>
              </Link>
              <Link href="#donation-section" className="inline-block">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-[1.5px] border-white bg-transparent text-white text-[15px] font-medium tracking-tight hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  Donate now
                </span>
              </Link>
            </div>
          </div>

          <p className="max-w-[700px] text-2xl text-on-primary-container font-sans font-medium leading-relaxed tracking-tight text-left">
            Living sustainably shouldn&apos;t feel like a chore. And we are working to distil complex climate science with you through weekly rituals and programmes.
          </p>
        </div>

        {/* Scroll Indicators */}
        <div className="absolute bottom-12 right-16 lg:right-24 flex flex-col items-center gap-6 z-20">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-neutral-200" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-black">
              Scroll down
            </span>
            <div className="h-[1px] w-12 bg-neutral-200" />
          </div>

          <div className="w-5 h-8 rounded-full border-2 border-neutral-200 flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
