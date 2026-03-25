"use client";

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AnimatedScanLoader from '@/components/animated-scan-loader';

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setIsLoading(false);
    }
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >
          <AnimatedScanLoader onComplete={() => setIsLoading(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen bg-white"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
