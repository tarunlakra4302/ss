"use client"

import { Navbar } from '@/components/navigation/navbar'
import { ArchiveHero } from '@/features/zero-waste-archive/archive-hero'
import { DirectorySection } from '@/features/zero-waste-archive/directory-section'
import Link from 'next/link'

export default function ZeroWasteArchivePage() {
  return (
    <main className="min-h-screen bg-[#F7F6F2] selection:bg-[#E84333] selection:text-white text-[#111111] overflow-x-hidden">
      <Navbar />
      <ArchiveHero />
      <DirectorySection />
    </main>
  )
}
