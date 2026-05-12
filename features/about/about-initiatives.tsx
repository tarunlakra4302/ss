"use client";
import { motion } from "framer-motion";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import { Card } from "@/components/ui/card";

export const AboutInitiatives = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex flex-col md:flex-row gap-8 justify-center items-stretch"
        >
          <DirectionAwareHover
            imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
            className="flex-1 h-96 w-full md:w-auto"
          >
            <p className="font-bold text-xl">Plogging</p>
            <p className="font-normal text-sm">Jogging while picking up litter</p>
          </DirectionAwareHover>
          <Card
            variant="neubrutalism"
            title="Meet Our Team"
            description="Every Sunday, we gather to make a difference. From plogging to beach cleanups, join us in creating a sustainable future for our community."
            className="flex-1 h-96 flex flex-col justify-center"
          />
        </motion.div>
      </div>
    </section>
  );
};
