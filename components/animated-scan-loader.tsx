"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const MotionImage = motion.img;

const images = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
];

interface LoaderProps {
  onComplete?: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const [index, setIndex] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  // Pre-load images to prevent glitches/white flashes
  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve) => {
	  const img = new window.Image();
	  img.src = src;
	  img.onload = resolve;
	  img.onerror = resolve; // Continue even if one fails
	});
      });
      await Promise.all(promises);
      setIsImagesLoaded(true);
    };
    preloadImages();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (isExpanding || !isImagesLoaded) return;

    const currentDelay = index < 2 ? 800 : 400;

    const timer = setTimeout(() => {
      setIndex((prev) => {
        if (prev === images.length - 1) {
          setTimeout(() => setIsExpanding(true), 600);
          return prev;
        }
        return prev + 1;
      });
    }, currentDelay);

    return () => clearTimeout(timer);
  }, [index, isExpanding, isImagesLoaded]);

  useEffect(() => {
    if (isExpanding) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isExpanding, onComplete]);

  return (
    <div className="flex items-center justify-center w-full h-full bg-white overflow-hidden">
      {/* 
	Aggressive pre-rendering: 
	Render all images in the background so they stay decoded in the browser's memory.
      */}
      <div className="fixed opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
        {images.map((src) => (
	  <img key={src} src={src} alt="" aria-hidden="true" width={1} height={1} />
	))}
      </div>

      <motion.div
        layout
        initial={false}
        animate={isExpanding ? {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
        } : {
          width: isMobile ? '80vw' : '25vw',
          height: 'auto',
          aspectRatio: '1.3/1',
          borderRadius: '4px',
        }}
        transition={{
          duration: 0.7,
          ease: [0.76, 0, 0.24, 1]
        }}
        className="relative overflow-hidden bg-white flex items-center justify-center"
      >
        <AnimatePresence mode="sync" initial={false}>
          {isImagesLoaded && (
            <MotionImage
              key={images[index]}
              src={images[index]}
              alt="" // Empty alt to prevent flickering text
              aria-hidden="true"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                duration: 0.6,
                ease: [0.76, 0, 0.24, 1]
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};




export default Loader;
