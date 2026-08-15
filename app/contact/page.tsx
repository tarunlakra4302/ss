"use client";

import { ContactHero } from "@/features/contact/contact-hero"
import { ContactForm } from "@/features/contact/contact-form"
import { Navbar } from "@/components/navigation/navbar";

const ContactPage = () => {
  return (
    <div className="bg-background min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-8 md:pt-28 lg:pt-28 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24 xl:gap-32 relative max-w-7xl mx-auto w-full flex-1 items-start lg:items-center justify-between">
        <ContactHero />
        <ContactForm />
      </div>
    </div>
  )
}

export default ContactPage