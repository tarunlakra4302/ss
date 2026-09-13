"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/navigation/navbar'
import { DarkModeHeader } from '@/features/zero-waste-archive/dark-mode-header'
import { DirectorySection } from '@/features/zero-waste-archive/directory-section'

export default function ZeroWasteArchivePage() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  return (
    <main className="min-h-screen bg-[#F7F6F2] selection:bg-[#E84333] selection:text-white text-[#111111] overflow-x-hidden">
      <Navbar hideLogo hideMenuText />
      <DarkModeHeader
        activeCategory={category}
        onCategorySelect={setCategory}
        search={search}
        onSearchChange={setSearch}
      />
      <DirectorySection
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />
    </main>
  )
}
