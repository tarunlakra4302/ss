import React from "react";
import { motion } from "framer-motion";
import { ThreeDCardDemo } from "@/features/homepage/3d-card-demo";

const MOCK_EVENTS = [
  {
    title: "Edible Gardening Workshop",
    location: "Pure & Sure Organic Cafe, Jayanagar",
    date: "23 Aug",
    time: "10:00 AM",
    imageUrl: "/edible-gardening-workshop.png",
    linkUrl: "/events/edible-gardening-workshop",
    buttonText: "Register Now"
  },
  {
    title: "Eco-Friendly Workshop",
    location: "Community Center",
    date: "22 May",
    time: "02:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
    linkUrl: "/events/eco-workshop",
    buttonText: "Register"
  },
  {
    title: "Sustainable Market",
    location: "Town Square",
    date: "30 May",
    time: "09:00 AM",
    imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop",
    linkUrl: "/events/sustainable-market",
    buttonText: "Get Tickets"
  }
];

export function EventsCardsSection({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="upcoming-events" className="py-12 px-4 md:px-6 bg-background overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        {showHeader && (
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Get Involved</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">Upcoming Events</h2>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-8 items-center justify-center">
          {MOCK_EVENTS.map((event, index) => (
            <motion.div
              key={index}
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ amount: 0.3, once: true }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
                delay: index * 0.15,
              }}
              className="flex justify-center w-full lg:w-auto"
            >
              <ThreeDCardDemo 
                title={event.title}
                location={event.location}
                date={event.date}
                time={event.time}
                imageUrl={event.imageUrl}
                linkUrl={event.linkUrl}
                buttonText={event.buttonText}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
