"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/section-container";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_CARDS: iCardItem[] = [
  {
    title: "Lalbagh Greenery",
    description: "Discover the historic botanical gardens and centuries-old trees at the heart of Bangalore",
    tag: "botanical",
    src: "/ss%20preloader%20images/1.jpeg",
    link: "#",
    color: "white",
    textColor: "white",
  },
  {
    title: "Cubbon Park Cleanups",
    description: "Join our weekly community runs and zero-waste cleanup drives in Bangalore's lungs",
    src: "/ss%20preloader%20images/2.jpeg",
    tag: "cleanups",
    link: "#",
    color: "green",
    textColor: "white",
  },
  {
    title: "Ulsoor Lake Composting",
    description: "Participate in lake rejuvenation projects and organic waste management workshops",
    src: "/ss%20preloader%20images/3.jpeg",
    tag: "ecology",
    link: "#",
    color: "white",
    textColor: "white",
  },
  {
    title: "Hesaraghatta Eco",
    description: "Raise awareness for protecting Bangalore's last remaining grassland ecosystems",
    src: "/ss%20preloader%20images/4.jpeg",
    tag: "conservation",
    link: "#",
    color: "white",
    textColor: "white",
  },
];

const desktopImages = [
  "/gallery/1.jpeg",
  "/gallery/2.jpeg",
  "/gallery/3.jpeg",
  "/gallery/4.jpeg",
  "/gallery/5.jpeg",
  "/gallery/6.jpeg",
  "/gallery/7.jpeg",
  "/gallery/8.jpeg",
  "/gallery/9.jpeg",
  "/gallery/1.jpeg",
  "/gallery/2.jpeg",
  "/gallery/3.jpeg",
];

function DesktopHero() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, (v) => v * (height || 800) * 2);
  const y2 = useTransform(scrollYProgress, (v) => v * (height || 800) * 3.3);
  const y3 = useTransform(scrollYProgress, (v) => v * (height || 800) * 1.25);
  const y4 = useTransform(scrollYProgress, (v) => v * (height || 800) * 3);

  return (
    <main className="w-full text-black">
      <SectionContainer className="flex items-center justify-center bg-transparent py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center space-y-8 relative z-20"
        >
          <p className="max-w-none text-xl md:text-2xl text-black font-bold leading-relaxed tracking-tight whitespace-nowrap">
            Here is a sneak peak into our communities redefining conscious living.
          </p>
        </motion.div>
      </SectionContainer>

      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-white p-[2vw]"
      >
        <Column images={[desktopImages[0], desktopImages[1], desktopImages[2]]} y={y} />
        <Column images={[desktopImages[3], desktopImages[4], desktopImages[5]]} y={y2} />
        <Column images={[desktopImages[6], desktopImages[7], desktopImages[8]]} y={y3} />
        <Column images={[desktopImages[9], desktopImages[10], desktopImages[11]]} y={y4} />
      </div>
    </main>
  );
}

function MobileHero() {
  return (
    <section className="w-full relative pt-8 pb-16">
      <div className="relative">
        {/* Sticky Hero title - stays visible just below navbar on scroll */}
        <div className="sticky top-[80px] z-[30] w-full flex flex-col items-center justify-center px-6 py-8 text-center gap-2 pointer-events-none">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 leading-relaxed whitespace-nowrap">
            Here is a sneak peak into our communities redefining conscious living.
          </h1>
        </div>
        
        <div className="relative z-10">
          <CardsParallax items={MOBILE_CARDS} stickyOffset="320px" />
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  const isMobile = useIsMobile();

  // Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis();
    
    lenis.on('scroll', ScrollTrigger.update);

    const updateGsap = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGsap);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateGsap);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full">
      {isMobile === null ? null : isMobile ? <MobileHero /> : <DesktopHero />}
    </div>
  );
}

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden">
          <Image
            src={src}
            alt="gallery image"
            fill
            className="pointer-events-none object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      ))}
    </motion.div>
  );
}
