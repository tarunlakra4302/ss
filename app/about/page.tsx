"use client";
import { Navbar } from '@/components/navigation/navbar'
import { SectionContainer } from '@/components/layout/section-container'
import { motion } from 'framer-motion'
import { StorySection } from '@/features/homepage/story'
import { AboutJourney } from '@/features/about/about-journey'
import { galleryImages, gridCards, timelineData } from '@/lib/data/about-data'
import { AboutInitiatives } from '@/features/about/about-initiatives'
import { Timeline } from '@/components/ui/timeline'


const AboutPage = () => {
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

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black">
              About <br /> <span className="text-black/40">Us</span>
            </h1>
          </div>
          
          <p className="max-w-[700px] text-lg md:text-xl text-black/70 font-medium leading-relaxed tracking-tight">
            A look inside the community redefining conscious living in our own backyards.
          </p>
          
          <div className="flex flex-col items-center gap-2 pt-4">
            <span className="text-xs uppercase tracking-[0.2em] text-black/50 font-bold">Scroll Down</span>
            <span className="text-black/50 animate-bounce">↓</span>
          </div>
        </motion.div>
      </SectionContainer>
            <AboutJourney images={galleryImages} />
      <StorySection />
      <AboutInitiatives />
      
      {/* Redesigned Timeline Section */}
      <Timeline data={timelineData} />

    </main>
    </>
  )
}

export default AboutPage
