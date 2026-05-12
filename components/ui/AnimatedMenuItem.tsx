"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMenuItemProps {
  text: string;
  isOpen: boolean;
  delay?: number;
  className?: string;
}

const variants = {
  container: {
    open: (delay: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    }),
    closed: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 1, 1] as any,
      },
    },
  },
  revealer: {
    open: (delay: number) => ({
      scaleX: [0, 1, 0],
      originX: [0, 0, 1],
      transition: {
        times: [0, 0.5, 1],
        duration: 0.6,
        delay: delay,
        ease: [0.65, 0.01, 0.05, 0.99] as any,
      },
    }),
    closed: {
      scaleX: 0,
      transition: {
        duration: 0.2,
      },
    },
  },
  text: {
    open: (delay: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        delay: delay + 0.2,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    }),
    closed: {
      y: "110%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1] as any,
      },
    },
  },
};

export function AnimatedMenuItem({
  text,
  isOpen,
  delay = 0,
  className,
}: AnimatedMenuItemProps) {
  return (
    <motion.div
      className={cn("relative inline-block overflow-hidden", className)}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      custom={delay}
      variants={variants.container}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {/* The "Revealer Block" overlay */}
      <motion.div
        variants={variants.revealer}
        custom={delay}
        className="absolute inset-x-0 h-full bg-primary z-20"
        style={{ willChange: "transform" }}
      />

      {/* The actual text container for vertical block-reveal effect */}
      <motion.div className="relative overflow-hidden">
        <motion.span
          variants={variants.text}
          custom={delay}
          className="block"
          style={{ willChange: "transform, opacity" }}
        >
          {text}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
