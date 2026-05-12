"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";
import { ScrollAnimationDemo } from "@/features/homepage/scroll-animation-demo";

const MOBILE_CARDS: iCardItem[] = [
  {
    title: "Everest Camp",
    description: "Experience the ultimate trek to the world's highest mountain",
    tag: "trekking",
    src: "/ss%20preloader%20images/1.jpeg",
    link: "#",
    color: "white",
    textColor: "white",
  },
  {
    title: "Annapurna",
    description: "Journey through the stunning landscapes of Nepal",
    src: "/ss%20preloader%20images/2.jpeg",
    tag: "hiking",
    link: "#",
    color: "green",
    textColor: "white",
  },
  {
    title: "Inca Trail",
    description: "Ancient paths leading to Machu Picchu",
    src: "/ss%20preloader%20images/3.jpeg",
    tag: "adventure",
    link: "#",
    color: "white",
    textColor: "white",
  },
  {
    title: "Swiss Alps",
    description: "Discover the breathtaking beauty of European mountains",
    src: "/ss%20preloader%20images/4.jpeg",
    tag: "mountains",
    link: "#",
    color: "white",
    textColor: "white",
  },
];

export default function HeroSection() {
  const isMobile = useIsMobile();

  // Lenis smooth scroll — only on mobile where CardsParallax is mounted
  useEffect(() => {
    if (!isMobile) return;
    const lenis = new Lenis();
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [isMobile]);

  // Null guard — render nothing until breakpoint is measured (prevents SSR mismatch)
  if (isMobile === null) return null;

  return isMobile ? (
    // ── MOBILE: CardsParallax ─────────────────────────────────────
    <section className="w-full relative pt-32 pb-20">
      <div className="relative">
        {/* Sticky Hero title - stays visible just below navbar on scroll */}
        <div className="sticky top-[80px] z-[30] w-full flex flex-col items-center justify-center px-6 py-8 text-center gap-2 pointer-events-none">
          <h1 className="text-lg md:text-xl font-medium tracking-tight text-gray-900 leading-relaxed max-w-[320px]">
            A look inside the community redefining conscious living in our own backyards.
          </h1>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              (Scroll Down)
            </p>
          </div>
        </div>
        
        <div className="relative z-10">
          <CardsParallax items={MOBILE_CARDS} stickyOffset="320px" />
        </div>
      </div>

    </section>
  ) : (
    // ── DESKTOP: Existing ScrollAnimationDemo ─────────────────────
    <ScrollAnimationDemo />
  );
}
