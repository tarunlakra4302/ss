"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  try {
    if (!gsap.parseEase("awwwardsEase")) {
      CustomEase.create("awwwardsEase", "0.77, 0, 0.175, 1");
    }
  } catch (e) {
    // fallback
  }
}

export type AnimationVariant =
  | "circle"
  | "rectangle"
  | "gif"
  | "polygon"
  | "circle-blur";

export type AnimationStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "top-center"
  | "bottom-center"
  | "bottom-up"
  | "top-down"
  | "left-right"
  | "right-left";

interface ClipPathSequence {
  initial: string;
  covered: string;
  unveil: string;
}

export const getBlackCurtainClipPaths = (
  variant: AnimationVariant,
  start: AnimationStart
): ClipPathSequence => {
  if (variant === "rectangle") {
    switch (start) {
      case "bottom-up":
        return {
          initial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        };
      case "top-down":
        return {
          initial: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        };
      case "left-right":
        return {
          initial: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        };
      case "right-left":
        return {
          initial: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        };
      case "top-left":
        return {
          initial: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
        };
      case "top-right":
        return {
          initial: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
        };
      case "bottom-left":
        return {
          initial: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
        };
      case "bottom-right":
        return {
          initial: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        };
      default:
        return {
          initial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          unveil: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        };
    }
  }

  if (variant === "circle" || variant === "circle-blur") {
    switch (start) {
      case "top-left":
        return {
          initial: "circle(0% at 0% 0%)",
          covered: "circle(150% at 0% 0%)",
          unveil: "circle(0% at 100% 100%)",
        };
      case "top-right":
        return {
          initial: "circle(0% at 100% 0%)",
          covered: "circle(150% at 100% 0%)",
          unveil: "circle(0% at 0% 100%)",
        };
      case "bottom-left":
        return {
          initial: "circle(0% at 0% 100%)",
          covered: "circle(150% at 0% 100%)",
          unveil: "circle(0% at 100% 0%)",
        };
      case "bottom-right":
        return {
          initial: "circle(0% at 100% 100%)",
          covered: "circle(150% at 100% 100%)",
          unveil: "circle(0% at 0% 0%)",
        };
      case "top-center":
        return {
          initial: "circle(0% at 50% 0%)",
          covered: "circle(150% at 50% 0%)",
          unveil: "circle(0% at 50% 100%)",
        };
      case "bottom-center":
        return {
          initial: "circle(0% at 50% 100%)",
          covered: "circle(150% at 50% 100%)",
          unveil: "circle(0% at 50% 0%)",
        };
      case "center":
      default:
        return {
          initial: "circle(0% at 50% 50%)",
          covered: "circle(150% at 50% 50%)",
          unveil: "circle(0% at 50% 50%)",
        };
    }
  }

  if (variant === "polygon") {
    switch (start) {
      case "top-left":
        return {
          initial: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
          covered: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
          unveil: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
        };
      case "top-right":
        return {
          initial: "polygon(150% -71%, 250% 71%, 250% 71%, 150% -71%)",
          covered: "polygon(150% -71%, 250% 71%, 50% 171%, -71% 50%)",
          unveil: "polygon(-71% 50%, 50% 171%, 50% 171%, -71% 50%)",
        };
      default:
        return {
          initial: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
          covered: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
          unveil: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
        };
    }
  }

  return {
    initial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    covered: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    unveil: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  };
};

interface TransitionOptions {
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}

