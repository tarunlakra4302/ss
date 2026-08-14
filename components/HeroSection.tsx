"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";
import { ScrollAnimationDemo } from "@/features/homepage/scroll-animation-demo";

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
          <h1 className="text-lg md:text-xl font-medium tracking-tight text-gray-900 leading-relaxed whitespace-nowrap">
            Here is a sneak peak into our communities redefining conscious living.
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
