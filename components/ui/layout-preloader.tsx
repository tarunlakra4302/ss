"use client";

import React, { useRef, useState, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { useLoading } from "@/features/homepage/loading-context";
import "./layout-preloader.css";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const FlipPlugin = typeof window !== "undefined" ? require("gsap/Flip").Flip : null;

if (typeof window !== "undefined" && FlipPlugin) {
  gsap.registerPlugin(FlipPlugin);
}

const IMAGES = [
  "/ss%20preloader%20images/1.jpeg",
  "/ss%20preloader%20images/2.jpeg",
  "/ss%20preloader%20images/3.jpeg",
  "/ss%20preloader%20images/4.jpeg",
];

interface LayoutPreloaderProps {
  children: React.ReactNode;
}

export function LayoutPreloader({ children }: LayoutPreloaderProps) {
  const { setIsLoading, setIsComplete, setHeroImage } = useLoading();

  // Communicate the last preloader image to the hero section
  const heroImageSrc = IMAGES[IMAGES.length - 1];

  const preloaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const finalImageRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [childrenReady, setChildrenReady] = useState(false);
  const [preloaderVisible, setPreloaderVisible] = useState(true);

  const setImageWrapperRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      imageWrappersRef.current[index] = el;
    },
    []
  );

  useLayoutEffect(() => {
    // Lock scroll
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tlRef.current = tl;

      // ─── Phase 1: Show side text ───
      tl.to(
        [textLeftRef.current, textRightRef.current],
        {
          opacity: 1,
          y: "-50%",
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        },
        0.3
      );

      // ─── Phase 2: Image cycling with clip-path reveals ───
      const wrappers = imageWrappersRef.current.filter(Boolean);
      const imageDelay = 0.5;

      wrappers.forEach((wrapper, i) => {
        if (!wrapper) return;
        const img = wrapper.querySelector("img");
        const startTime = imageDelay + i * 0.7;

        // Reveal with clip-path
        tl.set(wrapper, { visibility: "visible" }, startTime);
        tl.fromTo(
          wrapper,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.6,
            ease: "power3.inOut",
          },
          startTime
        );

        // Subtle zoom on image
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.4 },
            {
              scale: 1.2,
              duration: 0.8,
              ease: "power2.out",
            },
            startTime
          );
        }
      });

      // ─── Phase 3: FLIP expansion of final image ───
      const flipTime = imageDelay + wrappers.length * 0.7 + 0.3;

      tl.call(
        () => {
          if (!finalImageRef.current || !containerRef.current) return;

          // Ensure final image is visible before FLIP captures state
          finalImageRef.current.style.visibility = "visible";

          // Record initial state
          const state = FlipPlugin.getState(finalImageRef.current);

          // Apply fullscreen styles
          finalImageRef.current.style.position = "fixed";
          finalImageRef.current.style.top = "50%";
          finalImageRef.current.style.left = "50%";
          finalImageRef.current.style.width = "100dvw";
          finalImageRef.current.style.height = "100dvh";
          finalImageRef.current.style.transform = "translate(-50%, -50%)";
          finalImageRef.current.style.zIndex = "5";

          // Pre-mount Hero background image and enable underlying DOM
          setHeroImage(heroImageSrc);
          setChildrenReady(true);

          // Fade out side text smoothly during expansion
          gsap.to([textLeftRef.current, textRightRef.current], {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });

          // Smoothly settle the image scale concurrently with FLIP expansion
          const finalImg = finalImageRef.current.querySelector("img");
          if (finalImg) {
            gsap.to(finalImg, {
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
            });
          }

          // Transition container to overflow visible
          gsap.set(containerRef.current, { overflow: "visible" });

          // Animate the FLIP transition
          FlipPlugin.from(state, {
            duration: 1.1,
            ease: "power4.inOut",
            absolute: true,
            onComplete: () => {
              setIsLoading(false);
              setIsComplete(true);

              if (preloaderRef.current) {
                gsap.to(preloaderRef.current, {
                  opacity: 0,
                  duration: 0.7,
                  ease: "power3.inOut",
                  onComplete: () => {
                    setPreloaderVisible(false);
                    document.body.style.overflow = "";
                    document.documentElement.style.overflow = "";
                  },
                });
              } else {
                setPreloaderVisible(false);
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";
              }
            },
          });
        },
        [],
        flipTime
      );
    }, preloaderRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [setIsLoading, setIsComplete]);

  return (
    <div className="relative min-h-screen bg-background overflow-x-clip flex flex-col flex-1">
      {/* Site children — hidden until preloader completes */}
      <div
        className={`relative flex flex-col flex-1 transition-opacity duration-300 ${
          childrenReady
            ? "pointer-events-auto opacity-100 visible"
            : "pointer-events-none opacity-0 invisible"
        }`}
      >
        {children}
      </div>

      {/* Preloader overlay */}
      {preloaderVisible && (
        <div ref={preloaderRef} className="layout-preloader">
          {/* Noise overlay */}
          <div className="preloader-noise" />

          {/* ── Side text: SU ── */}
          <div
            ref={textLeftRef}
            className="text-element"
            style={{ top: "50%", left: 13 }}
          >
            SU
          </div>

          {/* ── Image container ── */}
          <div ref={containerRef} className="preloader-container">
            {IMAGES.map((src, i) => {
              const isLast = i === IMAGES.length - 1;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    imageWrappersRef.current[i] = el;
                    if (isLast) {
                      finalImageRef.current = el;
                    }
                  }}
                  className="image-wrapper"
                  id={isLast ? "final-image" : undefined}
                >
                  <img
                    src={src}
                    alt={`Image ${i + 1}`}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Side text: ND ── */}
          <div
            ref={textRightRef}
            className="text-element"
            style={{ top: "50%", right: 13, left: "auto" }}
          >
            ND
          </div>
        </div>
      )}
    </div>
  );
}
