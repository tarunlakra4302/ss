"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MemoryLaneSlide {
  year: string;
  headline: string;
  description: string;
  backgroundImage: string;
}

interface MemoryLaneTimelineProps {
  data: MemoryLaneSlide[];
}

export function MemoryLaneTimeline({ data }: MemoryLaneTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || data.length === 0) return;

      const totalSlides = data.length;
      const totalSteps = totalSlides - 1;

      // Select elements
      const backgrounds = gsap.utils.toArray<HTMLElement>(".memory-bg");
      const textBlocks = gsap.utils.toArray<HTMLElement>(".memory-text-block");
      const yearItems = gsap.utils.toArray<HTMLElement>(".memory-year-item");
      const yearTexts = gsap.utils.toArray<HTMLElement>(".memory-year-text");
      const yearDots = gsap.utils.toArray<HTMLElement>(".memory-year-dot");

      // ── Initial State Before Scrolling ──
      // 1. All text is completely invisible (must NOT appear before scroll reaches 2018)
      textBlocks.forEach((tb) => {
        gsap.set(tb, { autoAlpha: 0, y: 35 });
      });

      // 2. All backgrounds are completely invisible
      backgrounds.forEach((bg) => {
        gsap.set(bg, { autoAlpha: 0 });
      });

      // 3. Years along spine start unhighlighted and slightly below the active center
      yearItems.forEach((item, i) => {
        gsap.set(item, {
          y: i === 0 ? 70 : i === 1 ? 230 : 380,
          scale: 0.5,
          autoAlpha: i <= 1 ? 0.4 : 0,
          transformOrigin: "right center",
          force3D: true,
        });
      });

      yearTexts.forEach((text) => {
        gsap.set(text, {
          color: "rgba(255, 255, 255, 0.4)",
        });
      });

      yearDots.forEach((dot) => {
        gsap.set(dot, {
          scale: 0.8,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)",
        });
      });

      const getHeaderOffset = () => (typeof window !== "undefined" && window.innerWidth >= 768 ? 112 : 80);

      // Refresh ScrollTrigger to recalculate exact positions after layout / font settling
      const handleLoad = () => {
        ScrollTrigger.refresh();
      };
      if (typeof window !== "undefined") {
        window.addEventListener("load", handleLoad);
      }

      // Master scrubbed GSAP timeline (pins below the logo/header)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: () => `top ${getHeaderOffset()}px`,
          end: () => `+=${Math.max(totalSlides * 150, 420)}vh`,
          pin: true,
          pinSpacing: true,
          scrub: 1, // Ultra-smooth scrub with gentle inertia
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
        },
      });

      // ── Step 1: Scroll travels towards 2018 (Text is strictly hidden) ──
      tl.to(
        yearItems[0],
        {
          y: 0,
          scale: 0.8,
          autoAlpha: 0.6,
          duration: 1.0,
          ease: "none",
        },
        "approach-2018"
      );
      if (yearItems[1]) {
        tl.to(
          yearItems[1],
          {
            y: 160,
            scale: 0.5,
            autoAlpha: 0.4,
            duration: 1.0,
            ease: "none",
          },
          "approach-2018"
        );
      }

      // ── Step 2: Scroll comes to 2018! ONLY THEN does 2018 text and bold year appear ──
      tl.addLabel("reach-2018");

      // 2018 becomes bold & highlighted
      tl.to(
        yearItems[0],
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "reach-2018"
      );
      tl.to(
        yearTexts[0],
        {
          color: "#ffffff",
          duration: 0.6,
          ease: "power2.out",
        },
        "reach-2018"
      );
      tl.to(
        yearDots[0],
        {
          scale: 1.3,
          backgroundColor: "#ffffff",
          boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.25)",
          duration: 0.6,
          ease: "power2.out",
        },
        "reach-2018"
      );

      // 2018 Background image fades in
      tl.to(
        backgrounds[0],
        {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "reach-2018"
      );

      // 2018 Headline and Description APPEAR!
      tl.to(
        textBlocks[0],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "reach-2018+=0.1"
      );

      // Settle time for reading the 2018 milestone
      tl.to({}, { duration: 1.0 });

      // ── Step 3: Smooth progression through subsequent slides ──
      for (let i = 0; i < totalSteps; i++) {
        const next = i + 1;
        const stepLabel = `step-${i}`;

        tl.addLabel(stepLabel);

        // 1. Crossfade background images
        if (backgrounds[i]) {
          tl.to(
            backgrounds[i],
            { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" },
            stepLabel
          );
        }
        if (backgrounds[next]) {
          tl.to(
            backgrounds[next],
            { autoAlpha: 1, duration: 1.1, ease: "power2.inOut" },
            stepLabel
          );
        }

        // 2. Crossfade text block
        if (textBlocks[i]) {
          tl.to(
            textBlocks[i],
            { autoAlpha: 0, y: -25, duration: 0.7, ease: "power2.in" },
            stepLabel
          );
        }

        // 3. Year Spine Transition:
        // Current active year shrinks, dims, and shifts up to neighbor slot
        tl.to(
          yearItems[i],
          {
            y: -160,
            scale: 0.5,
            autoAlpha: 0.4,
            duration: 1.1,
            ease: "power2.inOut",
          },
          stepLabel
        );
        tl.to(
          yearTexts[i],
          {
            color: "rgba(255, 255, 255, 0.4)",
            duration: 0.8,
            ease: "power2.inOut",
          },
          stepLabel
        );
        tl.to(
          yearDots[i],
          {
            scale: 0.8,
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)",
            duration: 0.8,
            ease: "power2.inOut",
          },
          stepLabel
        );

        // Next active year moves into center, scales up, and turns bold/highlighted
        tl.to(
          yearItems[next],
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1.1,
            ease: "power2.inOut",
          },
          stepLabel
        );
        tl.to(
          yearTexts[next],
          {
            color: "#ffffff",
            duration: 1.1,
            ease: "power2.inOut",
          },
          stepLabel
        );
        tl.to(
          yearDots[next],
          {
            scale: 1.3,
            backgroundColor: "#ffffff",
            boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.25)",
            duration: 1.1,
            ease: "power2.inOut",
          },
          stepLabel
        );

        // Next text appears
        if (textBlocks[next]) {
          tl.to(
            textBlocks[next],
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
            `${stepLabel}+=0.3`
          );
        }

        // Upcoming neighbor year (next + 1) rises into the lower neighbor slot
        if (yearItems[next + 1]) {
          tl.to(
            yearItems[next + 1],
            {
              y: 160,
              scale: 0.5,
              autoAlpha: 0.4,
              duration: 1.1,
              ease: "power2.inOut",
            },
            stepLabel
          );
        }

        // Two steps prior (i - 1) fades out smoothly
        if (i > 0 && yearItems[i - 1]) {
          tl.to(
            yearItems[i - 1],
            {
              y: -300,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power2.inOut",
            },
            stepLabel
          );
        }

        // Settle pause on each slide
        if (i < totalSteps - 1) {
          tl.to({}, { duration: 0.8 });
        }
      }

      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("load", handleLoad);
        }
      };
    },
    { scope: containerRef, dependencies: [data] }
  );

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-7rem)] overflow-hidden bg-black"
    >
        <div className="memory-lane-reveal-wrapper relative w-full h-full">
          {/* Fixed Memory Lane Label */}
          <div className="absolute top-6 left-6 md:top-8 md:left-10 z-50 pointer-events-none">
            <span className="uppercase tracking-widest text-xs sm:text-sm md:text-base text-white/70 font-medium">
              Memory Lane
            </span>
          </div>

          {/* Timeline Spine and Content Overlay */}
          <div className="absolute inset-0 z-40 pointer-events-none">
            {/* Vertical Spine Line */}
            <div className="absolute top-0 bottom-0 left-[32%] md:left-[38%] lg:left-[40%] w-[1px] md:w-[2px] bg-white/20" />

            {/* Dynamic Content Block (Headline + Description) */}
            <div className="absolute top-10 sm:top-12 md:top-14 lg:top-16 left-[36%] md:left-[42%] lg:left-[44%] right-6 md:right-12 xl:right-24 text-white pointer-events-auto">
              <div className="relative h-44 md:h-52 overflow-hidden">
                {data.map((slide, idx) => (
                  <div
                    key={idx}
                    className="memory-text-block absolute top-0 left-0 w-full will-change-transform opacity-0"
                  >
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 max-w-2xl line-clamp-2 leading-tight">
                      {slide.headline}
                    </h3>
                    <p className="font-sans font-normal text-base md:text-lg lg:text-xl text-white/85 max-w-xl line-clamp-3 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Years along the spine */}
            <div className="absolute inset-0">
              {data.map((slide, idx) => (
                <div
                  key={idx}
                  className="memory-year-item absolute right-[68%] md:right-[62%] lg:right-[60%] flex items-center justify-end origin-right pr-4 md:pr-8 will-change-transform opacity-0"
                  style={{ top: "50%" }}
                >
                  <span className="memory-year-text font-bold font-heading leading-none tracking-tight text-5xl sm:text-6xl md:text-8xl select-none">
                    {slide.year}
                  </span>

                  {/* Dot marker sitting exactly on the line */}
                  <div className="memory-year-dot absolute -right-[3px] md:-right-[4px] w-[6px] h-[6px] md:w-[8px] md:h-[8px] rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Full-Bleed Background Images with Crossfade */}
          {data.map((slide, idx) => (
            <div
              key={idx}
              className="memory-bg absolute inset-0 w-full h-full opacity-0"
            >
              <Image
                src={slide.backgroundImage}
                alt={slide.headline}
                fill
                className="object-cover"
                priority={idx === 0}
              />
              {/* Dark Gradient / Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>
      </div>
  );
}
