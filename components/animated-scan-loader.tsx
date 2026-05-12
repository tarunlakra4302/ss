"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
const MotionImage = motion.img;

const images = [
  '/ss%20preloader%20images/1.jpeg',
  '/ss%20preloader%20images/2.jpeg',
  '/ss%20preloader%20images/3.jpeg',
  '/ss%20preloader%20images/4.jpeg',
  '/ss%20preloader%20images/5.jpeg',
];

interface LoaderProps {
  onComplete?: (finalImage: string, rect?: DOMRect) => void;
  onExpansionComplete?: () => void;
  onExpansionStart?: () => void;
}

const Loader = ({ onComplete, onExpansionComplete, onExpansionStart }: LoaderProps) => {
  const [index, setIndex] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [showHeroBg, setShowHeroBg] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (isExpanding) return;

    // Start cycling immediately. We use a near-zero delay for the first image
    // so the animation starts as soon as the component mounts.
    const currentDelay = index === 0 ? 50 : (index < 2 ? 800 : 550);

    const timer = setTimeout(() => {
      setIndex((prev) => {
        if (prev === images.length - 1) {
          // The last image (index 4) has just been shown for currentDelay.
          // We wait an additional buffer (e.g. 200ms) before showing the hero background
          // to ensure it dwells long enough and feels solid before the scan ends.
          setTimeout(() => {
            setShowHeroBg(true);
            
            // After showing background, wait for it to land before starting the expansion.
            // hero-bg takes 600ms to slide in. 
            // wait 200ms after it lands before expanding.
            setTimeout(() => {
              const rect = windowRef.current?.getBoundingClientRect();
              
              // Use deferred notification pattern
              setTimeout(() => {
                if (onComplete) onComplete(images[prev], rect);
              }, 0);
              
              if (onExpansionStart) onExpansionStart();
              setIsExpanding(true);
            }, 800); // 600ms animation + 200ms dwell
          }, 200);
          
          return prev;
        }
        return prev + 1;
      });
    }, currentDelay);

    return () => clearTimeout(timer);
  }, [index, isExpanding, onComplete, onExpansionStart]);

  return (
    <div 
      ref={containerRef}
      className={isExpanding
        ? "fixed inset-0 flex items-center justify-center bg-white overflow-hidden" 
        : "flex items-center justify-center w-full h-full bg-white overflow-hidden" 
      }
    >
      <div className="fixed opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
        {images.map((src) => (
          <img key={src} src={src} alt="" aria-hidden="true" width={1} height={1} />
        ))}
      </div>

      <motion.div
        ref={windowRef}
        layout
        initial={false}
        animate={isExpanding ? { 
          width: '100vw', 
          height: '100vh',
          borderRadius: '0px',
        } : { 
          borderRadius: '4px',
        }}
        transition={{
          duration: 0.9,
          ease: [0.76, 0, 0.24, 1]
        }}
        onAnimationComplete={() => { 
          if (isExpanding && onExpansionComplete) onExpansionComplete(); 
        }} 
        className="relative overflow-hidden flex items-center justify-center will-change-transform w-[80vw] h-[calc(80vw/1.3)] md:w-[25vw] md:h-[calc(25vw/1.3)]" 
      >
        <AnimatePresence mode="sync" initial={false}>
          {!showHeroBg && !isExpanding && ( 
            <MotionImage
              key={images[index]}
              src={images[index]}
              alt=""
              aria-hidden="true"
              initial={{ y: '-100%' }}
              animate={{ 
                y: 0,
              }}
              exit={{ y: '100%' }}
              transition={{
                y: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {showHeroBg && (
            <motion.div
              key="hero-bg"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 w-full h-full bg-[#a6ff00]"
              style={{ zIndex: 10 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Loader;
