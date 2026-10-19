"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import ReactLenis from "lenis/react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/section-container";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Project 1",
    src: "/images/lummi/img8.png",
  },
  {
    title: "Project 2",
    src: "/images/lummi/img14.png",
  },
  {
    title: "Project 3",
    src: "/images/lummi/img10.png",
  },
  {
    title: "Project 4",
    src: "/images/lummi/img15.png",
  },
  {
    title: "Project 5",
    src: "/images/lummi/img12.png",
  },
];

const StickyCard_001 = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  src: string;
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20 + 250}px)`,
        }}
        className="rounded-4xl relative -top-1/4 flex h-[300px] w-[500px] max-w-[calc(100vw-32px)] origin-top flex-col overflow-hidden shadow-2xl"
      >
        <img src={src} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
};

const Skiper16 = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <main
        ref={container}
        style={{ paddingBottom: "calc(-5vh + 360px)" }}
        className="relative flex w-full flex-col items-center justify-center pt-1"
      >
        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.5,
            1 - (projects.length - i - 1) * 0.1,
          );
          return (
            <StickyCard_001
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
};

export { Skiper16, StickyCard_001 };

const desktopImages = [
  "/images/events/Agara Lake walk_24 May 2026.jpg",
  "/images/events/Edible Gardening workshop by Muthukaran_10 May.jpg",
  "/images/events/Edible Gardening workshop by Muthukaran_10 May2.jpg",
  "/images/events/Impact Analytics team at Rewilding Project at Kasturinagar Lake_6 June 2026.jpg",
  "/images/events/Kitchen Secrets_26 July 2026.jpg",
  "/images/events/Kitchen Secrets_26 July 2026 (B).jpg",
  "/images/events/Odette Katrak at the Kitchen Secrets event_26 July 2026.jpg",
  "/images/events/Sapling Care at Ambalipura Lake_9 August 2026.jpg",
  "/images/events/Soil preparation activity at Kasturinagar Lake_31 May 2026.jpeg",
  "/images/events/Swap Gala event with music performance_22 March 2026.JPG",
  "/images/events/Zero Waste Meet up at Swacha Graha Kalika Kendra.jpg",
  "/images/events/1.jpeg",
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
          <p className="max-w-xl md:max-w-none whitespace-normal md:whitespace-nowrap text-lg sm:text-xl md:text-2xl text-black font-bold leading-relaxed tracking-tight text-center px-4">
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
    <section className="w-full relative pt-10 sm:pt-12 pb-0">
      <div className="flex items-center justify-center bg-transparent pt-2 pb-0 text-center px-4">
        <p className="max-w-sm text-base sm:text-lg font-bold text-gray-900 leading-snug text-center px-4">
          Here is a sneak peak into our communities redefining conscious living.
        </p>
      </div>
      <Skiper16 />
    </section>
  );
}

export default function HeroSection() {
  const isMobile = useIsMobile();

  // Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    if (isMobile) return;

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
  }, [isMobile]);

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
