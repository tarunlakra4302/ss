"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

export function SterlingGateKineticNavigation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      // 1. Shape Hover
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");
      
      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;
        
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
             if (shapesContainer) {
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
        
        // Safety: attach cleanup directly to the DOM element for the effect's lifetime
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
        const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
        const menu = containerRef.current!.querySelector(".menu-content");
        const overlay = containerRef.current!.querySelector(".overlay");
        const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
        const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
        const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");
        
        const menuButton = containerRef.current!.querySelector(".nav-close-btn");
        const menuButtonTexts = menuButton?.querySelectorAll("p");
        const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

        if (!navWrap || !menu || !overlay) return;

        const tl = gsap.timeline();
        
        if (isMenuOpen) {
            navWrap.setAttribute("data-nav", "open");
            
            tl.set(navWrap, { display: "block" })
              .set(menu, { xPercent: 0 }, "<");
            
            if (menuButtonTexts && menuButtonTexts.length) {
              tl.fromTo(menuButtonTexts as any, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 }, "<");
            }
            if (menuButtonIcon) {
              tl.fromTo(menuButtonIcon as any, { rotate: 0 }, { rotate: 315 }, "<");
            }
              
            tl.fromTo(overlay as any, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "<")
              .fromTo(bgPanels as any, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.6 }, "<")
              .fromTo(menuLinks as any, 
                { yPercent: 140, skewY: 7 }, 
                { yPercent: 0, skewY: 0, stagger: 0.05, duration: 0.8, ease: "main" }, 
                "<+=0.35"
              );
              
            if (fadeTargets.length) {
                tl.fromTo(fadeTargets as any, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" }, "<+=0.2");
            }

        } else {
            navWrap.setAttribute("data-nav", "closed");

            tl.to(overlay as any, { autoAlpha: 0, duration: 0.4 })
              .to(menu as any, { xPercent: 120, duration: 0.5, ease: "power2.inOut" }, "<");
              
            if (menuButtonTexts && menuButtonTexts.length) {
              tl.to(menuButtonTexts as any, { yPercent: 0, duration: 0.5 }, "<");
            }
            if (menuButtonIcon) {
              tl.to(menuButtonIcon as any, { rotate: 0, duration: 0.5 }, "<");
            }
            
            tl.set(navWrap, { display: "none" });
        }

      }, containerRef);
      
      return () => ctx.revert();
  }, [isMenuOpen]);

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
    <div ref={containerRef} className="relative">
        <div className="site-header-wrapper">
          <header className="header">
            <div className="container w-full">
              <nav className="nav-row">
                <Link href="/" aria-label="home" className="nav-logo-row flex items-center justify-center h-15 md:h-20 bg-none border-none overflow-visible" onClick={closeMenu} style={{ pointerEvents: 'auto' }}>
                   <Image 
                     src="/SS Logo_white Text clean.png" 
                     alt="Sustainable Sundays Logo" 
                     width={270}
                     height={85}
                     priority
                     className="h-full w-auto object-contain"
                   />
                </Link>
                <div className="nav-row__right">
                  <button role="button" aria-label="Toggle Menu" className="nav-close-btn flex items-center gap-4" onClick={toggleMenu} style={{ pointerEvents: 'auto' }}>
                    <div className="menu-button-text relative h-[1.2rem] overflow-hidden text-right flex flex-col items-end">
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold leading-[1.2rem]">Menu</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold leading-[1.2rem]">Close</p>
                    </div>
                    <div className="icon-wrap">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="menu-button-icon"
                      >
                        <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                        <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                        <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>
                        <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>
                        <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>
                        <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </header>
        </div>

      <section 
        className="fullscreen-menu-container"
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(26,43,75,0.15)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(26,43,75,0.12)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(236,72,153,0.1)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(26,43,75,0.15)" />
                </svg>

                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(26,43,75,0.2)" strokeWidth="60" fill="none" />
                  <path className="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(26,43,75,0.15)" strokeWidth="40" fill="none" />
                </svg>

                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(26,43,75,0.3)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(26,43,75,0.3)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(236,72,153,0.3)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(26,43,75,0.3)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(26,43,75,0.25)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(236,72,153,0.25)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(26,43,75,0.25)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(236,72,153,0.3)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(26,43,75,0.3)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(26,43,75,0.3)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(236,72,153,0.3)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(26,43,75,0.3)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(26,43,75,0.3)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(236,72,153,0.3)" />
                </svg>

                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(26,43,75,0.12)" />
                  <path className="shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(236,72,153,0.1)" />
                </svg>

                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(26,43,75,0.15)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(26,43,75,0.12)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(236,72,153,0.1)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {[
                  { label: "About us", href: "/about", shape: "1" },
                  { label: "Our work", href: "#", shape: "2" },
                  { label: "Events", href: "/events", shape: "3" },
                  { label: "Blog", href: "/blog", shape: "4", fade: true },
                  { label: "Contact us", href: "/contact", shape: "5" }
                ].map((item) => (
                  <li key={item.label} className="menu-list-item" data-shape={item.shape}>
                    <Link href={item.href} onClick={closeMenu} className="nav-link inline-block">
                      <p className="nav-link-text" data-menu-fade={item.fade ? "" : undefined}>{item.label}</p>
                      <div className="nav-link-hover-bg"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
