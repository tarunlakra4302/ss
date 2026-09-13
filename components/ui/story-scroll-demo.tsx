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
              className="text-[clamp(4.2rem,13vw,9.5rem)] font-bold leading-[0.85] uppercase tracking-tight"
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
            className="relative w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:w-[360px] lg:w-[380px] h-[390px] xs:h-[430px] sm:h-[470px] md:h-[520px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer group shadow-2xl shrink-0 bg-black"
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
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 z-10 h-12 sm:h-14 rounded-xl sm:rounded-2xl px-4 sm:px-5 flex items-center justify-between bg-white/20 group-hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] overflow-hidden will-change-transform active:scale-[0.98]">
              {/* Shimmer highlight on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              <span className="relative z-10 text-white text-xs sm:text-sm md:text-base font-medium tracking-normal transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0.5">
                Join the initiative
              </span>

              <span className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:bg-white group-hover:text-black group-hover:translate-x-1 shrink-0">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-black transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-rotate-45 stroke-[2]" />
              </span>
            </div>
          </Link>
        </div>
      </FlowSection>

      <FlowSection aria-label="Our Approach" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 my-auto w-full">
          <div>
            <h2
              className="text-[clamp(4.2rem,13vw,9.5rem)] font-bold leading-[0.85] uppercase tracking-tight"
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
            className="relative w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:w-[360px] lg:w-[380px] h-[390px] xs:h-[430px] sm:h-[470px] md:h-[520px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer group shadow-2xl shrink-0"
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
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 z-10 h-12 sm:h-14 rounded-xl sm:rounded-2xl px-4 sm:px-5 flex items-center justify-between bg-white/20 group-hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] overflow-hidden will-change-transform active:scale-[0.98]">
              {/* Shimmer highlight on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              <span className="relative z-10 text-white text-xs sm:text-sm md:text-base font-medium tracking-normal transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0.5">
                Read blog
              </span>

              <span className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:bg-white group-hover:text-black group-hover:translate-x-1 shrink-0">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-black transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-rotate-45 stroke-[2]" />
              </span>
            </div>
          </Link>
        </div>
      </FlowSection>
    </FlowArt>
  );
}