interface PageTransitionContextType {
  navigateWithTransition: (href: string, options?: TransitionOptions) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

/**
 * Global PageTransitionProvider
 * Delivers solid black transition animations with GSAP and View Transitions API.
 */
export function PageTransitionProvider({
  children,
  variant = "rectangle",
  start = "bottom-up",
  blur = false,
  gifUrl = "",
}: {
  children: React.ReactNode;
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const curtainRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Setup initial curtain state on mount
  useEffect(() => {
    if (curtainRef.current) {
      const paths = getBlackCurtainClipPaths(variant, start);
      gsap.set(curtainRef.current, {
        clipPath: paths.initial,
        autoAlpha: 0,
      });
    }
  }, [variant, start]);

  // When pathname changes after navigation, play the Unveil phase of the black curtain
  useEffect(() => {
    if (isNavigatingRef.current && curtainRef.current) {
      const paths = getBlackCurtainClipPaths(variant, start);
      const ease = gsap.parseEase("awwwardsEase") ? "awwwardsEase" : "power4.inOut";

      // Small delay to ensure the new DOM is painted
      const timer = setTimeout(() => {
        if (timelineRef.current) timelineRef.current.kill();

        const tl = gsap.timeline({
          onComplete: () => {
            if (curtainRef.current) {
              gsap.set(curtainRef.current, {
                autoAlpha: 0,
                clipPath: paths.initial,
              });
            }
            isNavigatingRef.current = false;
            setIsTransitioning(false);
          },
        });

        timelineRef.current = tl;

        tl.to(curtainRef.current, {
          clipPath: paths.unveil,
          duration: 0.45,
          ease: ease as any,
          filter: blur ? "blur(0px)" : "none",
        });
      }, 40);

      return () => clearTimeout(timer);
    }
  }, [pathname, variant, start, blur]);

  const navigateWithTransition = useCallback(
    (href: string, options: TransitionOptions = {}) => {
      const activeVariant = options.variant || variant;
      const activeStart = options.start || start;
      const activeBlur = options.blur !== undefined ? options.blur : blur;

      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;
      setIsTransitioning(true);

      const curtain = curtainRef.current;
      if (!curtain) {
        router.push(href);
        return;
      }

      const paths = getBlackCurtainClipPaths(activeVariant, activeStart);
      const ease = gsap.parseEase("awwwardsEase") ? "awwwardsEase" : "power4.inOut";

      if (timelineRef.current) timelineRef.current.kill();

      // Phase 1: Animate Black Curtain IN over the screen
      gsap.set(curtain, {
        clipPath: paths.initial,
        autoAlpha: 1,
        filter: activeBlur ? "blur(6px)" : "none",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          // Screen is fully covered in deep black — navigate to new route
          React.startTransition(() => {
            router.push(href);
          });
        },
      });

      timelineRef.current = tl;

      tl.to(curtain, {
        clipPath: paths.covered,
        duration: 0.42,
        ease: ease as any,
        filter: activeBlur ? "blur(2px)" : "none",
      });
    },
    [router, variant, start, blur]
  );

  // Global click interceptor for standard Next.js Link / <a> tags
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      const download = anchor.getAttribute("download");

      if (
        !href ||
        targetAttr === "_blank" ||
        download ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("blob:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) {
          // Same page hash scroll check
          if (
            url.pathname === window.location.pathname &&
            url.search === window.location.search &&
            url.hash
          ) {
            return;
          }

          // Exact same route check
          if (
            url.pathname === window.location.pathname &&
            url.search === window.location.search &&
            !url.hash
          ) {
            return;
          }

          event.preventDefault();
          navigateWithTransition(url.pathname + url.search + url.hash, {
            variant,
            start,
            blur,
            gifUrl,
          });
        }
      } catch (err) {
        // Invalid URL, ignore
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [navigateWithTransition, variant, start, blur, gifUrl]);

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      {/* Pure Black Curtain Element */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="fixed inset-0 z-[999999] pointer-events-none bg-[#000000]"
        style={{
          willChange: "clip-path, transform, filter",
          transform: "translateZ(0)",
          backgroundColor: "#000000",
        }}
      />
    </PageTransitionContext.Provider>
  );
}

export const TransitionLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: AnimationVariant;
    start?: AnimationStart;
    blur?: boolean;
    gifUrl?: string;
  }
>(
  (
    {
      href,
      onClick,
      variant = "rectangle",
      start = "bottom-up",
      blur = false,
      gifUrl = "",
      children,
      ...props
    },
    ref
  ) => {
    const { navigateWithTransition } = usePageTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (onClick) onClick(e);

      if (
        !e.defaultPrevented &&
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey &&
        props.target !== "_blank"
      ) {
        let dest = "/";
        if (typeof href === "string") {
          dest = href;
        } else if (href && typeof href === "object") {
          const urlObj = href as { pathname?: string | null };
          if (typeof urlObj.pathname === "string") {
            dest = urlObj.pathname;
          }
        }
        if (!dest.startsWith("#") && !dest.startsWith("mailto:") && !dest.startsWith("tel:")) {
          e.preventDefault();
          navigateWithTransition(dest, { variant, start, blur, gifUrl });
        }
      }
    };

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }
);

TransitionLink.displayName = "TransitionLink";
