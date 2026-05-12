"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export function ArchiveNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-20 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-12">
        <Link href="/zero-waste-archive" className="text-3xl font-serif font-black tracking-widest text-brand-ink">
          ARCHIVE
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-accent transition-colors text-brand-ink">Home</Link>
          <Link href="/zero-waste-archive" className="hover:text-brand-accent transition-colors text-brand-ink">Directory</Link>
          <Link href="#" className="hover:text-brand-accent transition-colors text-brand-ink">Marketplace</Link>
        </div>
      </div>
      
      <div className="hidden md:block">
        <button className="border border-brand-ink text-brand-ink px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-brand-ink hover:text-white transition-all active:scale-95">
          Submit Entry
        </button>
      </div>

      <button 
        className="md:hidden p-2 text-brand-ink"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-brand-bg border-b border-brand-border p-8 flex flex-col gap-6 md:hidden shadow-xl"
          >
            <Link href="/" className="text-lg font-serif text-brand-ink" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/zero-waste-archive" className="text-lg font-serif text-brand-ink" onClick={() => setIsOpen(false)}>Directory Index</Link>
            <Link href="#" className="text-lg font-serif text-brand-ink" onClick={() => setIsOpen(false)}>Marketplace</Link>
            <button className="bg-brand-ink text-white py-4 rounded-sm text-sm font-bold uppercase tracking-widest">
              Submit Entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
