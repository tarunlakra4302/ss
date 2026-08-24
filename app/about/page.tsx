"use client";
import { useEffect } from 'react'
import { Navbar } from '@/components/navigation/navbar'
import { SectionContainer } from '@/components/layout/section-container'
import { motion } from 'framer-motion'
import { StorySection } from '@/features/homepage/story'
import { AboutJourney } from '@/features/about/about-journey'
import { galleryImages, gridCards, timelineData } from '@/lib/data/about-data'
import { AboutInitiatives } from '@/features/about/about-initiatives'
import { Timeline } from '@/components/ui/timeline'


const AboutPage = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#team") {
      const el = document.getElementById("team");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full mt-20">
      <SectionContainer className="min-h-[40vh] flex items-center justify-center bg-transparent pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center space-y-8 relative z-20"
        >
          <div className="space-y-4">

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black">
              About Us
            </h1>
          </div>
          
          <p className="max-w-2xl md:max-w-none whitespace-normal md:whitespace-nowrap text-base sm:text-lg md:text-xl text-black/70 font-medium leading-relaxed tracking-tight px-4 text-center">
            Here is a sneak peak into our communities redefining conscious living.
          </p>
        </motion.div>
      </SectionContainer>
      <StorySection />
      <AboutJourney images={galleryImages} />
      <AboutInitiatives />
      
      {/* Redesigned Timeline Section */}
      <Timeline data={timelineData} />

    </main>
    </>
  )
}

export default AboutPage
