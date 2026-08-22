"use client"

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { directoryData } from '@/lib/data/archive-data'
import { DirectoryCard } from './directory-card'
import Menu, { IMenu } from "@/components/ui/navbar"

export function DirectorySection() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 15

  const filteredItems = useMemo(() => {
    return directoryData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1

  // Reset to page 1 when filter or search changes
  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    setCurrentPage(1)
  }

  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)

  const menuItems: IMenu[] = useMemo(() => [
    {
      id: 'all',
      title: 'ALL',
      active: category === 'All',
      onClick: () => handleCategoryChange('All'),
    },
    {
      id: 'product',
      title: 'PRODUCTS',
      active: category === 'PRODUCT',
      onClick: () => handleCategoryChange('PRODUCT'),
    },
    {
      id: 'service',
      title: 'SERVICES',
      active: category === 'SERVICE',
      onClick: () => handleCategoryChange('SERVICE'),
    },
    {
      id: 'book',
      title: 'BOOKS',
      active: category === 'BOOK',
      onClick: () => handleCategoryChange('BOOK'),
    },
    {
      id: 'event',
      title: 'EVENTS',
      active: category === 'EVENT',
      onClick: () => handleCategoryChange('EVENT'),
    },
  ], [category]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
      const element = document.getElementById('directory-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
      const element = document.getElementById('directory-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <section id="directory-section" className="relative">
      {/* Animated Filter & Search Navigation Bar */}
      <div className="w-full bg-[#1A1A1A] text-white flex flex-col md:flex-row items-stretch border-y border-[#333] min-h-[72px]">
        {/* Navigation Menu Component - Left 50% */}
        <div className="w-full md:w-1/2 flex items-center px-4 md:px-8 py-3 md:py-0 overflow-x-auto border-b md:border-b-0 md:border-r border-[#333]">
          <Menu
            list={menuItems}
            className="w-full"
            itemClassName="text-xs tracking-[0.15em] font-sans font-bold text-gray-300 hover:text-white uppercase py-4 px-4 sm:px-5"
            dropdownClassName="bg-[#1A1A1A] border-[#333] text-white z-50 shadow-2xl"
            cursorClassName="bg-[#E84333]"
          />
        </div>

        {/* Search Bar - Right 50% starting at the center */}
        <div className="w-full md:w-1/2 flex items-center px-6 lg:px-8 py-4 md:py-0 gap-4 bg-[#161616]/50">
          <Search size={16} className="text-gray-500 shrink-0" />
          <input 
            type="text" 
            placeholder="SEARCH ARCHIVE"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-transparent w-full text-[11px] font-sans font-bold uppercase tracking-[0.2em] placeholder:text-gray-600 focus:outline-none text-white"
          />
          {search && (
            <button 
              onClick={() => handleSearchChange('')}
              className="text-[10px] text-gray-500 hover:text-white font-sans uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Entries List */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-32">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 md:mb-12 border-b border-gray-300 pb-6 md:pb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif tracking-tighter text-brand-ink uppercase">
            INDEXED <span className="italic">COLLECTION</span>
          </h2>
          <div className="text-[10px] lg:text-[12px] font-sans font-bold uppercase tracking-widest text-gray-400">
            {filteredItems.length > 0
              ? `Items ${startIndex.toString().padStart(3, '0')}—${endIndex.toString().padStart(3, '0')} of ${filteredItems.length.toString().padStart(3, '0')}`
              : 'Items 000—000'}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item) => (
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

        {/* Bottom Pagination Bar */}
        {filteredItems.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gray-400">
              Page {currentPage} of {totalPages}
            </div>

            {/* Bottom Right Next / Previous Controls */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {currentPage > 1 && (
                <button
                  onClick={handlePrevPage}
                  className="px-5 py-3 border border-gray-300 bg-white text-brand-ink hover:border-black hover:bg-black hover:text-white transition-all duration-300 text-[11px] font-sans font-bold uppercase tracking-[0.2em] flex items-center gap-2 group cursor-pointer"
                >
                  <span>Prev 15</span>
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  onClick={handleNextPage}
                  className="px-6 py-3 border border-brand-ink bg-brand-ink text-white hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 text-[11px] font-sans font-bold uppercase tracking-[0.2em] flex items-center gap-3 group cursor-pointer shadow-sm"
                >
                  <span>Next 15</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default DirectorySection
