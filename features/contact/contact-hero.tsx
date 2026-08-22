"use client";

import React from "react";
import { motion } from "framer-motion";

export const ContactHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeOut",
      }}
      className="w-full md:flex-1 text-left"
    >
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight ml-0 md:-ml-8 lg:-ml-12">
        Contact Us
      </h2>
    </motion.div>
  );
};
