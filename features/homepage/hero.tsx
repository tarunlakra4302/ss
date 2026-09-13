"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FlowHoverButton } from "@/components/ui/flow-hover-button";
import { usePageTransition } from "@/components/ui/page-transition";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { isTransitioning } = usePageTransition();
  const hasAnimatedRef = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prevIsTransitioningRef = useRef(isTransitioning);

  const runAnimation = useCallback((isInitialLoad: boolean = true) => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;
    const buttonsEl = buttonsRef.current;
    const videoContainerEl = videoContainerRef.current;
    if (!titleEl || !subtitleEl || !buttonsEl || !videoContainerEl) return;

    const subtitleRect = subtitleEl.getBoundingClientRect();
    const titleRect = titleEl.getBoundingClientRect();
    const bottomPadding = window.innerWidth < 768 ? 28 : 52;
    
    // The offset to move elements to the bottom of the screen
    const offset = window.innerHeight - subtitleRect.bottom - bottomPadding;
    const startY = Math.max(offset, 160);

    if (tlRef.current) {
      tlRef.current.kill();
    }

    const ease =
      typeof window !== "undefined" && gsap.parseEase("awwwardsEase")
        ? "awwwardsEase"
        : "power4.out";

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Calculate the video strip clip path (matching title bounding box at startY)
    const titleTop = titleRect.top + startY;
    const titleBottom = window.innerHeight - (titleTop + titleRect.height);
    const videoStripClipPath = `inset(${titleTop}px 0px ${titleBottom}px 0px)`;

    // 1. Initial setup
    if (isInitialLoad) {
      tl.set(videoContainerEl, {
        clipPath: `inset(${titleTop + titleRect.height}px 0px ${titleBottom}px 0px)`
      });
    } else {
      tl.set(videoContainerEl, {
        clipPath: "inset(0px 0px 0px 0px)"
      });
    }

    const headerEl = document.querySelector(".site-header-wrapper");

    tl.set(titleEl, {
      y: startY + 40,
      autoAlpha: 1,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    tl.set([subtitleEl, buttonsEl], {
      y: startY + 40,
      autoAlpha: 0,
    });
    
    if (headerEl) {
      tl.set(headerEl, {
        y: 40,
        autoAlpha: 0,
      });
    }

    // 1.5. Reveal the background video strip first (if initial load)
    if (isInitialLoad) {
      tl.to(videoContainerEl, {
        clipPath: videoStripClipPath,
        duration: 1.0,
        ease: ease as any,
      });
    }

    // 2. Reveal ONLY the title text at the bottom of the screen
    const titlePosition = isInitialLoad ? "-=0.2" : "+=0";
    tl.to(titleEl, {
      y: startY,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.2,
      ease: ease as any,
    }, titlePosition);

    // 3. AFTER text reveal ends, expand the bg video to full screen (if initial load)
    if (isInitialLoad) {
      tl.to(videoContainerEl, {
        clipPath: "inset(0px 0px 0px 0px)",
        duration: 1.2,
        ease: ease as any,
        clearProps: "clipPath",
      });
    }

    // AND simultaneously shift ALL elements up into natural resting position
    const positionParam = isInitialLoad ? "<" : "+=0";
    
    tl.to([titleEl, subtitleEl, buttonsEl, headerEl].filter(Boolean), {
      y: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: ease as any,
      clearProps: "transform,clipPath",
    }, positionParam);

    // 4. Fade in the subtitle, buttons, and header simultaneously as they shift up
    tl.to([subtitleEl, buttonsEl, headerEl].filter(Boolean), {
      autoAlpha: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "opacity,visibility",
    }, "<");

  }, []);

  useEffect(() => {
    if (isTransitioning) {
      const handleComplete = () => {
        runAnimation(false); // Navigation = no video expansion
      };
      window.addEventListener("pageTransitionComplete", handleComplete, { once: true });
      return () => {
        window.removeEventListener("pageTransitionComplete", handleComplete);
      };
    } else {
      let isMounted = true;
      const initAnim = () => {
        if (!isMounted) return;
        runAnimation(true); // Initial load = video expansion
      };

      if (document.fonts) {
        document.fonts.ready.then(() => {
          setTimeout(initAnim, 50);
        });
      } else {
        setTimeout(initAnim, 100);
      }

      return () => {
        isMounted = false;
      };
    }
  }, [isTransitioning, runAnimation]);

  useEffect(() => {
    if (prevIsTransitioningRef.current && !isTransitioning) {
      runAnimation(false); // Fallback for navigation completion
    }
    prevIsTransitioningRef.current = isTransitioning;
  }, [isTransitioning, runAnimation]);

  useEffect(() => {
    // Attempt programmatic play to satisfy mobile autoplay policies
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser power-saving or policy
        });
      }
    }
    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  return (
    <section ref={containerRef} data-theme="dark" className="relative min-h-screen w-full flex flex-col overflow-hidden bg-white">
      {/* Background Video Layer */}
      <div ref={videoContainerRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black">
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
          <h1 
            ref={titleRef}
            style={{ opacity: 0, visibility: 'hidden' }}
            className="text-[clamp(2.5rem,11vw,8.75rem)] font-black uppercase leading-[0.9] tracking-tight text-white"
          >
            Sustainable
            <br />
            Sundays
          </h1>

          <p 
            ref={subtitleRef}
            style={{ opacity: 0, visibility: 'hidden' }}
            className="max-w-2xl text-neutral-200 text-base sm:text-xl md:text-2xl leading-relaxed font-normal"
          >
            Living sustainably shouldn&apos;t feel like a chore. And we are working to distil complex climate science with you through weekly rituals and programmes.
          </p>

          <div 
            ref={buttonsRef}
            style={{ opacity: 0, visibility: 'hidden' }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
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
