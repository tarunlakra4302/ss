"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  data: TimelineItem[];
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const items = gsap.utils.toArray(".timeline-item");
    
    items.forEach((item: any, index: number) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
          delay: 0.1,
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section id="timeframe" className="w-full bg-[#F5F5F5] py-[100px] px-6 md:px-20 relative overflow-hidden">
      <div 
        ref={containerRef} 
        className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-32 relative"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="timeline-item grid grid-cols-1 md:grid-cols-[40%_60%] gap-4 md:gap-16 items-start will-change-transform relative"
          >
            {/* Left Column / Top Section - Year */}
            <div className="flex flex-col">
              <h2 className={`font-black text-[#0B1B34] tracking-tighter antialiased whitespace-nowrap ${
                isNaN(Number(item.year))
                  ? "text-[32px] md:text-[60px] lg:text-[80px] leading-none"
                  : "text-[56px] md:text-[120px] lg:text-[180px] leading-[1] md:leading-[0.8]"
              }`}>
                {item.year}
              </h2>
              {/* Mobile Only Location/Title */}
              <div className="md:hidden mt-2">
                <h3 className="text-[18px] font-semibold text-[#0B1B34] tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Right Column / Bottom Section - Content */}
            <div className={`flex flex-col pt-0 ${
              isNaN(Number(item.year)) ? "md:pt-1 lg:pt-[6px]" : "md:pt-6"
            }`}>
              {/* Desktop Only Title */}
              <h3 className="hidden md:block text-[24px] font-bold text-[#0B1B34] mb-8 tracking-tight max-w-[500px]">
                {item.title}
              </h3>
              <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#0B1B34]/80 font-medium leading-[1.6] max-w-[500px] md:max-w-full antialiased">
                {item.description}
              </p>
              
              {/* Mobile Divider */}
              <div className="block md:hidden mt-8 md:mt-0 w-full h-[1px] bg-[#E5E5E5]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
