"use client";

import React, { useRef } from "react";
import { SectionContainer } from "@/components/layout/section-container";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Landfill Diverted", value: 12500, suffix: "kg", description: "Waste kept out of landfills this year." },
  { label: "Community Members", value: 2400, suffix: "+", description: "Active participants in our local hubs." },
  { label: "Workshops Held", value: 48, suffix: "", description: "Hands-on sessions on composting and upcycling." },
  { label: "Carbon Offset", value: 320, suffix: "tons", description: "Estimated CO2 emissions avoided." },
];

export function ImpactStats() {
  const container = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    stats.forEach((stat, i) => {
      const target = { val: 0 };
      const element = statsRefs.current[i]?.querySelector(".stat-value");
      
      if (element) {
        gsap.to(target, {
          val: stat.value,
          duration: 2,
          scrollTrigger: {
            trigger: statsRefs.current[i],
            start: "top 85%",
          },
          onUpdate: () => {
            element.textContent = Math.floor(target.val).toLocaleString() + stat.suffix;
          },
          ease: "power2.out",
        });
      }
    });

    gsap.from(statsRefs.current, {
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <SectionContainer ref={container} className="py-32 bg-neutral-900 text-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#a6ff00_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Our Collective <br /> <span className="text-primary">Impact</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
            Every small action adds up. Here is what we have achieved together so far.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <div 
              key={stat.label} 
              ref={(el) => { if (el) statsRefs.current[i] = el; }}
              className="space-y-4"
            >
              <div className="stat-value text-5xl md:text-6xl font-black text-primary tracking-tighter">
                0{stat.suffix}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-widest text-white">{stat.label}</h3>
                <p className="text-sm text-neutral-500 max-w-[200px] mx-auto leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
