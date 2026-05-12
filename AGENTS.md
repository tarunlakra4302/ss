# 🧠 agent.md — AI Engineering Guidelines (Project: Next.js + Tailwind + GSAP)

## 🎯 Purpose

This document defines strict rules for any AI agent (Gemini / Antigravity / Copilot) working on this codebase.

Goal:

* Maintain **production-grade quality**
* Avoid **UI regressions**
* Enforce **FAANG-level architecture + motion standards**

---

## 🚫 NON-NEGOTIABLE RULES

### 1. DO NOT BREAK EXISTING UI

* Do NOT change:

  * layout
  * spacing
  * typography
  * colors
* Do NOT replace components unless explicitly asked
* Changes must feel like **enhancement, not redesign**

---

### 2. MINIMAL CHANGES ONLY

* Modify ONLY the required files
* Avoid large rewrites
* Prefer **surgical edits over refactors**

---

### 3. PRESERVE COMPONENT STRUCTURE

* Do NOT merge components into one file
* Do NOT create “god components”
* Maintain modular structure:

  * `/components`
  * `/sections`
  * `/lib`

---

### 4. FOLLOW EXISTING STACK

Mandatory:

* Next.js (App Router)
* React
* Tailwind CSS
* GSAP (for animations)

Do NOT:

* introduce new frameworks
* add unnecessary dependencies

---

## 🎬 ANIMATION STANDARDS (AWWWARDS LEVEL)

### Principles:

* Smooth, intentional motion
* No abrupt transitions
* Use **easing consistently**

### Allowed properties:

* transform
* opacity
* clip-path

### Avoid:

* top / left animations
* layout-triggering properties

---

### GSAP RULES

* Use a **single timeline per feature**
* Store timeline in `useRef`
* Initialize in `useLayoutEffect`

Example:

```js
const tl = useRef();

useLayoutEffect(() => {
  tl.current = gsap.timeline({ paused: true });
}, []);
```

---

### Timing Guidelines

* duration: 0.6s – 1.2s
* stagger: 0.05 – 0.1
* easing:

  * `power4.out`
  * `cubic-bezier(0.77, 0, 0.175, 1)`

---

## 🧩 NAVBAR RULES (CRITICAL)

When modifying navigation:

* DO NOT:

  * change structure
  * replace markup
  * alter responsiveness

* ONLY:

  * inject animation
  * add refs
  * enhance transitions

* Animations must:

  * be reversible
  * use GSAP timeline
  * not cause layout shift

---

## ⚙️ PERFORMANCE RULES

* Use `transform` instead of layout props
* Add:

  ```css
  will-change: transform;
  ```
* Avoid unnecessary re-renders
* Keep animations on GPU

---

## 🧱 CODE QUALITY

### Must:

* Clean, readable code
* Proper naming
* No inline hacks

### Avoid:

* console.logs
* dead code
* duplicate logic

---

## 📁 FILE MODIFICATION RULES

When editing:

* Mention:

  * which file is modified
  * what was added
* Do NOT rewrite entire file unless required

---

## 🧪 TESTING CHECKLIST

Before finishing:

* ✅ UI unchanged (visually same)
* ✅ Animation smooth (60fps)
* ✅ No flicker
* ✅ No layout shift
* ✅ Works on all screen sizes

---

## 🧠 DECISION FRAMEWORK

If unsure:

Ask:

> “Am I enhancing or replacing?”

If replacing → ❌ STOP
If enhancing → ✅ PROCEED

---

## 🏁 FINAL GOAL

The output should feel like:

> “Same UI — but upgraded to premium Awwwards-level experience”

NOT:

> “This looks like a different project”

---

## 🔥 BONUS (HIGH QUALITY TOUCHES)

* Add micro-delays between elements
* Maintain animation rhythm
* Keep transitions consistent across UI

---

## 📌 SUMMARY

* Preserve UI
* Inject animation only
* Use GSAP properly
* Keep performance high
* Write clean, minimal code

---

End of file.
