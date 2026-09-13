"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import Link from "next/link";
import Image from "next/image";
import { TextRoll } from "@/components/ui/text-roll";
import { useLoading } from "@/features/homepage/loading-context";
import { usePathname } from "next/navigation";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface NavbarProps {
  hideLogo?: boolean;
  hideMenuText?: boolean;
}

export function Navbar({ hideLogo = false, hideMenuText = false }: NavbarProps = {}) {
  // We need a ref for the parent container to scope GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isComplete } = useLoading();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isZeroWaste = pathname?.startsWith("/zero-waste-archive");
  const showLogo = !hideLogo && !isZeroWaste;
  const showMenuText = !hideMenuText && !isZeroWaste;

  // Initial Setup & Hover Effects
  useEffect(() => {
    if (!containerRef.current) return;

    // Create custom easing
    try {
        if (!gsap.parseEase("main")) {
            CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
            gsap.defaults({ ease: "main", duration: 0.7 });
        }
    } catch (e) {
        console.warn("CustomEase failed to load, falling back to default.", e);
        gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      // 1. Arrow Animation (Removed from indicator, but keeping logic if arrow existed/restored elsewhere)
      // Since arrow is removed from JSX, this selector won't find anything, which is fine (safe check).
      const arrowLine = document.querySelector(".arrow-line");
      if (arrowLine) {
        const pathLength = (arrowLine as SVGPathElement).getTotalLength();
        gsap.set(arrowLine, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        arrowTl
          .to(arrowLine, { strokeDashoffset: 0, duration: 1, ease: "power2.out" })
          .to({}, { duration: 1.2 })
          .to(arrowLine, { strokeDashoffset: -pathLength, duration: 0.6, ease: "power2.in" })
          .set(arrowLine, { strokeDashoffset: pathLength });
      }

      // 2. Shape Hover
      // Updated Selectors: .menu-list-item -> .menu-list-item, .abstract-shapes -> .ambient-background-shapes
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");
      
      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        // Updated Selector: .shape -> .bg-shape
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;
        
        if (!shape) return;

        // Updated Selector: .shape-el -> .shape-element
        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
             if (shapesContainer) {
                 // Updated Selector: .shape -> .bg-shape
                 shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
             }
             shape.classList.add("active");
             
             gsap.fromTo(shapeEls, 
                { scale: 0.5, opacity: 0, rotation: -10 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
             );
        };
        
        const onLeave = () => {
            gsap.to(shapeEls, {
                scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                onComplete: () => shape.classList.remove("active"),
                overwrite: "auto"
            });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        
        (item as any)._cleanup = () => {
            item.removeEventListener("mouseenter", onEnter);
            item.removeEventListener("mouseleave", onLeave);
        };
      });
      
    }, containerRef);

    return () => {
        ctx.revert();
        if (containerRef.current) {
            const items = containerRef.current.querySelectorAll(".menu-list-item[data-shape]");
            items.forEach((item: any) => item._cleanup && item._cleanup());
        }
    };
  }, []);

  // Menu Open/Close Animation Effect
  useEffect(() => {
      if (!containerRef.current) return;
      
      const ctx = gsap.context(() => {
        // Updated Selectors: .nav -> .nav-overlay-wrapper, .menu -> .menu-content
        const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
        const menu = containerRef.current!.querySelector(".menu-content");
        const overlay = containerRef.current!.querySelector(".overlay");
        // Updated Selector: .bg-panel -> .backdrop-layer
        const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
        // Updated Selector: .menu-link -> .nav-link
        const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
        const socialLinks = containerRef.current!.querySelectorAll(".social-link");
        
        // Updated Selector: .menu-button -> .nav-close-btn
        const menuButton = containerRef.current!.querySelector(".nav-close-btn");
        const menuButtonTexts = menuButton?.querySelectorAll("p");
        // Updated Selector: .menu-button-icon -> .menu-button-icon (unchanged in CSS/JSX?) No, wait, CSS had .menu-button-icon
        const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

        const tl = gsap.timeline();
        
        if (isMenuOpen) {
            // OPEN
            if (navWrap) navWrap.setAttribute("data-nav", "open");
            
            tl.set(navWrap, { display: "block" })
              .set(menu, { xPercent: 0 }, "<");
              // Animate Button Text Swapping if it exists
              if (menuButtonTexts && menuButtonTexts.length > 0) tl.fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 });
              if (menuButtonIcon) tl.fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<");
              
            tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
              .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
              .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
              .fromTo(socialLinks, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, "<+=0.2");

        } else {
            // CLOSE
            if (navWrap) navWrap.setAttribute("data-nav", "closed");

            tl.to(overlay, { autoAlpha: 0 })
              .to(menu, { xPercent: 120 }, "<");
              // Animate Button Text and Icon Back
            if (menuButtonTexts && menuButtonTexts.length > 0) tl.to(menuButtonTexts, { yPercent: 0 }, "<");
            if (menuButtonIcon) tl.to(menuButtonIcon, { rotate: 0 }, "<");

            tl.set(navWrap, { display: "none" });
        }

      }, containerRef);
      
      return () => ctx.revert();
  }, [isMenuOpen]);

  // Entrance Animation
  useEffect(() => {
    if (!containerRef.current) return;
    
    // On homepage, the Hero component handles the entrance animation to sync with the hero text reveal.
    if (!isHome) {
        gsap.to(".site-header-wrapper", {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "power4.out",
            clearProps: "all"
        });
    } else {
        // Initial hidden state for home page
        gsap.set(".site-header-wrapper", {
            autoAlpha: 0,
            y: 40 // match the shift-up offset
        });
    }
  }, [isHome]);

  // Background Theme & Scroll Direction Detection
  // ALL scroll-driven behavior uses direct DOM manipulation (never React state)
  // to prevent re-renders from wiping the is-dark-bg class on site-header-wrapper.
  useIsomorphicLayoutEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId: number | null = null;

    const getColorBrightness = (colorStr: string): number | null => {
      if (!colorStr || colorStr === "transparent" || colorStr === "rgba(0, 0, 0, 0)") {
        return null;
      }

      // 1. Standard rgb/rgba format: rgb(r, g, b) or rgba(r, g, b, a)
      const rgbMatch = colorStr.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/i);
      if (rgbMatch) {
        const r = parseFloat(rgbMatch[1]);
        const g = parseFloat(rgbMatch[2]);
        const b = parseFloat(rgbMatch[3]);
        return (r * 299 + g * 587 + b * 114) / 1000;
      }

      // 2. oklch(L C H ...) where L is lightness 0..1 or 0%..100%
      const oklchMatch = colorStr.match(/^oklch\(\s*([\d.]+%?)/i);
      if (oklchMatch) {
        let l = parseFloat(oklchMatch[1]);
        if (oklchMatch[1].endsWith("%")) l = l / 100;
        return l * 255;
      }

      // 3. Fallback using temporary canvas for other modern CSS formats
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = colorStr;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
          if (a === 0) return null;
          return (r * 299 + g * 587 + b * 114) / 1000;
        }
      } catch {
        // Fallback gracefully
      }

      return null;
    };

    const detectBackground = (headerWrapper: HTMLElement | null) => {
      const checkPointX = window.innerWidth - 80;
      const checkPointY = 40;
      const menuContainer = document.querySelector('.fullscreen-menu-container') as HTMLElement | null;

      // Temporarily hide fixed overlays so elementFromPoint hits actual page content
      if (headerWrapper) headerWrapper.style.visibility = 'hidden';
      if (menuContainer) menuContainer.style.visibility = 'hidden';

      const elementAtPoint = document.elementFromPoint(checkPointX, checkPointY);

      if (headerWrapper) headerWrapper.style.visibility = '';
      if (menuContainer) menuContainer.style.visibility = '';

      let foundDark = false;
      if (elementAtPoint) {
        const darkParent = elementAtPoint.closest('[data-theme="dark"]');
        if (darkParent) {
          foundDark = true;
        } else {
          let currentEl: HTMLElement | null = elementAtPoint as HTMLElement;
          while (currentEl && currentEl !== document.documentElement) {
            const bg = window.getComputedStyle(currentEl).backgroundColor;
            const brightness = getColorBrightness(bg);
            if (brightness !== null) {
              if (brightness < 128) foundDark = true;
              break;
            }
            currentEl = currentEl.parentElement;
          }
        }
      }

      // Direct DOM toggle for theme — zero lag
      if (headerWrapper) {
        headerWrapper.classList.toggle('is-dark-bg', foundDark);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const menuBtn = document.querySelector('.nav-close-btn') as HTMLElement | null;

      // Scroll direction → show/hide menu button via direct DOM class toggle
      if (menuBtn) {
        if (currentScrollY <= 50 || currentScrollY < lastScrollY - 5) {
          menuBtn.classList.remove('is-scroll-hidden');
        } else if (currentScrollY > lastScrollY + 5) {
          menuBtn.classList.add('is-scroll-hidden');
        }
      }

      lastScrollY = currentScrollY;

      // Throttle background detection to one check per animation frame
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const headerWrapper = document.querySelector('.site-header-wrapper') as HTMLElement | null;
        detectBackground(headerWrapper);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Immediate synchronous initial detection
    const headerWrapper = document.querySelector('.site-header-wrapper') as HTMLElement | null;
    detectBackground(headerWrapper);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // keydown Escape handling
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isMenuOpen) {
            setIsMenuOpen(false);
        }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef}>
        <div className={`site-header-wrapper ${isMenuOpen ? 'is-menu-open' : ''} ${isHome && !isComplete ? 'opacity-0 invisible' : ''}`}>
          <header className="header">
            <div className="container is--full">
              <nav className="nav-row">
                {showLogo && (
                  <Link href="/" aria-label="home" className="nav-logo-row flex items-center justify-start h-14 md:h-20 shrink-0 z-10" style={{ pointerEvents: 'auto' }}>
                     <Image 
                       src="/SS Logo_white Text clean.png" 
                       alt="Sustainable Sundays Logo" 
                       width={320}
                       height={100}
                       priority
                       className="h-12 sm:h-14 md:h-20 w-auto max-w-[210px] sm:max-w-[260px] md:max-w-[320px] object-contain shrink-0"
                     />
                  </Link>
                )}
                <div className="nav-row__right ml-auto">
                  <button 
                    role="button" 
                    className="nav-close-btn"
                    onClick={toggleMenu} 
                    style={{ pointerEvents: 'auto' }}
                  >
                    {showMenuText && (
                      <div className="menu-button-text">
                        <p className="p-large">Menu</p>
                        <p className="p-large">Close</p>
                      </div>
                    )}
                    <div className="icon-wrap flex items-center justify-center">
                      {isMenuOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="menu-button-icon"
                        >
                          <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor" />
                          <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="14"
                          viewBox="0 0 18 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="menu-button-icon"
                        >
                          <line x1="0" y1="2" x2="18" y2="2" />
                          <line x1="0" y1="7" x2="18" y2="7" />
                          <line x1="0" y1="12" x2="18" y2="12" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </header>
        </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          {/* Overlay must stay above or below depending on desired clickability. 
              The original has it cover content. */}
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              {/* Abstract shapes container */}
              <div className="ambient-background-shapes">
                {/* Shape 1: Floating circles */}
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(99,102,241,0.15)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(139,92,246,0.12)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(236,72,153,0.1)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(99,102,241,0.15)" />
                </svg>

                {/* Shape 2: Wave pattern */}
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(99,102,241,0.2)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(139,92,246,0.15)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                {/* Shape 3: Grid dots */}
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(99,102,241,0.3)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(139,92,246,0.3)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(236,72,153,0.3)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(99,102,241,0.3)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(139,92,246,0.25)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(236,72,153,0.25)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(99,102,241,0.25)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(236,72,153,0.3)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(99,102,241,0.3)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(139,92,246,0.3)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(236,72,153,0.3)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(99,102,241,0.3)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(139,92,246,0.3)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(236,72,153,0.3)" />
                </svg>

                {/* Shape 4: Organic blobs */}
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(99,102,241,0.12)"
                  />
                  <path
                    className="shape-element"
                    d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(236,72,153,0.1)"
                  />
                </svg>

                {/* Shape 5: Diagonal lines */}
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(99,102,241,0.15)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(139,92,246,0.12)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(236,72,153,0.1)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                <li className="menu-list-item" data-shape="1">
                  <Link href="/about" className="nav-link w-inline-block">
                    <TextRoll className="nav-link-text">About us</TextRoll>
                    <div className="nav-link-hover-bg pointer-events-none"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="3">
                  <Link href="/events" className="nav-link w-inline-block">
                    <TextRoll className="nav-link-text">Events</TextRoll>
                    <div className="nav-link-hover-bg pointer-events-none"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="4">
                  <Link href="/zero-waste-archive" className="nav-link w-inline-block">
                    <TextRoll className="nav-link-text">Zero Waste Hub</TextRoll>
                    <div className="nav-link-hover-bg pointer-events-none"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="4">
                  <Link href="/blog" className="nav-link w-inline-block">
                    <TextRoll className="nav-link-text">Blog</TextRoll>
                    <div className="nav-link-hover-bg pointer-events-none"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="5">
                  <Link href="/contact" className="nav-link w-inline-block">
                    <TextRoll className="nav-link-text">Contact us</TextRoll>
                    <div className="nav-link-hover-bg pointer-events-none"></div>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="menu-socials absolute bottom-12 left-0 w-full px-[10%] flex gap-8 z-20">
              <a href="https://www.whatsapp.com/channel/0029Vb8Ade0CHDyiSG6zlB0f" target="_blank" rel="noopener noreferrer" className="social-link block overflow-hidden">
                <TextRoll className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/50 hover:text-black transition-colors duration-300">WhatsApp</TextRoll>
              </a>
              <a href="https://www.instagram.com/sustainable_sundays_blr/" target="_blank" rel="noopener noreferrer" className="social-link block overflow-hidden">
                <TextRoll className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/50 hover:text-black transition-colors duration-300">Instagram</TextRoll>
              </a>
              <a href="https://www.linkedin.com/company/sustainable-sundays" target="_blank" rel="noopener noreferrer" className="social-link block overflow-hidden">
                <TextRoll className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/50 hover:text-black transition-colors duration-300">LinkedIn</TextRoll>
              </a>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
