"use client";
import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { Navbar } from '@/components/navigation/navbar'
import { StorySection } from '@/features/homepage/story'
import { AboutJourney } from '@/features/about/about-journey'
import { galleryImages, memoryLaneData } from '@/lib/data/about-data'
import { AboutInitiatives } from '@/features/about/about-initiatives'
import { MemoryLaneTimeline } from '@/components/sections/memory-lane-timeline'
import { usePageTransition } from '@/components/ui/page-transition'

const AboutPage = () => {
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

    // 1. Initial setup at bottom of screen (matching homepage Hero)
    // Title positioned at bottom and clipped
    tl.set(titleEl, {
      y: startY + 40,
      autoAlpha: 1,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    // Subtitle initially hidden at bottom
    tl.set(subtitleEl, {
      y: startY + 40,
      autoAlpha: 0,
    });

    if (restContentRef.current) {
      tl.set(restContentRef.current, { autoAlpha: 0 });
    }

    // 2. Reveal ONLY the title text at the bottom of the screen (matching homepage Hero)
    tl.to(titleEl, {
      y: startY,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.2,
      ease: ease as any,
    });

    // 3. Shift elements up into natural resting position (y: 0)
    tl.to([titleEl, subtitleEl], {
      y: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: ease as any,
      clearProps: "transform,clipPath",
    });

    // 4. Fade in subtitle simultaneously as it shifts up (matching homepage Hero)
    tl.to(subtitleEl, {
      autoAlpha: 1,
      duration: 1.0,
      ease: "power2.out",
      clearProps: "opacity,visibility",
    }, "<");

    // 5. Fade in remaining page sections gracefully
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

  useEffect(() => {
    // Detect whether the current page load is a browser reload
    const navEntries =
      typeof performance !== "undefined" && performance.getEntriesByType
        ? performance.getEntriesByType("navigation")
        : [];
    const isReload =
      navEntries.length > 0 &&
      (navEntries[0] as PerformanceNavigationTiming).type === "reload";

    if (isReload) {
      sessionStorage.removeItem("about_hero_has_animated");
    }

    const alreadyAnimated =
      !isReload &&
      typeof window !== "undefined" &&
      sessionStorage.getItem("about_hero_has_animated") === "true";

    if (alreadyAnimated) {
      hasAnimatedRef.current = true;
      const titleEl = titleRef.current;
      const subtitleEl = subtitleRef.current;
      const restEl = restContentRef.current;
      if (titleEl) {
        gsap.set(titleEl, {
          autoAlpha: 1,
          y: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          clearProps: "clipPath,transform",
        });
      }
      if (subtitleEl) {
        gsap.set(subtitleEl, {
          autoAlpha: 1,
          y: 0,
          clearProps: "opacity,visibility,transform",
        });
      }
      if (restEl) {
        gsap.set(restEl, {
          autoAlpha: 1,
          clearProps: "opacity,visibility",
        });
      }
      return;
    }

    if (isTransitioning) {
      const handleComplete = () => {
        sessionStorage.setItem("about_hero_has_animated", "true");
        runAnimation();
      };
      window.addEventListener("pageTransitionComplete", handleComplete, {
        once: true,
      });
      return () => {
        window.removeEventListener("pageTransitionComplete", handleComplete);
      };
    } else {
      let isMounted = true;
      const initAnim = () => {
        if (!isMounted) return;
        sessionStorage.setItem("about_hero_has_animated", "true");
        runAnimation();
      };

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
          setTimeout(initAnim, 50);
        });
      } else {
        setTimeout(initAnim, 80);
      }

      return () => {
        isMounted = false;
      };
    }
  }, [isTransitioning, runAnimation]);

  useEffect(() => {
    const alreadyAnimated =
      typeof window !== "undefined" &&
      sessionStorage.getItem("about_hero_has_animated") === "true";
    if (prevIsTransitioningRef.current && !isTransitioning && !alreadyAnimated) {
      sessionStorage.setItem("about_hero_has_animated", "true");
      runAnimation();
    }
    prevIsTransitioningRef.current = isTransitioning;
  }, [isTransitioning, runAnimation]);

  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  // Handle anchor link to #team
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#team") {
      const el = document.getElementById("team");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full mt-20 md:mt-28 lg:mt-36">
        <section className="w-full bg-white pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-24">
          <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div
              ref={titleRef}
              style={{ opacity: 0, visibility: "hidden" }}
              className="w-full text-left mb-3 md:mb-4 lg:mb-6 will-change-transform"
            >
              <h1 className="text-[clamp(3.5rem,12vw,14rem)] font-bold tracking-tight leading-[0.92] text-black select-none font-heading">
                About Us
              </h1>
            </div>

            <div
              ref={subtitleRef}
              style={{ opacity: 0, visibility: "hidden" }}
              className="w-full text-left will-change-transform"
            >
              <p className="text-[11px] sm:text-[13px] md:text-[15px] lg:text-[19px] font-normal text-black leading-snug tracking-tight m-0 p-0 text-left">
                Here is a sneak peak into our communities redefining conscious living.
              </p>
            </div>
          </div>
        </section>

        <div ref={restContentRef} style={{ opacity: 0, visibility: 'hidden' }}>
          <StorySection />
          <AboutJourney images={galleryImages} />
          <AboutInitiatives />
          <MemoryLaneTimeline data={memoryLaneData} />
        </div>
      </main>
    </>
  );
};

export default AboutPage
