"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";
import { Component as AnimatedCharactersLoginPage } from "@/components/login-section";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Navbar } from "@/components/navigation/navbar";

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
            src="/images/volunteer/volunteer main.png"
            alt="Volunteers working"
            className="w-full h-full object-cover scale-125 group-hover:scale-120 transition-transform duration-1000"
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-black/70 leading-relaxed">
            At Sustainable Sundays, we believe in the strength of community. Our volunteers are the change-makers who help rebuild our urban ecosystem and guide neighbors toward sustainable, conscious living.
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
            title: "Local Impact",
            desc: "Deepen your relationship with local communities and initiatives that touch lives in sensitive regions of Bangalore"
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

const GeneralVolunteers = () => (
  <section className="bg-white">
    <div className="max-w-7xl mx-auto py-16 px-6 md:px-12 lg:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
      {/* Left Column: Image */}
      <div className="w-full md:col-span-7 aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-none">
        <img
          src="/images/volunteer/General volunteer.jpeg"
          alt="Diverse group of outdoor volunteers"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Column: Content */}
      <div className="flex flex-col max-w-lg md:col-span-5">
        <h2 className="text-[#000000] text-5xl md:text-6xl lg:text-[72px] font-semibold tracking-tight leading-[1.1] mb-12">
          General<br />Volunteers
        </h2>
        
        <div className="flex flex-col gap-10">
          <div>
            <h3 className="text-[#000000] text-xl md:text-2xl font-medium mb-3">
              Event Support
            </h3>
            <p className="text-gray-600 text-lg font-normal leading-relaxed">
              Assist in organizing and running events, from local fundraisers to international symposiums.
            </p>
          </div>
          
          <div>
            <h3 className="text-[#000000] text-xl md:text-2xl font-medium mb-3">
              Administrative Help
            </h3>
            <p className="text-gray-600 text-lg font-normal leading-relaxed">
              Provide essential back-office support to keep our operations running smoothly.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function BecomeAVolunteerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Purpose />
        
        <GeneralVolunteers />
        
        {/* Preserved Section */}
        <section className="mt-20 pt-20">
          <div className="max-w-7xl mx-auto overflow-hidden">
            <AnimatedCharactersLoginPage formType="volunteering" />
          </div>
        </section>
      </main>
    </div>
  );
}
