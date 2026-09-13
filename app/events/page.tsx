"use client";
import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { Navbar } from '@/components/navigation/navbar'
import { SectionContainer } from '@/components/layout/section-container'
import { EventCalendar } from '@/features/event/event-calendar'
import { UpcomingEventsList } from '@/features/event/upcoming-events-list'
import { Skiper54 } from '@/components/ui/skiper54'
import { usePageTransition } from '@/components/ui/page-transition'

const EventsPage = () => {
  const { isTransitioning } = usePageTransition();
  const hasAnimatedRef = useRef(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const restContentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prevIsTransitioningRef = useRef(isTransitioning);

  const runAnimation = useCallback(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;
    if (!titleEl || !subtitleEl) return;

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

    // 1. Render at the bottom of the viewport, initially hidden via clipPath
    tl.set([titleEl, subtitleEl], {
      y: startY + 40,
      autoAlpha: 1,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    if (restContentRef.current) {
      tl.set(restContentRef.current, { autoAlpha: 0 });
    }

    // 2. Reveal text animation at the bottom of the screen
    tl.to([titleEl, subtitleEl], {
      y: startY,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.2,
      stagger: 0.15,
      ease: ease as any,
    });

    // 3. Smoothly animate and shift up into natural resting position
    tl.to([titleEl, subtitleEl], {
      y: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: ease as any,
      clearProps: "transform,clipPath",
    });

    // 4. Coordinate graceful entrance for remaining page sections
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
    if (isTransitioning) {
      const handleComplete = () => {
        runAnimation();
      };
      window.addEventListener("pageTransitionComplete", handleComplete, { once: true });
      return () => {
        window.removeEventListener("pageTransitionComplete", handleComplete);
      };
    } else {
      const timer = setTimeout(() => {
        runAnimation();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, runAnimation]);

  useEffect(() => {
    if (prevIsTransitioningRef.current && !isTransitioning) {
      runAnimation();
    }
    prevIsTransitioningRef.current = isTransitioning;
  }, [isTransitioning, runAnimation]);

  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
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
              className="w-full text-left mb-6 md:mb-8 lg:mb-10 will-change-transform opacity-0"
            >
              <h1 className="text-[clamp(3.5rem,12vw,14rem)] font-bold tracking-tight leading-[0.92] text-black select-none font-heading">
                Upcoming Events
              </h1>
            </div>
            
            <div
              ref={subtitleRef}
              className="w-full flow-root overflow-hidden will-change-transform opacity-0"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-black leading-tight tracking-tight m-0 p-0">
                Real change happens offline. Find a local project, roll up your sleeves, and make this weekend count.
              </p>
            </div>
          </div>
        </section>
      <div ref={restContentRef} style={{ opacity: 0, visibility: 'hidden' }}>
        <UpcomingEventsList />
        <EventCalendar />
        <Skiper54 />
      </div>
    </main>
    </>
  )
}

export default EventsPage
