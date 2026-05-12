"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface VideoScrollHeroProps {
  videoSrc?: string;
  enableAnimations?: boolean;
  className?: string;
  startScale?: number;
}

export function VideoScrollHero({
  videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  enableAnimations = true,
  className = "",
  startScale = 0.65,
}: VideoScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [scrollScale, setScrollScale] = useState(startScale);

  useEffect(() => {
    if (!enableAnimations || shouldReduceMotion) return;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = containerHeight - windowHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollScale(startScale + progress * (1 - startScale));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableAnimations, shouldReduceMotion, startScale]);

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  return (
    <div className={`relative ${className}`}>
      {/* Hero Section with Video */}
      <div
        ref={containerRef}
        className="relative h-[200vh] bg-background"
      >
        {/* Fixed Video Container */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center z-10">
          <div
            className="relative flex items-center justify-center will-change-transform"
            style={{ transform: shouldAnimate ? `scale(${scrollScale})` : 'scale(1)', transformOrigin: 'center center' }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-[95vw] max-w-7xl h-[70vh] object-cover shadow-2xl rounded-2xl"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Overlay Content */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="text-center text-white pointer-events-auto">
                <motion.h1
                  className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  Join our Sustainable Sundays event and make a difference.
                </motion.h1>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
