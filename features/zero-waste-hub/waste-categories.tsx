"use client";

import React, { useRef } from "react";
import { SectionContainer } from "@/components/layout/section-container";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Compost",
    description: "Turn organic waste into nutrient-rich soil. Learn the art of bokashi, vermicomposting, and backyard bins.",
    color: "bg-[#e2f4d3]",
    textColor: "text-[#2d4a1e]",
  },
  {
    title: "Recycle",
    description: "Beyond the bin. Master the nuances of local recycling streams and close the loop on materials.",
    color: "bg-[#d3e8f4]",
    textColor: "text-[#1e3a4a]",
  },
  {
    title: "Upcycle",
    description: "Give new life to old objects. Explore creative ways to repurpose textiles, furniture, and glass.",
    color: "bg-[#f4e2d3]",
    textColor: "text-[#4a2d1e]",
  },
  {
    title: "Reduce",
    description: "The ultimate goal. Strategies for mindful consumption and avoiding waste before it starts.",
    color: "bg-[#f4d3e2]",
    textColor: "text-[#4a1e35]",
  }
];

export function WasteCategories() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
    });

    tl.from(cardsRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <SectionContainer ref={container} className="py-24 bg-white">
      <div className="space-y-16">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-neutral-900 mb-6">
            Master the <br /> <span className="text-neutral-400">Streams</span>
          </h2>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Understanding where your waste goes is the first step towards a sustainable lifestyle. Explore our guides for each major stream.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className={`p-10 rounded-[2.5rem] ${cat.color} ${cat.textColor} flex flex-col justify-between min-h-[350px] transition-transform duration-500 hover:-translate-y-2 cursor-pointer group`}
            >
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{cat.title}</h3>
                <p className="text-lg opacity-80 font-medium leading-snug">
                  {cat.description}
                </p>
              </div>
              <div className="flex justify-end">
                <span className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-current group-hover:text-white transition-colors duration-300">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
