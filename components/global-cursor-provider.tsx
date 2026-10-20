'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { CursorProvider, Cursor, CursorFollow } from '@/components/ui/cursor';

// Helper to determine if a color is dark
function isColorDark(rgbStr: string): boolean {
  const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return false;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  // Perceived brightness formula (ITU-R BT.709)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

export function GlobalCursorProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isInHeroSection, setIsInHeroSection] = React.useState(false);
  const [isDarkBg, setIsDarkBg] = React.useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = React.useState(false);

  // Check if current route is about, blog, or events
  const isTargetPage = React.useMemo(() => {
    if (!pathname) return false;
    return (
      pathname.startsWith('/about') ||
      pathname.startsWith('/blog') ||
      pathname.startsWith('/events')
    );
  }, [pathname]);

  // Reset scroll detection on route change and watch for first scroll
  React.useEffect(() => {
    // If the page already has a scroll offset upon landing/navigation, mark as scrolled
    if (window.scrollY > 20) {
      setHasScrolledOnce(true);
    } else {
      setHasScrolledOnce(false);
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolledOnce(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  React.useEffect(() => {
    let lastCheckedTime = 0;

    const findHeroElement = () => {
      return (
        document.querySelector<HTMLElement>('[data-hero-section="true"]') ||
        document.querySelector<HTMLElement>('main > section:first-of-type') ||
        document.querySelector<HTMLElement>('section:first-of-type')
      );
    };

    const isNavMenuOpen = () => {
      const navWrap = document.querySelector<HTMLElement>('.nav-overlay-wrapper');
      return (
        navWrap?.getAttribute('data-nav') === 'open' ||
        (navWrap && window.getComputedStyle(navWrap).display !== 'none')
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle DOM calculations to ~60ms (plenty fast for cursor contrast, zero main-thread hitching)
      if (now - lastCheckedTime < 60) return;
      lastCheckedTime = now;

      // 1. Hero section boundary detection for target pages (only if menu is closed)
      if (isTargetPage && !isNavMenuOpen()) {
        const heroEl = findHeroElement();
        if (heroEl) {
          const rect = heroEl.getBoundingClientRect();
          const inHero =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          setIsInHeroSection(inHero);
        } else {
          setIsInHeroSection(false);
        }
      } else {
        setIsInHeroSection(false);
      }

      // 2. Sample background color under cursor using fast selector first
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        if (el.closest('[data-theme="dark"], .dark, [data-mode="dark"]')) {
          setIsDarkBg(true);
        } else {
          // Walk up at most 3 levels to avoid deep DOM traversal
          let curr: HTMLElement | null = el as HTMLElement;
          let detectedDark = false;
          let depth = 0;

          while (curr && curr !== document.body && depth < 3) {
            const bg = curr.style.backgroundColor || window.getComputedStyle(curr).backgroundColor;
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
              detectedDark = isColorDark(bg);
              break;
            }
            curr = curr.parentElement;
            depth++;
          }

          setIsDarkBg(detectedDark);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsInHeroSection(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Watch for menu opening immediately
    const navWrap = document.querySelector<HTMLElement>('.nav-overlay-wrapper');
    let observer: MutationObserver | null = null;
    if (navWrap) {
      observer = new MutationObserver(() => {
        if (isNavMenuOpen()) {
          setIsInHeroSection(false);
        }
      });
      observer.observe(navWrap, { attributes: true, attributeFilter: ['data-nav', 'style', 'class'] });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (observer) observer.disconnect();
    };
  }, [isTargetPage, pathname]);

  const shouldShowScrollText = isTargetPage && isInHeroSection && !hasScrolledOnce;

  return (
    <CursorProvider className="min-h-full flex flex-col flex-1">
      {children}
      <Cursor>
        <svg
          className={`size-6 -translate-x-[1px] -translate-y-[1.5px] transition-colors duration-200 ${
            isDarkBg
              ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
              : 'text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
        >
          <path
            fill="currentColor"
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
          />
        </svg>
      </Cursor>
      {shouldShowScrollText && (
        <CursorFollow
          align="bottom-right"
          sideOffset={8}
          transition={{ stiffness: 350, damping: 28 }}
        >
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase shadow-lg border select-none pointer-events-none transition-colors duration-200 ${
              isDarkBg
                ? 'bg-white/90 text-black border-black/10 backdrop-blur-md'
                : 'bg-black/85 text-white border-white/10 backdrop-blur-md'
            }`}
          >
            <span>Scroll down</span>
          </div>
        </CursorFollow>
      )}
    </CursorProvider>
  );
}
