"use client";

import { HoverExpand_001 } from "@/components/ui/hover-expand";
import { teamMembers } from "@/lib/data/about-data";

export const AboutInitiatives = () => {
  const formattedImages = teamMembers.map((member) => ({
    src: member.src,
    alt: member.alt,
    code: member.name,
  }));

  return (
    <section
      id="team"
      className="relative w-full min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-7rem)] flex items-center justify-center bg-white py-12 md:py-16 px-4 mb-24 md:mb-36 lg:mb-48 scroll-mt-24"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-6 sm:gap-8 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900">
            Meet Our Team
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-medium leading-relaxed">
            Every Sunday, we gather to make a difference. From plogging to beach cleanups, join us in creating a sustainable future for our community.
          </p>
        </div>

        <div className="w-full flex justify-center overflow-x-auto py-2 sm:py-4">
          <HoverExpand_001 images={formattedImages} />
        </div>
      </div>
    </section>
  );
};
