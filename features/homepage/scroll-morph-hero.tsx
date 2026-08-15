"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue, useScroll, MotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    introPhase: AnimationPhase;
    scatterPositions: { x: number; y: number; rotation: number; scale: number; opacity: number }[];
    containerSize: { width: number; height: number };
    smoothMorph: MotionValue<number>;
    smoothScrollRotate: MotionValue<number>;
    smoothMouseX: MotionValue<number>;
}

// --- FlipCard Component ---
const IMG_WIDTH = "60px";  
const IMG_HEIGHT = "85px"; 
const TOTAL_IMAGES = 20;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

function FlipCard({
    src,
    index,
    introPhase,
    scatterPositions,
    containerSize,
    smoothMorph,
    smoothScrollRotate,
    smoothMouseX,
}: FlipCardProps) {
    // 1. Calculate static positions based on container size (only updates on resize)
    const positions = useMemo(() => {
        if (containerSize.width === 0) return null;

        // Intro Line Position
        const lineSpacing = 70;
        const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
        const lineX = index * lineSpacing - lineTotalWidth / 2;
        const linePos = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };

        // Circle Position
        const isMobile = containerSize.width < 768;
        const minDimension = Math.min(containerSize.width, containerSize.height);
        const circleRadius = Math.min(minDimension * 0.35, 350);
        const circleAngle = (index / TOTAL_IMAGES) * 360;
        const circleRad = (circleAngle * Math.PI) / 180;
        const circlePos = {
            x: Math.cos(circleRad) * circleRadius,
            y: Math.sin(circleRad) * circleRadius,
            rotation: circleAngle + 90,
        };

        // Bottom Arc Position
        const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
        const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
        const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
        const arcCenterY = arcApexY + arcRadius;
        const spreadAngle = isMobile ? 100 : 130;
        const startAngle = -90 - (spreadAngle / 2);
        const step = spreadAngle / (TOTAL_IMAGES - 1);
        const arcScale = isMobile ? 1.4 : 1.8;

        return { linePos, circlePos, arcPosBase: { arcRadius, arcCenterY, startAngle, step, arcScale } };
    }, [containerSize, index]);

    // 2. Drive dynamic transformation via useTransform
    const x = useTransform([smoothMorph, smoothScrollRotate, smoothMouseX], ([m, r, p]: number[]) => {
        if (!positions || introPhase === "scatter") return scatterPositions[index].x;
        if (introPhase === "line") return positions.linePos.x;

        const { circlePos, arcPosBase } = positions;
        const scrollProgress = Math.min(Math.max(r / 360, 0), 1);
        const maxRotation = (positions.arcPosBase.step * (TOTAL_IMAGES - 1)) * 0.8;
        const boundedRotation = -scrollProgress * maxRotation;
        const currentArcAngle = arcPosBase.startAngle + (index * arcPosBase.step) + boundedRotation;
        const arcRad = (currentArcAngle * Math.PI) / 180;
        const arcX = Math.cos(arcRad) * arcPosBase.arcRadius + p;

        return lerp(circlePos.x, arcX, m);
    });

    const y = useTransform([smoothMorph, smoothScrollRotate], ([m, r]: number[]) => {
        if (!positions || introPhase === "scatter") return scatterPositions[index].y;
        if (introPhase === "line") return positions.linePos.y;

        const { circlePos, arcPosBase } = positions;
        const scrollProgress = Math.min(Math.max(r / 360, 0), 1);
        const maxRotation = (positions.arcPosBase.step * (TOTAL_IMAGES - 1)) * 0.8;
        const boundedRotation = -scrollProgress * maxRotation;
        const currentArcAngle = arcPosBase.startAngle + (index * arcPosBase.step) + boundedRotation;
        const arcRad = (currentArcAngle * Math.PI) / 180;
        const arcY = Math.sin(arcRad) * arcPosBase.arcRadius + arcPosBase.arcCenterY;

        return lerp(circlePos.y, arcY, m);
    });

    const rotation = useTransform([smoothMorph, smoothScrollRotate], ([m, r]: number[]) => {
        if (!positions || introPhase === "scatter") return scatterPositions[index].rotation;
        if (introPhase === "line") return positions.linePos.rotation;

        const { circlePos, arcPosBase } = positions;
        const scrollProgress = Math.min(Math.max(r / 360, 0), 1);
        const maxRotation = (positions.arcPosBase.step * (TOTAL_IMAGES - 1)) * 0.8;
        const boundedRotation = -scrollProgress * maxRotation;
        const currentArcAngle = arcPosBase.startAngle + (index * arcPosBase.step) + boundedRotation;
        const arcRotation = currentArcAngle + 90;

        return lerp(circlePos.rotation, arcRotation, m);
    });

    const scale = useTransform(smoothMorph, (m) => {
        if (!positions || introPhase === "scatter") return scatterPositions[index].scale;
        if (introPhase === "line") return positions.linePos.scale;
        return lerp(1, positions.arcPosBase.arcScale, m);
    });

    const opacity = useTransform(smoothMorph, (m) => {
        if (introPhase === "scatter") return scatterPositions[index].opacity;
        return 1;
    });

    return (
        <motion.div
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                x,
                y,
                rotate: rotation,
                scale,
                opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}
            className="cursor-pointer group will-change-transform"
        >
            <div className="relative h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={`hero-${index}`}
                    className="h-full w-full object-cover"
                />
            </div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const IMAGES = [
    "/ss%20preloader%20images/1.jpeg",
    "/ss%20preloader%20images/2.jpeg",
    "/ss%20preloader%20images/3.jpeg",
    "/ss%20preloader%20images/4.jpeg",
    "/ss%20preloader%20images/5.jpeg",
    "/ss%20preloader%20images/1.jpeg",
    "/ss%20preloader%20images/2.jpeg",
    "/ss%20preloader%20images/3.jpeg",
    "/ss%20preloader%20images/4.jpeg",
    "/ss%20preloader%20images/5.jpeg",
    "/ss%20preloader%20images/1.jpeg",
    "/ss%20preloader%20images/2.jpeg",
    "/ss%20preloader%20images/3.jpeg",
    "/ss%20preloader%20images/4.jpeg",
    "/ss%20preloader%20images/5.jpeg",
    "/ss%20preloader%20images/1.jpeg",
    "/ss%20preloader%20images/2.jpeg",
    "/ss%20preloader%20images/3.jpeg",
    "/ss%20preloader%20images/4.jpeg",
    "/ss%20preloader%20images/5.jpeg",
];

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!stickyRef.current) return;
        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };
        const observer = new ResizeObserver(handleResize);
        observer.observe(stickyRef.current);
        setContainerSize({
            width: stickyRef.current.offsetWidth,
            height: stickyRef.current.offsetHeight,
        });
        return () => observer.disconnect();
    }, []);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // --- Scroll Logic ---
    const { scrollYProgress } = useScroll({
        target: mounted ? containerRef : undefined,
        offset: ["start start", "end end"],
    });

    const morphProgress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    const scrollRotate = useTransform(scrollYProgress, [0.2, 1], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = stickyRef.current;
        if (!container) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const scatterPositions = useMemo(() => {
        return IMAGES.map((_, i) => {
            // Use deterministic pseudo-random values based on index to avoid hydration mismatch
            const seedX = (i * 137) % 1500;
            const seedY = (i * 263) % 1000;
            const seedRotate = (i * 47) % 180;
            
            return {
                x: seedX - 750,
                y: seedY - 500,
                rotation: seedRotate - 90,
                scale: 0.6,
                opacity: 0,
            };
        });
    }, []);

    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    // Track morph value ONLY for the intro text fade-out
    const [textMorphValue, setTextMorphValue] = useState(0);
    useEffect(() => {
        return smoothMorph.on("change", (v) => setTextMorphValue(v));
    }, [smoothMorph]);

    return (
        <div ref={containerRef} className="relative w-full h-[400vh] bg-white">
            <div ref={stickyRef} className="sticky top-0 flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden">
                
                {/* Intro Text (Fades out) */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-4 sm:px-6 lg:px-12 w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={introPhase === "circle" && textMorphValue < 0.5 ? { opacity: 1 - textMorphValue * 2, y: 0 } : { opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="text-lg sm:text-xl lg:text-3xl font-medium tracking-tight text-gray-800"
                        style={{ willChange: "transform, opacity" }}
                    >
                        The future is built on us.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && textMorphValue < 0.5 ? { opacity: 0.5 - textMorphValue } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-4 text-xs font-bold tracking-[0.2em] text-gray-500"
                    >
                        SCROLL TO EXPLORE
                    </motion.p>
                </div>

                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-1/2 -translate-y-1/2 md:top-[10%] md:translate-y-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4 sm:px-6 lg:px-12 w-full"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                        Explore Our Vision
                    </h2>
                    <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-lg leading-relaxed mix-blend-multiply">
                        Scroll through our curated collection of activities designed to shape the future.
                    </p>
                </motion.div>

                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.map((src, i) => (
                        <FlipCard
                            key={i}
                            src={src}
                            index={i}
                            introPhase={introPhase}
                            scatterPositions={scatterPositions}
                            containerSize={containerSize}
                            smoothMorph={smoothMorph}
                            smoothScrollRotate={smoothScrollRotate}
                            smoothMouseX={smoothMouseX}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
