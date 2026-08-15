'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';

export default function FlowArtDefaultDemo() {
  return (
    <FlowArt aria-label="Sustainable Bangalore Story">
      <FlowSection aria-label="Our Story" style={{ backgroundColor: '#064e3b', color: '#ecfdf5' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 my-auto w-full">
          <div>
            <h1
              className="text-[clamp(3.5rem,9vw,11rem)] font-bold leading-[0.85] uppercase tracking-tight"
            >
              Small
              <br />
              Acts.
              <br />
              Big
              <br />
              Impact.
            </h1>
          </div>

          <Link
            href="/become-a-volunteer"
            className="relative w-full max-w-[340px] md:w-[360px] lg:w-[380px] h-[460px] md:h-[520px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer group shadow-2xl shrink-0"
          >
            {/* Full-bleed background image */}
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop"
              alt="Volunteer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Top Gradient Overlay */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

            {/* Card Header Title (Top-Left) */}
            <div className="absolute top-6 left-6 z-10 pr-6">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 mb-2">
                Get Involved
              </span>
              <h3 className="text-white font-semibold text-xl md:text-2xl tracking-tight leading-snug">
                Become a volunteer and work hands-on to restore our planet.
              </h3>
            </div>

            {/* Bottom Glassmorphic CTA Bar */}
            <div className="absolute inset-x-4 bottom-4 z-10 h-14 rounded-xl px-5 flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300">
              <span className="text-white text-sm md:text-base font-normal tracking-normal">
                Join the initiative
              </span>
              <ArrowRight className="w-5 h-5 text-white stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </FlowSection>

      <FlowSection aria-label="Our Approach" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 my-auto w-full">
          <div>
            <h2
              className="text-[clamp(3.5rem,9vw,11rem)] font-bold leading-[0.85] uppercase tracking-tight"
            >
              Learn.
              <br />
              Act.
              <br />
              Sustain.
            </h2>
          </div>

          <Link
            href="/blog"
            className="relative w-full max-w-[340px] md:w-[360px] lg:w-[380px] h-[460px] md:h-[520px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer group shadow-2xl shrink-0"
          >
            {/* Full-bleed background image */}
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
              alt="Sustainable Architecture Innovations"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Top Gradient Overlay */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

            {/* Card Header Title (Top-Left) */}
            <div className="absolute top-6 left-6 z-10 pr-6">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 mb-2">
                Featured Article
              </span>
              <h3 className="text-white font-semibold text-xl md:text-2xl tracking-tight leading-snug">
                Sustainable Architecture Innovations
              </h3>
            </div>

            {/* Bottom Glassmorphic CTA Bar */}
            <div className="absolute inset-x-4 bottom-4 z-10 h-14 rounded-xl px-5 flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300">
              <span className="text-white text-sm md:text-base font-normal tracking-normal">
                Read blog
              </span>
              <ArrowRight className="w-5 h-5 text-white stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </FlowSection>

      <FlowSection aria-label="The Vision" style={{ backgroundColor: '#1e3a8a', color: '#eff6ff' }}>
        <div>
          <h2
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Future
            <br />
            Of
            <br />
            Living
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-blue-400/30" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          We&apos;re building a resilient, eco-conscious Bangalore for present and future generations.
        </p>
        <hr className="my-[2vw] border-none border-t border-blue-400/30" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">50K+</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Active citizens participating in zero-waste and green canopy initiatives.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">120+</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Community cleanup drives completed across Bangalore&apos;s major parks and lakes.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">100%</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Community-driven. Every initiative is powered by local passion and action.
            </p>
          </div>
        </div>
      </FlowSection>
    </FlowArt>
  );
}

