'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <div
    data-flow-section
    aria-label={ariaLabel}
    className={cx(
      'absolute inset-0 h-full w-full overflow-hidden will-change-transform flex flex-col justify-between shadow-2xl',
      className
    )}
    style={{
      ...style,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'translateZ(0)',
    }}
  >
    <div
      data-flow-inner
      className={cx(
        'flow-art-container relative flex h-full w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,6vw,4vw)] pb-[clamp(1.5rem,4vw,3.5vw)] overflow-hidden',
        'will-change-transform'
      )}
      style={{
        transformOrigin: 'bottom left',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  </div>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || !stageRef.current || reducedMotion) return;

      const sections = Array.from(
        stageRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length <= 1) return;

      // Set initial positions, rotations, and z-indexes with hardware acceleration
      sections.forEach((section, i) => {
        gsap.set(section, {
          zIndex: i + 1,
          yPercent: i === 0 ? 0 : 100,
          scale: 1,
          opacity: 1,
          force3D: true,
        });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (inner) {
          gsap.set(inner, {
            rotation: i === 0 ? 0 : 12,
            transformOrigin: 'bottom left',
            force3D: true,
          });
        }
      });

      const totalSteps = sections.length - 1;

      // Single pinned container timeline with smooth scrub damping
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${totalSteps * 180}vh`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8, // Smooth and responsive scrub inertia
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      for (let i = 1; i < sections.length; i++) {
        const currentSection = sections[i];
        const currentInner = currentSection.querySelector<HTMLElement>('.flow-art-container');
        const prevSection = sections[i - 1];
        const stepLabel = `step-${i}`;

        tl.addLabel(stepLabel);

        if (prevSection) {
          tl.to(
            prevSection,
            {
              scale: 0.94,
              opacity: 0.6,
              duration: 1,
              ease: 'none',
              force3D: true,
            },
            stepLabel
          );
        }

        tl.to(
          currentSection,
          {
            yPercent: 0,
            duration: 1,
            ease: 'none',
            force3D: true,
          },
          stepLabel
        );

        if (currentInner) {
          tl.to(
            currentInner,
            {
              rotation: 0,
              duration: 1,
              ease: 'none',
              force3D: true,
            },
            stepLabel
          );
        }

        if (i < sections.length - 1) {
          tl.to({}, { duration: 0.2 });
        }
      }

      // Settle buffer after last step
      tl.to({}, { duration: 0.2 });

      // Refresh ScrollTrigger after initial paint to sync all page triggers
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        aria-label={ariaLabel}
        className={cx('relative w-full flex flex-col', className)}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('relative w-full z-20', className)}
    >
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
};

export default FlowArt;
