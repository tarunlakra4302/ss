"use client"

import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { DirectoryItem } from '@/lib/data/archive-data'

interface DirectoryCardProps {
  item: DirectoryItem
}

export function DirectoryCard({ item }: DirectoryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white border border-gray-200 p-5 sm:p-8 md:p-10 flex flex-col h-full group hover:border-brand-accent/30 transition-all duration-500"
    >
      {/* Card Top: Category */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-6 h-[1px] bg-brand-accent" />
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-accent">
          {item.category}
        </span>
      </div>

      {/* Card Middle: Content */}
      <div className="flex-grow">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight text-brand-ink mb-4 transition-all duration-300">
          {item.name}
        </h3>
        <p className="text-[15px] font-sans text-gray-500 leading-relaxed max-w-[90%]">
          {item.description}
        </p>
      </div>

      {/* Card Bottom: Footer */}
      <div className="mt-12 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">DIGITAL ACCESS</span>
          <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-2 group-hover:text-brand-accent transition-all duration-500" />
        </div>
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[11px] font-mono text-gray-400 hover:text-brand-ink hover:underline break-all block transition-colors"
        >
          {item.url}
        </a>
      </div>
    </motion.div>
  )
}
