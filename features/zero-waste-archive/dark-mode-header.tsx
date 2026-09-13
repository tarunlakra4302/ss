"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface NavItem {
  label: string
  value?: string
  href?: string
  active?: boolean
}

interface DarkModeHeaderProps {
  name?: string
  subtitle?: string
  bio?: string
  activeCategory?: string
  onCategorySelect?: (category: string) => void
  search?: string
  onSearchChange?: (search: string) => void
  navItems?: NavItem[]
  className?: string
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "ALL", value: "All" },
  { label: "PRODUCTS", value: "PRODUCT" },
  { label: "SERVICES", value: "SERVICE" },
  { label: "BOOKS", value: "BOOK" },
  { label: "EVENTS", value: "EVENT" },
]

export function DarkModeHeader({
  name = "Sustainable Sundays",
  subtitle = "Zero Waste Hub",
  bio = "A curated exploration of space, void, and the essential sustainable structures defining modern zero-waste living.",
  activeCategory = "All",
  onCategorySelect,
  search: controlledSearch,
  onSearchChange: controlledOnSearchChange,
  navItems = DEFAULT_NAV_ITEMS,
  className,
}: DarkModeHeaderProps) {
  const [internalSearch, setInternalSearch] = useState("")
  const search = controlledSearch !== undefined ? controlledSearch : internalSearch

  const handleSearchChange = (val: string) => {
    if (controlledOnSearchChange) {
      controlledOnSearchChange(val)
    } else {
      setInternalSearch(val)
    }
  }

  const handleItemClick = (item: NavItem) => {
    const val = item.value || item.label
    if (onCategorySelect) {
      onCategorySelect(val)
    }
    const target = document.getElementById("directory-section")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className={cn("w-full bg-black text-white antialiased font-sans", className)}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-8 pb-6 md:pt-10 md:pb-8">
        {/* Top Section (Header & Bio) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-12">
          {/* Left Identity Block */}
          <div className="shrink-0">
            <Link
              href="/"
              className="inline-block group outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-xs"
              aria-label="Sustainable Sundays Homepage"
            >
              <h1 className="text-white font-semibold text-xl md:text-2xl tracking-tight group-hover:text-zinc-200 transition-colors">
                {name}
              </h1>
            </Link>
            <p className="text-zinc-500 text-sm md:text-base mt-1">
              {subtitle}
            </p>
          </div>

          {/* Right Bio Block */}
          <div className="max-w-2xl">
            <p className="text-zinc-500 text-base md:text-lg leading-relaxed">
              {bio}
            </p>
          </div>
        </div>

        {/* Separator */}
        <Separator className="border-t border-zinc-800/60 bg-transparent my-6 md:my-8" />

        {/* Bottom Section (Navigation & Search) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav aria-label="Main Archive Navigation" className="overflow-x-auto scrollbar-none">
            <ul className="flex items-center gap-6 md:gap-8 py-1">
              {navItems.map((item) => {
                const itemVal = item.value || item.label
                const isActive = activeCategory === itemVal || (item.active && !onCategorySelect)
                return (
                  <li key={item.label} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "text-sm transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-xs cursor-pointer bg-transparent border-0 p-0",
                        isActive
                          ? "text-white font-bold tracking-wide"
                          : "text-zinc-500 font-medium hover:text-zinc-300"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Search Bar */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 focus-within:border-zinc-600 transition-colors w-full sm:w-auto shrink-0">
            <Search size={14} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="SEARCH ARCHIVE..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("directory-section")?.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none w-full sm:w-44 focus:sm:w-56 transition-all tracking-wider uppercase font-sans"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
