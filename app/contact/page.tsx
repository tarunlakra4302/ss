"use client";

import { ContactHero } from "@/features/contact/contact-hero"
import { ContactForm } from "@/features/contact/contact-form"
import { Navbar } from "@/components/navigation/navbar";

const ContactPage = () => {
  return (
    <div className="bg-background min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-8 md:pt-28 lg:pt-28 md:pb-12 px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-8 relative max-w-7xl mx-auto w-full flex-1 items-start lg:items-center">
        <ContactHero />
        <ContactForm />
      </div>
    </div>
  )
}

export default ContactPage