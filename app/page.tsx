"use client";
import { SectionContainer } from '@/components/layout/section-container'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react';
import { TopBanner } from '@/components/ui/top-banner'
import { Hero } from '@/features/homepage/hero'
import { Navbar } from '@/components/navigation/navbar'
import TextAnimation1 from '@/components/TextAnimation1'
import { ZeroWasteCTA } from '@/features/homepage/zero-waste-cta'
import { NewsletterSection } from '@/features/homepage/newsletter-section'
import { RelatedArticlesSection } from '@/features/homepage/related-articles'
import HeroSection from '@/components/HeroSection'
import { EventsCardsSection } from '@/features/homepage/events-section'
import DonationBox from '@/components/donation-box'
import FlowArtDefaultDemo from '@/components/ui/story-scroll-demo'
import { dummyArticles } from '@/lib/data/landing-data';
  
const page = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const donationSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: mounted ? donationSectionRef : undefined,
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
    <>
      <TopBanner />
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        
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
                className="p-8 rounded-3xl border border-neutral-100 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-neutral-500 leading-relaxed mb-0">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
        <FlowArtDefaultDemo />
        <SectionContainer 
          id="donation-section"
          ref={donationSectionRef}
          data-theme="dark"
          className="bg-[oklch(0.2_0.08_240)] text-white py-32 md:py-48 overflow-hidden relative z-10"
        >
          <div className="flex flex-col items-center gap-16">
            <motion.div
              style={{ y: titleY }}
              initial={{ opacity: 0 }}
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

        <section className='about min-h-[60vh] flex items-center justify-center bg-background relative py-24'>
          <div className="container mx-auto px-6 md:px-12">
            <TextAnimation1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.15] text-center max-w-5xl mx-auto text-neutral-900 antialiased">
                We partner with local communities, businesses, and individuals to create a tangible impact on Bangalore&apos;s environmental future through collective action and sustainable rituals.
              </h2>
            </TextAnimation1>
          </div>
        </section>
        
        <ZeroWasteCTA />

        <NewsletterSection  />
      </main>
    </>
  )
}

export default page