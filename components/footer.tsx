"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="w-full bg-[#f9f9f9] pt-24 pb-12 border-t border-[#c6c6c6]/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16">
        
        {/* Top Section: Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-12 gap-y-10 sm:gap-y-16 mb-16 sm:mb-24">
          {/* About Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h3 className="text-xl sm:text-[1.5rem] font-medium text-[#000000] tracking-tight">About</h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              <li><Link href="/about" className="text-sm sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Why We Do It</Link></li>
              <li>
                <Link 
                  href="/about#team" 
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.location.pathname === '/about') {
                      const el = document.getElementById('team');
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState(null, '', '/about#team');
                      }
                    }
                  }}
                  className="text-sm sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200"
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h3 className="text-xl sm:text-[1.5rem] font-medium text-[#000000] tracking-tight">Get involved</h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              <li><Link href="/become-a-volunteer" className="text-sm sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Volunteering</Link></li>
              <li>
                <Link 
                  href="/events#upcoming-events" 
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.location.pathname === '/events') {
                      const el = document.getElementById('upcoming-events');
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState(null, '', '/events#upcoming-events');
                      }
                    }
                  }}
                  className="text-sm sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200"
                >
                  Upcoming events
                </Link>
              </li>
              <li>
                <Link 
                  href="/events#movement-timeline" 
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.location.pathname === '/events') {
                      const el = document.getElementById('movement-timeline');
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState(null, '', '/events#movement-timeline');
                      }
                    }
                  }}
                  className="text-sm sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200"
                >
                  Events calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* More Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h3 className="text-xl sm:text-[1.5rem] font-medium text-[#000000] tracking-tight">More</h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              <li><Link href="/zero-waste-archive" className="text-sm sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Zero waste hub</Link></li>
              <li><Link href="/contact" className="text-sm sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Contact us</Link></li>
            </ul>
          </div>
        </div>

        {/* Middle Section: Secondary Links */}
        <div className="pt-8 pb-8 border-t border-[#c6c6c6]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-6">
            <span className="bg-[#f3f3f3] px-3.5 py-1.5 rounded-md text-xs sm:text-[0.875rem] font-medium text-[#1b1b1b]">
              Nonprofit Status
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <a href="https://www.linkedin.com/company/sustainable-sundays" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">LinkedIn</a>
            <a href="https://www.whatsapp.com/channel/0029Vb8Ade0CHDyiSG6zlB0f" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">WhatsApp</a>
            <a href="https://www.instagram.com/sustainable_sundays_blr/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-[0.875rem] text-[#474747] hover:text-[#000000] transition-colors duration-200">Instagram</a>
          </div>
        </div>


      </div>
    </footer>
  );
}
