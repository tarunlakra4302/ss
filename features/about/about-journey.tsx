"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import InfiniteGallery from "@/components/ui/gallery-photography";

interface Image {
  src: string;
  alt: string;
}

interface AboutJourneyProps {
  images: Image[];
}

export const AboutJourney = ({ images }: AboutJourneyProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={sectionRef} className="relative h-[100vh] w-full bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Cinematic Text Overlay - Pinned center */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center p-6 select-none">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black uppercase leading-none">
            Our <br className="md:hidden" /> Journey
          </h2>
          <p className="mt-4 text-base md:text-lg text-neutral-700 font-medium tracking-[0.15em] uppercase max-w-xl px-4">
            A visual retrospective of our initiatives
          </p>
        </div>

        {/* 3D Infinite Gallery Background */}
        <InfiniteGallery 
          images={images} 
          visibleCount={16}
          scrollProgress={scrollYProgress}
          scrollSpeed={0.6}
          className="w-full h-full" 
        />
      </div>
    </section>
  );
};

