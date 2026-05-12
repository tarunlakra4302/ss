"use client";
import {InitialLoader} from '@/features/homepage/initial-loader'
import { SectionContainer } from '@/components/layout/section-container'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { Hero } from '@/features/homepage/hero'
import { Navbar } from '@/components/navigation/navbar'
import TextAnimation1 from '@/components/TextAnimation1'
import dynamic from 'next/dynamic'

// Dynamic imports for heavy sections to speed up preloader hydration
const MissionSection = dynamic(() => import('@/features/homepage/mission').then(mod => mod.MissionSection))
const StorySection = dynamic(() => import('@/features/homepage/story').then(mod => mod.StorySection))
const ZeroWasteCTA = dynamic(() => import('@/features/homepage/zero-waste-cta').then(mod => mod.ZeroWasteCTA))
const NewsletterSection = dynamic(() => import('@/features/homepage/newsletter-section').then(mod => mod.NewsletterSection))
const ScrollMorphSection = dynamic(() => import('@/features/homepage/scroll-morph-section').then(mod => mod.ScrollMorphSection))
const RelatedArticlesSection = dynamic(() => import('@/features/homepage/related-articles').then(mod => mod.RelatedArticlesSection))
const HeroSection = dynamic(() => import('@/components/HeroSection'))
const VideoScrollSection = dynamic(() => import('@/features/homepage/video-scroll-section').then(mod => mod.VideoScrollSection))
const EventsCardsSection = dynamic(() => import('@/features/homepage/events-section').then(mod => mod.EventsCardsSection))
const DonationBox = dynamic(() => import('@/components/donation-box'))
import { dummyArticles } from '@/lib/data/landing-data';
  
const page = () => {
  const [donationSection, setDonationSection] = useState<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: donationSection ? { current: donationSection } : undefined,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const titleY = useTransform(smoothProgress, [0, 1], [-60, 60]);
  const boxY = useTransform(smoothProgress, [0, 1], [-30, 30]);
  const textY = useTransform(smoothProgress, [0, 1], [-15, 15]);

  return (
    <InitialLoader>
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        
<MissionSection />
<StorySection />
<EventsCardsSection />
<HeroSection />
               <SectionContainer className="bg-background">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Low-Impact Living", 
                desc: "Weekly guides to zero-waste, slow fashion, and seasonal eating.",
              },
              { 
                title: "The Sunday Reset", 
                desc: "Curated habits to help you unplug and reconnect with nature.",
              },
              { 
                title: "The Social Circle", 
                desc: "A social space to share wins, trade tips, and find local eco-hubs",
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-neutral-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-neutral-500 leading-relaxed mb-0">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
                <SectionContainer 
                  id="donation-section"
          ref={setDonationSection}
          data-theme="dark"
          className="bg-[oklch(0.2_0.08_240)] text-white py-32 md:py-48 overflow-hidden"
        >
          <div className="flex flex-col items-center gap-16">
            <motion.div
              style={{ y: titleY }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full py-12 px-12 z-20 space-y-4 border border-white/10 rounded-3xl"
            >
              <TextAnimation1>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-center">Support sustainability <br /> where it's needed most.</h3>
              </TextAnimation1>
            </motion.div>

            <motion.div style={{ y: boxY }} className="w-full">
              <DonationBox />
            </motion.div>
            
            <motion.div 
              style={{ y: textY }}
              className="max-w-4xl text-center space-y-8"
            >
              <TextAnimation1>
                <p className="text-2xl md:text-3xl text-neutral-400 font-medium leading-tight">
                  Make a difference.
                </p>
              </TextAnimation1>
            </motion.div>
          </div>
        </SectionContainer>
        <SectionContainer className="bg-white py-24 px-8 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
            {/* Left Column: Heading */}
            <div className="max-w-md">
              <TextAnimation1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-black leading-[1.1]">
                  Change Happens When You Show Up.
                </h1>
              </TextAnimation1>
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col gap-8 text-lg md:text-xl text-black leading-relaxed">
              <TextAnimation1>
                <p>
                  Whether you have a story to tell, an afternoon to spare, or resources to share, you are the engine of this movement.
                </p>
              </TextAnimation1>
              <div className="space-y-6">
                <TextAnimation1>
                  <p>
                    <span className="font-bold">Share Your Voice:</span>{' '}We&apos;re always looking for guest writers for our sustainability blog.
                  </p>
                  <p>
                    <span className="font-bold">Be There:</span>{' '}Your presence at our events is the ultimate show of solidarity.
                  </p>
                  <p>
                    <span className="font-bold">Empower the Mission:</span>{' '}Your donations keep us organized, functional, and growing.
                  </p>
                  <p>
                    <span className="font-bold">Join the Team:</span>{' '}Become a volunteer and work hands-on to restore our planet.
                  </p>
                </TextAnimation1>
              </div>
            </div>
          </div>
        </SectionContainer>
        <ScrollMorphSection />

        <RelatedArticlesSection articles={dummyArticles} />




        <VideoScrollSection />

        <section className='about min-h-[60vh] flex items-center justify-center bg-background relative py-24'>
          <div className="container mx-auto px-6 md:px-12">
            <TextAnimation1>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.15] text-center max-w-5xl mx-auto text-neutral-900 antialiased">
                We partner with local communities, businesses, and individuals to create a tangible impact on Bangalore&apos;s environmental future through collective action and sustainable rituals.
              </h1>
            </TextAnimation1>
          </div>
        </section>
        
        <ZeroWasteCTA />

        <NewsletterSection  />
      </main>
    </InitialLoader>
  )
}

export default page