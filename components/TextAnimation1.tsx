"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface TextAnimation1Props {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

export default function TextAnimation1({ children, animateOnScroll = true, delay = 0 }: TextAnimation1Props) {
  const containerRef = useRef<HTMLElement>(null);
  const elementRef = useRef<Element[]>([]);
  const splitRef = useRef<InstanceType<typeof SplitText>[]>([]);
  const lines = useRef<Element[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const init = () => {
      if (!containerRef.current) return;
      
      // Ensure we run after the next tick to let any layout shifts settle
      requestAnimationFrame(() => {
        if (!containerRef.current) return;
        
        // Re-check fonts just in case SplitText is still complaining
        if (document.fonts && !document.fonts.check("1em Arial")) { // Dummy check to trigger font system
          // If we suspect fonts aren't ready, wait one more frame
        }

        splitRef.current = [];
        elementRef.current = [];
        lines.current = [];

        let elements: Element[] = [];
        if (containerRef.current.hasAttribute("data-copy-wrapper")) {
          elements = Array.from(containerRef.current.children);
        } else {
          elements = [containerRef.current];
        }

        elements.forEach((element) => {
          elementRef.current.push(element);

          const split = SplitText.create(element as HTMLElement, {
            type: "lines",
            linesClass: "line++",
          });
          splitRef.current.push(split);

          const computedStyle = window.getComputedStyle(element as HTMLElement);
          const textIndent = computedStyle.textIndent;

          if (textIndent && textIndent !== "0px") {
            if (split.lines.length > 0) {
              (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
            }
            (element as HTMLElement).style.textIndent = "0";
          }

          lines.current.push(...split.lines);
        });

        gsap.set(lines.current, { y: "100%" });

        const animationProps = {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: delay,
        };

        if (animateOnScroll) {
          gsap.to(lines.current, {
            ...animationProps,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              once: true,
            },
          });
        } else {
          gsap.to(lines.current, animationProps);
        }
      });
    };

    const handleInit = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          // Extra safety delay for some browsers where 'ready' resolves slightly early
          setTimeout(init, 150);
        });
      } else {
        setTimeout(init, 150);
      }
    };

    handleInit();

    return () => {
      splitRef.current.forEach((split) => {
        if (split) {
          split.revert();
        }
      });
    };
  }, { scope: containerRef, dependencies: [animateOnScroll, delay] });

  if (React.Children.count(children) === 1) {
    const child = React.Children.only(children) as React.ReactElement<any>;
    return React.cloneElement(child, { 
      ref: containerRef,
      className: cn(child.props.className, "relative")
    });
  }
return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className="relative" data-copy-wrapper="true">
      {children}
    </div>
  );
}