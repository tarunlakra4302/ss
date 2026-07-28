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
    <section id="team" className="w-full bg-[#F5F5F5] py-[100px] px-6 md:px-20 relative overflow-hidden">
      <div 
        ref={containerRef} 
        className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-32 relative"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="timeline-item flex flex-col md:flex-row gap-8 items-start will-change-transform relative w-full"
          >
            {/* Left Column / Top Section - Year */}
            <div className="w-full md:w-[40%] flex flex-col items-center justify-center text-center self-center shrink-0">
              <h2 className={`font-black text-[#0B1B34] tracking-tighter antialiased break-words w-full ${
                isNaN(Number(item.year))
                  ? "text-[32px] md:text-[48px] lg:text-[60px] leading-tight"
                  : "text-[40px] md:text-[64px] lg:text-[84px] leading-none"
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
            <div className={`flex-1 flex flex-col pt-0 ${
              isNaN(Number(item.year)) ? "md:pt-[8px] lg:pt-[12px]" : "md:pt-[16px] lg:pt-[24px]"
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
