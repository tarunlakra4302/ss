"use client";
import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { Navbar } from '@/components/navigation/navbar'
import { Blog8 } from '@/components/blog8'
import { usePageTransition } from '@/components/ui/page-transition'

const BlogPage = () => {
  const { isTransitioning } = usePageTransition();
  const hasAnimatedRef = useRef(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const restContentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prevIsTransitioningRef = useRef(isTransitioning);

  const runAnimation = useCallback(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;
    if (!titleEl || !subtitleEl) return;

    // Calculate vertical offset so elements render at the bottom of the screen
    const subtitleRect = subtitleEl.getBoundingClientRect();
    const bottomPadding = window.innerWidth < 768 ? 28 : 52;
    const offset = window.innerHeight - subtitleRect.bottom - bottomPadding;
    const startY = Math.max(offset, 160);

    if (tlRef.current) {
      tlRef.current.kill();
    }

    const ease =
      typeof window !== "undefined" && gsap.parseEase("awwwardsEase")
        ? "awwwardsEase"
        : "power4.out";

    const tl = gsap.timeline();
    tlRef.current = tl;

    // 1. Title is positioned at bottom and hidden via clipPath; subtitle starts hidden at bottom
    tl.set(titleEl, {
      y: startY + 40,
      autoAlpha: 1,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    tl.set(subtitleEl, {
      y: startY + 40,
      autoAlpha: 0,
    });

    if (restContentRef.current) {
      tl.set(restContentRef.current, { autoAlpha: 0 });
    }

    // 2. Text reveal animation ONLY on "Our Blog" title (extended to 130% to prevent clipping the descender 'g')
    tl.to(titleEl, {
      y: startY,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 130%, 0% 130%)",
      duration: 1.2,
      ease: ease as any,
    });

    // 3. Shift both title and subtitle up into natural resting position
    tl.to([titleEl, subtitleEl], {
      y: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: ease as any,
      clearProps: "transform,clipPath",
    });

    // 4. Fade in the subtitle simultaneously during the shift up (retaining visible state permanently)
    tl.to(
      subtitleEl,
      {
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out",
      },
      "<"
    );

    // 5. Coordinate graceful entrance for remaining page sections
    if (restContentRef.current) {
      tl.to(
        restContentRef.current,
        {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "opacity,visibility",
        },
        "-=0.6"
      );
    }
  }, []);

  // Trigger when page transition finishes, or on initial direct load (ensuring fonts are ready)
  useEffect(() => {
    const trigger = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          requestAnimationFrame(() => runAnimation());
        });
      } else {
        runAnimation();
      }
    };

    if (isTransitioning) {
      const handleComplete = () => {
        trigger();
      };
      window.addEventListener("pageTransitionComplete", handleComplete, { once: true });
      return () => {
        window.removeEventListener("pageTransitionComplete", handleComplete);
      };
    } else {
      // Direct load or refresh fallback
      const timer = setTimeout(() => {
        trigger();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, runAnimation]);

  // Safety trigger if isTransitioning toggles from true to false
  useEffect(() => {
    if (prevIsTransitioningRef.current && !isTransitioning) {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          requestAnimationFrame(() => runAnimation());
        });
      } else {
        runAnimation();
      }
    }
    prevIsTransitioningRef.current = isTransitioning;
  }, [isTransitioning, runAnimation]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full mt-20 md:mt-28 lg:mt-36">
        <section className="w-full bg-white pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-24 overflow-hidden">
          <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div
              ref={titleRef}
              className="w-full text-left mb-12 md:mb-16 lg:mb-20 pb-4 will-change-transform opacity-0 overflow-visible"
            >
              <h1 className="text-[clamp(3.5rem,12vw,14rem)] font-bold tracking-tight leading-[0.98] pb-2 text-black select-none font-heading">
                Our Blog
              </h1>
            </div>

            <div
              ref={subtitleRef}
              className="w-full flow-root overflow-hidden will-change-transform opacity-0"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-black leading-tight tracking-tight m-0 p-0">
                Explore our latest thoughts on sustainable design, technological innovation, and the future of digital architecture.
              </p>
            </div>
          </div>
        </section>

        <div ref={restContentRef} className="w-full">
          <Blog8 heading="" description="" />
        </div>
      </main>
    </>
  );
};

export default BlogPage;


