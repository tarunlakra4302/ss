"use client";

import { useRef } from "react";
import Link from "next/link";
import { FlowHoverButton } from "@/components/ui/flow-hover-button";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

interface ZeroWasteCTAProps {
  /**
   * Initial clip path percentage
   * @default 25
   */
  initialClipPercentage?: number;
  /**
   * Final clip path percentage
   * @default 75
   */
  finalClipPercentage?: number;
  /**
   * Background image URL
   * @default "/images/zero-waste-cta-bg.png"
   */
  image?: string;
}

export const ZeroWasteCTA = ({
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  image = "/images/zero-waste-cta-bg.png",
}: ZeroWasteCTAProps) => {
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "center center"],
  });

  const clipStart = useTransform(
    scrollYProgress,
    [0, 1],
    [initialClipPercentage, 0]
  );
  const clipEnd = useTransform(
    scrollYProgress,
    [0, 1],
    [finalClipPercentage, 100]
  );

  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1.0]);

  return (
    <section className="relative px-6 pb-32" ref={container}>
      <motion.div
        className="relative h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex items-center justify-center text-center"
        style={{
          clipPath,
          willChange: "clip-path",
        }}
      >
        {/* Parallax Scaling Image */}
        <motion.img
          src={image}
          alt="Zero Waste Hub"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          style={{
            scale,
            willChange: "transform",
          }}
        />

        {/* Foreground Content */}
        <div className="relative z-10 px-6 max-w-4xl">
          <h2 className="text-white text-4xl md:text-7xl font-bold mb-8 md:mb-12 tracking-tight leading-tight">
            Building a sustainable <br className="hidden md:block" /> future, together.
          </h2>
          <FlowHoverButton asChild className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm h-auto border-none hover:bg-neutral-100 transition-colors">
            <Link href="/zero-waste-archive" className="flex items-center gap-2">
              Explore Zero Waste Hub
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </FlowHoverButton>
        </div>
      </motion.div>
    </section>
  );
};
