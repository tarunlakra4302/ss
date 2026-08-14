"use client";
import { Navbar } from '@/components/navigation/navbar'
import { SectionContainer } from '@/components/layout/section-container'
import { motion } from 'framer-motion'
import { EventCalendar } from '@/features/event/event-calendar'
import { EventsCardsSection } from '@/features/homepage/events-section'

const EventsPage = () => {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full mt-20">
      <SectionContainer className="min-h-[60vh] flex items-center justify-center bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center space-y-8 relative z-20"
        >
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black whitespace-nowrap">
              Upcoming Events
            </h1>
          </div>
          
          <p className="max-w-[700px] text-xl md:text-2xl text-black/70 font-medium leading-relaxed tracking-tight">
            Real change happens offline. Find a local project, roll up your sleeves, and make this weekend count.
          </p>
        </motion.div>
      </SectionContainer>
      <EventsCardsSection showHeader={false} />
      <EventCalendar />
    </main>
    </>
  )
}

export default EventsPage
