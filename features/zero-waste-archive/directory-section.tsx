"use client"

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { directoryData } from '@/lib/data/archive-data'
import { DirectoryCard } from './directory-card'
import { FlowHoverButton } from "@/components/ui/flow-hover-button"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface DirectorySectionProps {
  category?: string
  onCategoryChange?: (category: string) => void
  search?: string
  onSearchChange?: (search: string) => void
}

export function DirectorySection({
  category: controlledCategory,
  onCategoryChange: controlledOnCategoryChange,
  search: controlledSearch,
  onSearchChange: controlledOnSearchChange,
}: DirectorySectionProps = {}) {
  const [internalSearch, setInternalSearch] = useState('')
  const [internalCategory, setInternalCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 15

  const search = controlledSearch !== undefined ? controlledSearch : internalSearch
  const category = controlledCategory !== undefined ? controlledCategory : internalCategory

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
    if (controlledOnSearchChange) {
      controlledOnSearchChange(val)
    } else {
      setInternalSearch(val)
    }
    setCurrentPage(1)
  }

  const handleCategoryChange = (cat: string) => {
    if (controlledOnCategoryChange) {
      controlledOnCategoryChange(cat)
    } else {
      setInternalCategory(cat)
    }
    setCurrentPage(1)
  }

  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)

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
                <FlowHoverButton asChild className="bg-white text-brand-ink border border-gray-300 px-6 py-3.5 md:px-12 md:py-5 rounded-full font-bold uppercase tracking-wider md:tracking-widest text-xs sm:text-sm h-12 md:h-auto hover:border-black hover:bg-black hover:text-white transition-colors inline-flex items-center justify-center cursor-pointer">
                  <button onClick={handlePrevPage} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                    Prev 15
                  </button>
                </FlowHoverButton>
              )}
              {currentPage < totalPages && (
                <FlowHoverButton asChild className="bg-brand-ink text-white px-6 py-3.5 md:px-12 md:py-5 rounded-full font-bold uppercase tracking-wider md:tracking-widest text-xs sm:text-sm h-12 md:h-auto border-none hover:bg-brand-accent transition-colors inline-flex items-center justify-center cursor-pointer">
                  <button onClick={handleNextPage} className="flex items-center gap-2">
                    Next 15
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1" />
                  </button>
                </FlowHoverButton>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default DirectorySection
