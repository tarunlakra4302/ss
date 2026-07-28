"use client";

import { ContactHero } from "@/features/contact/contact-hero"
import { ContactForm } from "@/features/contact/contact-form"
import { Navbar } from "@/components/navigation/navbar";

const ContactPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8 flex flex-col md:flex-row gap-8 md:gap-4 relative overflow-x-hidden max-w-7xl mx-auto w-full">
        <ContactHero />
        <ContactForm />
      </div>
    </div>
  )
}

export default ContactPage