"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="w-full bg-[#f9f9f9] pt-24 pb-12 border-t border-[#c6c6c6]/30">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        
        {/* Top Section: Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 mb-24">
          {/* About Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[1.5rem] font-medium text-[#000000] tracking-tight">About</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Why We Do It</Link></li>
              <li><Link href="/about#timeframe" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Timeframe</Link></li>
            </ul>
          </div>

          {/* Events Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[1.5rem] font-medium text-[#000000] tracking-tight">Events</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/events#upcoming-events" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Upcoming events</Link></li>
              <li><Link href="/events#movement-timeline" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Events calendar</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[1.5rem] font-medium text-[#000000] tracking-tight">Get involved</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/become-a-volunteer" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Volunteering</Link></li>
              <li><Link href="/become-a-member" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Become a member</Link></li>
            </ul>
          </div>

          {/* More Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[1.5rem] font-medium text-[#000000] tracking-tight">More</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/zero-waste-archive" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Zero waste hub</Link></li>
              <li><Link href="/contact" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Contact us</Link></li>
            </ul>
          </div>
        </div>

        {/* Middle Section: Secondary Links */}
        <div className="pt-10 pb-10 border-t border-[#c6c6c6]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-8">
            <span className="bg-[#f3f3f3] px-4 py-2 rounded-md text-[0.875rem] font-medium text-[#1b1b1b]">
              Nonprofit Status
            </span>

          </div>
          <div className="flex items-center gap-8">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">LinkedIn</a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">WhatsApp</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Instagram</a>
          </div>
        </div>


      </div>
    </footer>
  );
}
