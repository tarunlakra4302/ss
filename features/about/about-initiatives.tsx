"use client";
import { motion } from "framer-motion";
import { HoverExpand_001 } from "@/components/ui/hover-expand";
import { teamMembers } from "@/lib/data/about-data";

export const AboutInitiatives = () => {
  const formattedImages = teamMembers.map((member) => ({
    src: member.src,
    alt: member.alt,
    code: member.name,
  }));

  return (
    <section id="team" className="py-16 px-4 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex flex-col items-center justify-center gap-8 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 font-medium leading-relaxed">
              Every Sunday, we gather to make a difference. From plogging to beach cleanups, join us in creating a sustainable future for our community.
            </p>
          </div>

          <div className="w-full flex justify-center overflow-x-auto py-4">
            <HoverExpand_001 images={formattedImages} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
