"use client"

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { directoryData } from '@/lib/data/archive-data'
import { DirectoryCard } from './directory-card'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu"

export function DirectorySection() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All')

  const filteredItems = useMemo(() => {
    return directoryData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      // Note: Location filtering logic can be added here if item data includes location
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <section className="relative">
      {/* Dark Filter/Search Bar */}
      <div className="w-full bg-[#1A1A1A] text-white flex flex-col lg:flex-row items-stretch border-y border-black min-h-[80px]">
        {/* Block 1 (Category Dropdown) */}
        <div className="flex flex-col justify-center px-6 lg:px-8 py-6 lg:py-0 border-b lg:border-b-0 lg:border-r border-[#333] w-full lg:w-1/4 relative group">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Category</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between w-full bg-transparent text-left outline-none">
              <span className="text-white font-serif italic text-lg lg:text-xl truncate">
                {category === 'All' ? 'Product, Service, Book, Event, etc' : category}
              </span>
              <ChevronDown size={16} className="text-gray-500 group-hover:text-white transition-colors ml-2 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-[#1A1A1A] border-[#333] text-white w-[var(--radix-dropdown-menu-trigger-width)] rounded-t-none border-t-0 p-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4 duration-300 ease-out" 
              sideOffset={0} 
              align="start"
            >
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setCategory('All')}>All Categories</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setCategory('PRODUCT')}>Product</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setCategory('SERVICE')}>Service</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setCategory('BOOK')}>Book</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setCategory('EVENT')}>Event</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Block 2 (Location Dropdown) */}
        <div className="flex flex-col justify-center px-6 lg:px-8 py-6 lg:py-0 border-b lg:border-b-0 lg:border-r border-[#333] w-full lg:w-1/4 relative group">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Location</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between w-full bg-transparent text-left outline-none">
              <span className="text-white font-serif italic text-lg lg:text-xl truncate">
                {location === 'All' ? 'Global Archives' : location}
              </span>
              <ChevronDown size={16} className="text-gray-500 group-hover:text-white transition-colors ml-2 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-[#1A1A1A] border-[#333] text-white w-[var(--radix-dropdown-menu-trigger-width)] rounded-t-none border-t-0 p-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4 duration-300 ease-out" 
              sideOffset={0} 
              align="start"
            >
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setLocation('All')}>Global Archives</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setLocation('Asia')}>Asia</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setLocation('Europe')}>Europe</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-brand-accent/20 focus:bg-brand-accent/20 focus:text-white cursor-pointer font-serif italic text-lg py-4 px-6 rounded-none border-b border-[#333]/50 last:border-b-0 transition-colors text-white outline-none" onClick={() => setLocation('Americas')}>Americas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Block 3 (Search) */}
        <div className="flex flex-1 items-center px-6 lg:px-8 py-8 lg:py-0 gap-4">
          <Search size={18} className="text-gray-500 shrink-0" />
          <input 
            type="text" 
            placeholder="SEARCH ARCHIVE"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-[10px] font-sans font-bold uppercase tracking-[0.15em] md:tracking-[0.3em] placeholder:text-gray-700 focus:outline-none text-white"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-32">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 md:mb-12 border-b border-gray-300 pb-6 md:pb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif tracking-tighter text-brand-ink uppercase">
            INDEXED <span className="italic">COLLECTION</span>
          </h2>
          <div className="text-[10px] lg:text-[12px] font-sans font-bold uppercase tracking-widest text-gray-400">
            Items 001—{filteredItems.length.toString().padStart(3, '0')}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <DirectoryCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-60">
            <p className="text-brand-ink/20 italic font-serif text-3xl">
              Archive records are currently empty.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
