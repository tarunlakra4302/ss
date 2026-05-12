"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Menu, Check, ArrowRight } from "lucide-react";
import { Component as AnimatedCharactersLoginPage } from "@/components/login-section";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SterlingGateKineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const container = useRef(null);
  const image = useRef(null);

  useGSAP(() => {
    gsap.to(image.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <section className="relative pt-28 md:pt-40 pb-20 md:pb-24 px-6 max-w-5xl mx-auto text-center" ref={container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-label text-black/50 mb-6">Join the <span className="text-black/40">Movement</span></p>
        <h1 className="text-display text-5xl md:text-9xl mb-12 md:mb-16">Volunteering</h1>
        
        <div className="relative aspect-[16/9] mb-16 overflow-hidden rounded-2xl transition-all duration-1000 group">
          <img
            ref={image}
            src="https://picsum.photos/seed/volunteers/1600/900"
            alt="Volunteers working"
            className="w-full h-full object-cover scale-125 group-hover:scale-120 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-black/70 leading-relaxed">
            At Sustainable Sundays, we believe in the strength of community. Our volunteers are the climbers who help others reach their personal summits of health and recovery.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

const Purpose = () => (
  <section className="bg-surface py-20 md:py-32 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20">
        <p className="text-label text-black/50 mb-4">The Purpose</p>
        <h2 className="text-display text-4xl md:text-6xl max-w-2xl">Why volunteer with Sustainable Sundays?</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 md:gap-x-24 gap-y-12 md:gap-y-16">
        {[
          {
            num: "01",
            title: "Global Impact",
            desc: "Extend your reach beyond borders, supporting sustainability initiatives that touch lives in underserved regions worldwide."
          },
          {
            num: "02",
            title: "Collaborate with Experts",
            desc: "Work alongside leading environmentalists, community leaders, and change-makers in a high-stakes, rewarding environment."
          },
          {
            num: "03",
            title: "Unique Experiences",
            desc: "From community clean-ups to urban benefit galas, our volunteer roles offer perspectives you won't find in a standard corporate setting."
          },
          {
            num: "04",
            title: "Support and Training",
            desc: "We invest in our people. Receive specialized training in advocacy, event logistics, and international non-profit operations."
          }
        ].map((item) => (
          <div key={item.num} className="flex gap-8 border-t border-ink/10 pt-10">
            <span className="text-display text-4xl md:text-5xl text-ink/10">{item.num}</span>
            <div>
              <h3 className="font-bold text-2xl mb-4 uppercase tracking-tighter">{item.title}</h3>
              <p className="text-black/60 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Opportunities = () => (
  <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-paper p-8 md:p-12 border border-ink/5 rounded-3xl flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-8">
            <Menu className="w-6 h-6" />
          </div>
          <h2 className="text-display text-4xl mb-6">General Volunteers</h2>
          <p className="text-black/60">Essential roles that keep our base camp running smoothly day-to-day.</p>
        </div>
      </div>

      <div className="bg-surface p-8 md:p-12 rounded-3xl">
        <p className="text-label text-black/40 mb-8">Opportunity 01</p>
        <h3 className="font-bold text-2xl mb-8 uppercase tracking-tighter">Event Support</h3>
        <ul className="space-y-4">
          {["Gala Registration & Logistics", "Community Coordination", "On-site Relations"].map((item) => (
            <li key={item} className="flex items-center gap-3 text-black/60">
              <Check className="w-4 h-4 text-ink" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-ink text-paper p-8 md:p-12 rounded-3xl">
        <p className="text-label text-paper/40 mb-8">Opportunity 02</p>
        <h3 className="font-bold text-2xl mb-8 uppercase tracking-tighter">Administrative Help</h3>
        <ul className="space-y-4">
          {["Database Management", "Donor Communications", "Office Operations Support"].map((item) => (
            <li key={item} className="flex items-center gap-3 text-paper/70">
              <Check className="w-4 h-4 text-paper" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const FinalCTA = () => {
  const container = useRef(null);
  const bgImage = useRef(null);

  useGSAP(() => {
    gsap.to(bgImage.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <section className="relative px-6 pb-32" ref={container}>
      <div className="relative h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex items-center justify-center text-center">
        <img
          ref={bgImage}
          src="https://picsum.photos/seed/summit/1920/1080"
          alt="Landscape silhouette"
          className="absolute inset-0 w-full h-[140%] object-cover brightness-50"
          referrerPolicy="no-referrer"
          style={{ top: "-20%" }}
        />
        <div className="relative z-10 px-6">
          <h2 className="text-display text-white text-4xl md:text-7xl mb-8 md:mb-12">Ready to make a difference?</h2>
          <button className="bg-white text-ink px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-surface transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default function BecomeAVolunteerPage() {
  const midContainer = useRef(null);
  const midImage = useRef(null);

  useGSAP(() => {
    gsap.to(midImage.current, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: midContainer.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: midContainer });

  return (
    <div className="min-h-screen">
      <SterlingGateKineticNavigation />
      <main>
        <Hero />
        <Purpose />
        <div className="w-full h-[300px] md:h-[600px] overflow-hidden relative" ref={midContainer}>
          <img
            ref={midImage}
            src="https://picsum.photos/seed/landscape/1920/1080"
            alt="Landscape"
            className="w-full h-[150%] object-cover absolute top-[-25%]"
            referrerPolicy="no-referrer"
          />
        </div>
        <Opportunities />
        <FinalCTA />
        
        {/* Preserved Section */}
        <section className="mt-20 pt-20">
          <div className="max-w-7xl mx-auto overflow-hidden">
            <AnimatedCharactersLoginPage />
          </div>
        </section>
      </main>
    </div>
  );
}
