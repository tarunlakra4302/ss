# 🔤 Typography & Fonts Reference

This document lists all typography and font families used across the **Sustainable Sundays** website codebase, including their sources, weights, loading mechanisms, CSS variable mappings, and component usage.

---

## 📊 Summary Table

| Font Family | Classification | Source / Provider | Weights Loaded | Primary Usage Area |
| :--- | :--- | :--- | :--- | :--- |
| **Nohemi** | Sans-Serif / Display | [Fontshare CDN (jsDelivr)](https://www.fontshare.com/fonts/nohemi) | `400`, `500`, `600`, `700`, `800`, `900` | Global default typeface (Body, Headings, Nav, Hero, Buttons) |
| **Inter** | Sans-Serif | [Google Fonts](https://fonts.google.com/specimen/Inter) via `next/font/google` | Variable (`latin` subset) | Intro preloader text (`SU` / `ND`) & fallback font |
| **Playfair Display** | Serif (Editorial) | [Google Fonts](https://fonts.google.com/specimen/Playfair+Display) via `next/font/google` | `700` (Bold) | Ticket sidebar event headline |
| **DM Sans** | Geometric Sans-Serif | [Google Fonts](https://fonts.google.com/specimen/DM+Sans) via `next/font/google` | `400`, `500`, `600`, `700` | Ticket sidebar modal & checkout form |
| **System Monospace** | Monospace Stack | System UI (`ui-monospace`, `SFMono-Regular`, `Roboto Mono`, `monospace`) | System default | Monospace utility (`font-mono`, `--font-mono`) |

---

## 🔍 Detailed Font Breakdown

### 1. Nohemi (Primary Brand Typeface)
* **Font Type:** Geometric / Neo-Grotesque Display Sans-Serif
* **Distributor:** Fontshare (Indian Type Foundry) via CDN
* **Import URL:**
  ```html
  https://cdn.jsdelivr.net/font-share/v2/css?f[]=nohemi@400,500,600,700,800,900&display=swap
  ```
* **Weights Available:**
  * `400` — Regular
  * `500` — Medium
  * `600` — SemiBold
  * `700` — Bold
  * `800` — ExtraBold
  * `900` — Black
* **Implementation Locations:**
  * **[app/layout.tsx](file:///c:/Personal/bangalore/sustainable/app/layout.tsx#L36):**
    Preloaded/imported in the `<head>` tag:
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/font-share/v2/css?f[]=nohemi@400,500,600,700,800,900&display=swap" />
    ```
  * **[app/globals.css](file:///c:/Personal/bangalore/sustainable/app/globals.css#L1):**
    Imported at the top of the global stylesheet:
    ```css
    @import url('https://cdn.jsdelivr.net/font-share/v2/css?f[]=nohemi@400,500,600,700,800,900&display=swap');
    ```
  * **Global Body Enforcement ([app/globals.css](file:///c:/Personal/bangalore/sustainable/app/globals.css#L125)):**
    ```css
    body {
      font-family: "Nohemi", sans-serif !important;
    }
    ```
  * **Tailwind CSS v4 Variables ([app/globals.css](file:///c:/Personal/bangalore/sustainable/app/globals.css#L40-L108)):**
    * `--font-sans: "Nohemi", var(--font-inter), sans-serif;`
    * `--font-heading: "Nohemi", var(--font-inter), sans-serif;`
    * `--font-serif: "Nohemi", sans-serif;`
    * `--font-sora: "Nohemi", sans-serif;`
* **Usage:**
  Default typeface for the whole website, including the homepage, navigation bar, hero headers, impact statistics, story sections, initiative cards, event listings, blog articles, and footer.

---

### 2. Inter (Fallback & Preloader Typeface)
* **Font Type:** Neo-Grotesque Sans-Serif
* **Provider:** Google Fonts via Next.js Font Optimization (`next/font/google`)
* **Subsets:** `latin`
* **Implementation Locations:**
  * **[app/layout.tsx](file:///c:/Personal/bangalore/sustainable/app/layout.tsx#L2-L13):**
    ```tsx
    import { Inter } from "next/font/google";

    const inter = Inter({
      variable: "--font-inter",
      subsets: ["latin"],
    });
    ```
    Mounted onto the root `<html>` element as `${inter.variable}`.
  * **[components/ui/layout-preloader.css](file:///c:/Personal/bangalore/sustainable/components/ui/layout-preloader.css#L80):**
    ```css
    .text-element {
      font-family: var(--font-inter), system-ui, sans-serif;
    }
    ```
* **Usage:**
  * Animated preloader screen overlay (displays `SU` on the left and `ND` on the right during initial page load).
  * Fallback font in CSS variables `--font-sans` and `--font-heading` while external fonts load.

---

### 3. Playfair Display (Event Card Editorial Serif)
* **Font Type:** Transitional Serif / High-contrast Editorial Display
* **Provider:** Google Fonts via `next/font/google`
* **Weights:** `700` (Bold)
* **Subsets:** `latin`
* **Implementation Locations:**
  * **[components/tickets/TicketSidebarCard.tsx](file:///c:/Personal/bangalore/sustainable/components/tickets/TicketSidebarCard.tsx#L5-L7):**
    ```tsx
    import { Playfair_Display } from "next/font/google";

    const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
    ```
  * **Component Header Element ([components/tickets/TicketSidebarCard.tsx](file:///c:/Personal/bangalore/sustainable/components/tickets/TicketSidebarCard.tsx#L124)):**
    ```tsx
    <h2 className={`${playfair.className} text-[22px] font-bold text-[#1C1C1C] leading-[1.3]`}>
      Sustainable Sundays x ASRT Foundation: Fundraising Party at ASTRO 2026
    </h2>
    ```
* **Usage:**
  Serves as the headline typography for the fundraising event ticket card.

---

### 4. DM Sans (Event Card UI Typeface)
* **Font Type:** Geometric Sans-Serif designed for high legibility
* **Provider:** Google Fonts via `next/font/google`
* **Weights:** `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
* **Subsets:** `latin`
* **Implementation Locations:**
  * **[components/tickets/TicketSidebarCard.tsx](file:///c:/Personal/bangalore/sustainable/components/tickets/TicketSidebarCard.tsx#L5-L11):**
    ```tsx
    import { DM_Sans } from "next/font/google";

    const dmSans = DM_Sans({
      subsets: ["latin"],
      weight: ["400", "500", "600", "700"],
    });
    ```
  * **Card Container ([components/tickets/TicketSidebarCard.tsx](file:///c:/Personal/bangalore/sustainable/components/tickets/TicketSidebarCard.tsx#L112)):**
    ```tsx
    <motion.div
      layout
      className={`bg-white rounded-2xl p-6 w-full md:w-[360px] overflow-hidden ${dmSans.className}`}
    >
    ```
* **Usage:**
  Applied to the entire Ticket Sidebar component encompassing admission pricing, ticket counters, date/time chips, and registration forms.

---

### 5. Monospace Stack
* **Font Type:** Monospaced system font stack
* **Stack Value:** `ui-monospace, SFMono-Regular, Roboto Mono, monospace`
* **CSS Variable:** `--font-mono`
* **Implementation Locations:**
  * **[app/globals.css](file:///c:/Personal/bangalore/sustainable/app/globals.css#L41):**
    ```css
    --font-mono: ui-monospace, SFMono-Regular, Roboto Mono, monospace;
    ```
* **Usage:**
  Tailwind `font-mono` utility for code blocks, receipt print styles, and fixed-width numbering:
  * **[components/ReceiptPrinter.tsx](file:///c:/Personal/bangalore/sustainable/components/ReceiptPrinter.tsx#L321):** Receipt ticket body and printable slip.
  * **[components/EventSuccessView.tsx](file:///c:/Personal/bangalore/sustainable/components/EventSuccessView.tsx#L154):** Booking confirmation, timestamps, and transaction metadata.
  * **[features/zero-waste-archive/directory-card.tsx](file:///c:/Personal/bangalore/sustainable/features/zero-waste-archive/directory-card.tsx#L49):** Digital access links and file reference numbers.
