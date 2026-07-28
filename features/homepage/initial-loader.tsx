"use client";
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import AnimatedScanLoader from '@/components/animated-scan-loader';
import { useLoading } from './loading-context';


const LOADER_FADEOUT_DURATION = 300; // ms — loader fade after expansion
const TEXT_REVEAL_DELAY = 400;       // ms — when hero text + navbar appear

function removeLoaderShield() {
  const shield = document.getElementById('__loader-shield');
  if (shield) shield.remove();
  document.body.classList.remove('is-loading');
  document.documentElement.classList.remove('is-loading');
}

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const { setIsLoading, setIsComplete, setHeroImage } = useLoading();
  const shouldReduceMotion = useReducedMotion();

  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderOpacity, setLoaderOpacity] = useState(1);
  const [childrenReady, setChildrenReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (shouldReduceMotion) {
      setIsLoading(false);
      setIsComplete(true);
      setLoaderVisible(false);
      setChildrenReady(true);
      removeLoaderShield();
    } else {
      // Reset state on mount for non-reduce-motion users to ensure animations sync on every visit
      setIsLoading(true);
      setIsComplete(false);
      removeLoaderShield();
    }
  }, [shouldReduceMotion, setIsLoading, setIsComplete]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleScanComplete = (finalImage: string) => {
    setTimeout(() => {
      setHeroImage(finalImage);
      setIsLoading(false);
    }, 0);
  };

  const handleExpansionStart = () => {
    setChildrenReady(true);
  };

  const handleExpansionComplete = () => {
    setLoaderOpacity(0);
    setIsComplete(true);

    setTimeout(() => {
      setLoaderVisible(false);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, LOADER_FADEOUT_DURATION);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-clip flex flex-col flex-1">
      <div
        className={`relative flex flex-col flex-1 transition-opacity duration-300 ${
          childrenReady ? 'pointer-events-auto opacity-100 visible' : 'pointer-events-none opacity-0 invisible'
        }`}
      >
        {children}
      </div>

      {loaderVisible && (
        <motion.div
          className="fixed inset-0 z-[40]"
          style={{ opacity: loaderOpacity }}
          animate={{ opacity: loaderOpacity }}
          transition={{
            opacity: {
              duration: LOADER_FADEOUT_DURATION / 1000,
              ease: 'easeInOut',
            },
          }}
        >
          <AnimatedScanLoader
            onComplete={handleScanComplete}
            onExpansionStart={handleExpansionStart}
            onExpansionComplete={handleExpansionComplete}
          />
        </motion.div>
      )}
    </div>
  );
}
