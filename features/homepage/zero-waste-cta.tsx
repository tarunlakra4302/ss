"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { FlowHoverButton } from "@/components/ui/flow-hover-button";
import { ArrowRight } from "lucide-react";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const ZeroWasteCTA = () => {
  const container = useRef<HTMLDivElement>(null);
  const bgImage = useRef<HTMLImageElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useGSAP(() => {
    if (!container.current || !bgImage.current) return;

    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5, // Smooth parallax feel
      },
    });

    tl.current.fromTo(
      bgImage.current,
      { yPercent: -15 },
      { yPercent: 15, ease: "none" }
    );
  }, { scope: container });

  return (
    <section className="relative px-6 pb-32" ref={container}>
      <div className="relative h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex items-center justify-center text-center">
        <img
          ref={bgImage}
          src="/images/zero-waste-cta-bg.png"
          alt="Zero Waste Hub"
          className="absolute inset-0 w-full h-[130%] object-cover brightness-[0.4] will-change-transform"
          style={{ top: "-15%" }}
        />
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
      </div>
    </section>
  );
};
