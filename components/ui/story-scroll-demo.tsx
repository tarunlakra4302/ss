'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';

export default function FlowArtDefaultDemo() {
  return (
    <FlowArt aria-label="Sustainable Bangalore Story">
      <FlowSection aria-label="Our Story" style={{ backgroundColor: '#064e3b', color: '#ecfdf5' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 my-auto w-full">
          <div>
            <h1
              className="text-[clamp(2.25rem,6.5vw,9rem)] font-bold leading-[0.85] uppercase tracking-tight"
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
            className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[340px] md:w-[360px] lg:w-[380px] h-[340px] sm:h-[440px] md:h-[520px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer group shadow-2xl shrink-0 bg-black"
          >
            {/* Full-bleed translucent background image */}
            <img
              src="/images/volunteer/General volunteer.jpeg"
              alt="Volunteer"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
            />

            {/* Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/50 pointer-events-none" />

            {/* Card Header Title (Top-Left) */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pr-4 sm:pr-6">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 mb-2">
                Get Involved
              </span>
              <h3 className="text-white font-semibold text-lg sm:text-xl md:text-2xl tracking-tight leading-snug">
                Become a volunteer and work hands-on to restore our planet.
              </h3>
            </div>

            {/* Bottom Glassmorphic CTA Bar */}
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 z-10 h-12 sm:h-14 rounded-xl px-4 sm:px-5 flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300">
              <span className="text-white text-xs sm:text-sm md:text-base font-normal tracking-normal">
                Join the initiative
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </FlowSection>

      <FlowSection aria-label="Our Approach" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 my-auto w-full">
          <div>
            <h2
              className="text-[clamp(2.25rem,6.5vw,9rem)] font-bold leading-[0.85] uppercase tracking-tight"
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
            className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[340px] md:w-[360px] lg:w-[380px] h-[340px] sm:h-[440px] md:h-[520px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer group shadow-2xl shrink-0"
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
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pr-4 sm:pr-6">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 mb-2">
                Featured Article
              </span>
              <h3 className="text-white font-semibold text-lg sm:text-xl md:text-2xl tracking-tight leading-snug">
                Sustainable Architecture Innovations
              </h3>
            </div>

            {/* Bottom Glassmorphic CTA Bar */}
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 z-10 h-12 sm:h-14 rounded-xl px-4 sm:px-5 flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300">
              <span className="text-white text-xs sm:text-sm md:text-base font-normal tracking-normal">
                Read blog
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </FlowSection>
    </FlowArt>
  );
}

