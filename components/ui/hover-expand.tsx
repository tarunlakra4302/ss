"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface HoverExpandProps {
  images: { src: string; alt: string; code?: string }[];
  className?: string;
}

export const HoverExpand_001 = ({ images, className }: HoverExpandProps) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
      }}
      className={cn("relative w-full max-w-6xl px-2 sm:px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1 sm:gap-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl"
              initial={{ width: "2rem", height: "16rem" }}
              animate={{
                width: activeImage === index ? "clamp(12rem, 50vw, 24rem)" : "clamp(2rem, 11vw, 5rem)",
                height: "clamp(16rem, 55vw, 24rem)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && image.code && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute flex h-full w-full flex-col items-start justify-end p-3 sm:p-5 md:p-6 z-20 pointer-events-none"
                  >
                    <p className="text-left text-sm sm:text-base md:text-xl text-white font-bold tracking-tight drop-shadow-md">
                      {image.code}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={image.src}
                className="size-full object-cover"
                alt={image.alt}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
