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
            className="timeline-item flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 items-start will-change-transform relative w-full"
          >
            {/* Left Column / Top Section - Year & Month */}
            <div className="w-full md:w-[35%] lg:w-[30%] flex flex-col items-end text-right self-start shrink-0">
              <h2 className={`font-black text-[#0B1B34] tracking-tighter antialiased break-words leading-none w-full text-right ${
                isNaN(Number(item.year))
                  ? "text-[28px] md:text-[40px] lg:text-[48px]"
                  : "text-[40px] md:text-[56px] lg:text-[72px]"
              }`}>
                {item.year}
              </h2>
              {/* Mobile Only Location/Title */}
              <div className="md:hidden mt-2 text-right w-full">
                <h3 className="text-[18px] font-semibold text-[#0B1B34] tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Right Column / Bottom Section - Content */}
            <div className="flex-1 flex flex-col items-start self-start pt-0">
              {/* Desktop Only Title */}
              <h3 className="hidden md:block text-[22px] md:text-[26px] lg:text-[28px] font-bold text-[#0B1B34] mb-4 tracking-tight leading-none max-w-[550px]">
                {item.title}
              </h3>
              <p className="text-[16px] md:text-[18px] lg:text-[19px] text-[#0B1B34]/80 font-medium leading-[1.6] max-w-[550px] md:max-w-full antialiased">
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
