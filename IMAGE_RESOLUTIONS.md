# 📸 Website Image Dimensions & Asset Resolution Guide

This document contains a comprehensive breakdown of every image container, placeholder, aspect ratio, and recommended production resolution across the **Sustainable Sundays** website.

---

## 🧭 1. Global & Navigation

| Location / Element | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Format | Code Reference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Site Logo** (Navbar) | **Desktop:** `h-20` (max-w: `320px`)<br>**Mobile:** `h-12` to `h-14` (max-w: `210px`) | ~`3.2 : 1` | **640 × 200 px** (@2x Retina) | PNG (Transparent) / SVG | [`components/navigation/navbar.tsx`](file:///c:/Personal/bangalore/sustainable/components/navigation/navbar.tsx) |
| **Initial Preloader Image Stack** | **Desktop:** `400 × 300 px`<br>**Mobile:** `280 × 210 px` | `4 : 3` | **800 × 600 px** | WebP / JPEG | [`components/ui/layout-preloader.css`](file:///c:/Personal/bangalore/sustainable/components/ui/layout-preloader.css) |

---

## 🏠 2. Homepage (`/`)

| Section / Component | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Code Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Parallax Hero Gallery Columns** (Desktop) | `w-1/4` (min-w: `250px`), `h-full` per item in `175vh` container | ~`3 : 4` to `4 : 5` | **800 × 1000 px** | [`components/HeroSection.tsx`](file:///c:/Personal/bangalore/sustainable/components/HeroSection.tsx) |
| **Sticky Scroll Parallax Cards** (Mobile) | **Mobile:** `300 × 700 px`<br>**Tablet/Desktop:** `400 × 600 px` | ~`3 : 2` (variable) | **1200 × 800 px** | [`components/ui/scroll-cards.tsx`](file:///c:/Personal/bangalore/sustainable/components/ui/scroll-cards.tsx) |
| **Scroll Animation Multi-Column Grid** | `w-full` flex columns in `h-dvh` container | `4 : 2.5` (`16 : 10`) | **1280 × 800 px** | [`features/homepage/scroll-animation-demo.tsx`](file:///c:/Personal/bangalore/sustainable/features/homepage/scroll-animation-demo.tsx) |
| **3D Upcoming Event Card** | `w-full`, `h-48` (Mobile) / `h-60` (Desktop: `480 × 240 px`) | `2 : 1` | **1200 × 600 px** | [`features/homepage/3d-card-demo.tsx`](file:///c:/Personal/bangalore/sustainable/features/homepage/3d-card-demo.tsx) |
| **Scroll Morph Arc Cards** | `60 × 85 px` per floating card | `1 : 1.41` | **300 × 425 px** | [`features/homepage/scroll-morph-hero.tsx`](file:///c:/Personal/bangalore/sustainable/features/homepage/scroll-morph-hero.tsx) |
| **Newsletter Banner Background** | Full-width container `px-4 py-10` to `px-12 py-20` (max-w: `1280px`) | ~`16 : 9` | **1920 × 1080 px** | [`features/homepage/newsletter-section.tsx`](file:///c:/Personal/bangalore/sustainable/features/homepage/newsletter-section.tsx) |

---

## 🎟️ 3. Events (`/events` & `/events/[slug]`)

| Section / Component | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Code Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Event Detail Hero Banner** | Max-w: `1024px` (`5xl`), `aspect-[21/9]` | `21 : 9` (Ultrawide) | **2100 × 900 px** | [`features/event/event-detail.tsx`](file:///c:/Personal/bangalore/sustainable/features/event/event-detail.tsx) |
| **Event Grid Cards** | `w-full`, `h-48` to `h-60` inside 3D Card body | `2 : 1` / `16 : 9` | **1200 × 675 px** | [`features/homepage/events-section.tsx`](file:///c:/Personal/bangalore/sustainable/features/homepage/events-section.tsx) |

---

## 🌿 4. About Us (`/about`)

| Section / Component | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Code Reference |
| :--- | :--- | :--- | :--- | :--- |
| **3D WebGL Infinite Gallery (`Our Journey`)** | Rendered onto 3D planes dynamically scaled to maintain source ratio | `3 : 2` or `4 : 3` | **1200 × 800 px** | [`features/about/about-journey.tsx`](file:///c:/Personal/bangalore/sustainable/features/about/about-journey.tsx) |
| **Meet Our Team (Hover Expand Cards)** | **Collapsed:** `5rem (80px) × 24rem (384px)`<br>**Expanded:** `24rem (384px) × 24rem (384px)` | `1 : 1` (Square) | **800 × 800 px** | [`components/ui/hover-expand.tsx`](file:///c:/Personal/bangalore/sustainable/components/ui/hover-expand.tsx) |

---

## 🤝 5. Become a Volunteer (`/become-a-volunteer`)

| Section / Component | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Code Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Volunteering Hero Banner** | Max-w: `1024px` (`5xl`), `aspect-[16/9]` | `16 : 9` (Widescreen) | **1600 × 900 px** | [`app/become-a-volunteer/page.tsx`](file:///c:/Personal/bangalore/sustainable/app/become-a-volunteer/page.tsx) |
| **General Volunteers Split Section** | `aspect-[4/3]` (Mobile) / `aspect-[4/5]` (Desktop) | `4 : 5` (Portrait) | **800 × 1000 px** | [`app/become-a-volunteer/page.tsx`](file:///c:/Personal/bangalore/sustainable/app/become-a-volunteer/page.tsx) |

---

## ♻️ 6. Zero Waste Directory & Hub (`/zero-waste-hub`)

| Section / Component | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Code Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Archive Hero Background** | `h-[130%]` parallax full viewport bleed | `16 : 9` (Landscape) | **2000 × 1125 px** | [`features/zero-waste-archive/archive-hero.tsx`](file:///c:/Personal/bangalore/sustainable/features/zero-waste-archive/archive-hero.tsx) |

---

## 📰 7. Blog (`/blog` & `/blog/[slug]`)

| Section / Component | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Code Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Blog Index Card Thumbnail** | `aspect-[16/9]` in 5-column span layout | `16 : 9` | **1280 × 720 px** | [`components/blog8.tsx`](file:///c:/Personal/bangalore/sustainable/components/blog8.tsx) |
| **Single Post Featured Hero Image** | Full content width, `aspect-[16/9]` | `16 : 9` | **1920 × 1080 px** | [`app/blog/[slug]/page.tsx`](file:///c:/Personal/bangalore/sustainable/app/blog/[slug]/page.tsx) |
| **In-Article Illustration Figure** | Max-w: `448px` (`max-w-md`), `h-auto` | ~`4 : 3` | **800 × 600 px** | [`app/blog/[slug]/page.tsx`](file:///c:/Personal/bangalore/sustainable/app/blog/[slug]/page.tsx) |

---

## 🎨 8. Interactive Story & UI Components

| Section / Component | Rendered Container Size | Aspect Ratio | Recommended Asset Size | Code Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Story Scroll Cards (`FlowArt`)** | `340px–380px` width, `460px–520px` height | `3 : 4` (Portrait) | **1200 × 1600 px** | [`components/ui/story-scroll-demo.tsx`](file:///c:/Personal/bangalore/sustainable/components/ui/story-scroll-demo.tsx) |
| **Article Card Grid** | `aspect-[3/4]`, `h-[520px]` (Mobile) / `h-[560px]` (Desktop) | `3 : 4` (Portrait) | **1200 × 1600 px** | [`components/ui/card-grid.tsx`](file:///c:/Personal/bangalore/sustainable/components/ui/card-grid.tsx) |
| **Direction-Aware Hover Card** | Full container width/height | `1 : 1` (Square) | **1000 × 1000 px** | [`components/ui/direction-aware-hover.tsx`](file:///c:/Personal/bangalore/sustainable/components/ui/direction-aware-hover.tsx) |

---

## ⚡ Summary of Standard Dimensions

For quick asset production, design assets against these 5 standardized aspect ratios:

1. **Ultrawide Hero (21:9):** `2100 × 900 px`
2. **Widescreen Banner / Blog / News (16:9):** `1920 × 1080 px`
3. **Portrait Cards & Stories (3:4 or 4:5):** `1200 × 1600 px` / `800 × 1000 px`
4. **Standard Landscape Grid (3:2 or 4:3):** `1200 × 800 px` / `800 × 600 px`
5. **Square Badges & Team (1:1):** `800 × 800 px`
