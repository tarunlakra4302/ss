'use client';
import { 
  ContainerScrollAnimation,
  ContainerScrollInsetX,
  ContainerScrollScale,
  ContainerScrollTranslate,
 } from "@/components/ui/scroll-trigger-animations";
import Image from "next/image";

const IMAGES_1 = [
  '/gallery/1.jpeg',
  '/gallery/2.jpeg',
  '/gallery/3.jpeg',
  '/gallery/4.jpeg',
];
const IMAGES_2 = [
  '/gallery/5.jpeg',
  '/gallery/6.jpeg',
  '/gallery/7.jpeg',
  '/gallery/8.jpeg',
];
const IMAGES_3 = [
  '/gallery/9.jpeg',
  '/gallery/1.jpeg',
  '/gallery/2.jpeg',
  '/gallery/3.jpeg',
];

import { SectionContainer } from "@/components/layout/section-container";
import { motion } from "framer-motion";

export function ScrollAnimationDemo() {
  return (
    <>
      <SectionContainer className="mt-20 md:mt-0 min-h-[60vh] flex items-center justify-center bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center space-y-8 relative z-20"
        >
          
          <p className="max-w-none text-xl md:text-2xl text-black/70 font-medium leading-relaxed tracking-tight whitespace-nowrap">
            Here is a sneak peak into our communities redefining conscious living.
          </p>
        </motion.div>
      </SectionContainer>

    <ContainerScrollAnimation className="overflow-hidden">
      <ContainerScrollTranslate className="h-dvh relative">
        <ContainerScrollInsetX className="h-full relative">
          <ContainerScrollScale className="flex bg-neutral-100 gap-4 overflow-hidden px-10 py-20">
            <ContainerScrollTranslate
              yRange={['0%', '-10%']}
              className="flex flex-1 flex-col gap-4"
            >
              {IMAGES_1.map((imageUrl, index) => (
                <div key={index} className="relative aspect-[4/2.5] w-full">
                  <Image
                    src={imageUrl}
                    alt="gallery item"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </ContainerScrollTranslate>

            <ContainerScrollTranslate
              yRange={['0%', '20%']}
              className="flex flex-1 mt-[-20%] relative flex-col gap-4"
            >
              {IMAGES_2.map((imageUrl, index) => (
                <div key={index} className="relative aspect-[4/2.5] w-full">
                  <Image
                    src={imageUrl}
                    alt="gallery item"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </ContainerScrollTranslate>

            <ContainerScrollTranslate
              yRange={['0%', '-10%']}
              className="hidden md:flex flex-1 flex-col gap-4"
            >
              {IMAGES_3.map((imageUrl, index) => (
                <div key={index} className="relative aspect-[4/2.5] w-full">
                  <Image
                    src={imageUrl}
                    alt="gallery item"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </ContainerScrollTranslate>
          </ContainerScrollScale>
        </ContainerScrollInsetX>
      </ContainerScrollTranslate>
    </ContainerScrollAnimation>
    </>
  )
}
