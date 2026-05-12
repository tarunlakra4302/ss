'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;
}

interface EventMap {
  [key: string]: CalendarEvent[];
}

const SAMPLE_EVENTS: EventMap = {
  '2026-03-07': [
    {
      id: 1,
      title: 'Cubbon Park Plogging',
      time: '07:00 AM — 09:30 AM',
      location: 'Cubbon Park, Bangalore',
      description: 'Join us for our signature plogging run — jog through Cubbon Park while collecting litter to keep our city green.',
    },
  ],
  '2026-03-14': [
    {
      id: 2,
      title: 'Beach Cleanup Drive',
      time: '06:30 AM — 10:00 AM',
      location: 'Marina Beach, Chennai',
      description: 'A large-scale shoreline cleanup to protect ocean ecosystems. Gloves and bags provided.',
    },
    {
      id: 3,
      title: 'Sustainability Workshop',
      time: '11:00 AM — 01:00 PM',
      location: 'Community Hall, Indiranagar',
      description: 'Interactive session on zero-waste living, composting, and sustainable shopping.',
    },
  ],
  '2026-03-21': [
    {
      id: 4,
      title: 'Tree Planting Initiative',
      time: '07:30 AM — 11:00 AM',
      location: 'Green Valley, Whitefield',
      description: 'Help us plant 200 native saplings and restore the green cover in and around Whitefield.',
    },
  ],
  '2026-03-28': [
    {
      id: 5,
      title: 'Urban Garden Workshop',
      time: '09:00 AM — 12:00 PM',
      location: 'JP Nagar Community Grounds',
      description: 'Learn container gardening and terrace farming — take home your own starter kit.',
    },
    {
      id: 6,
      title: 'Sustainable Sundays Fundraising Party',
      time: '07:00 PM — 11:00 PM',
      location: 'Cubbon Park, KA (TBD)',
      description: 'A night of impact raising vital funds for cancer patients worldwide with Sustainable Sundays.',
    },
  ],
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function EventCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Initial and Month Transition Animation
  useGSAP(() => {
    const grid = gridRef.current;
    const header = headerRef.current;
    if (!grid || !header) return;
    
    // Kill any existing animations to prevent overlap
    gsap.killTweensOf(grid.children);
    
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline();
      
      tl.fromTo(header, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
      );
      
      tl.fromTo(grid.children, 
        { opacity: 0, scale: 0.9, y: 20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: { each: 0.02, from: "start", grid: [6, 7] }, 
          ease: "elastic.out(1, 0.75)" 
        },
        "-=0.6"
      );
    });
  }, { dependencies: [viewMonth, viewYear], scope: containerRef });

  // Event Details Stagger Animation
  useGSAP(() => {
    if (!detailsRef.current) return;
    const cards = detailsRef.current.querySelectorAll('.event-card');
    if (cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, x: 30, filter: "blur(10px)" },
        { 
          opacity: 1, 
          x: 0, 
          filter: "blur(0px)", 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power3.out" 
        }
      );
    }
  }, { dependencies: [selectedKey], scope: detailsRef });

  // Mobile Scroll-to-Panel Animation
  useGSAP(() => {
    if (!selectedKey || !panelRef.current) return;
    
    const mm = gsap.matchMedia();
    mm.add("(max-width: 1023px)", () => {
      const target = panelRef.current;
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 20;
        const currentScroll = window.pageYOffset;
        const obj = { val: currentScroll };
        
        gsap.to(obj, {
          val: top,
          duration: 1.2,
          ease: "power4.inOut",
          onUpdate: () => window.scrollTo(0, obj.val)
        });
      }
    });
  }, { dependencies: [selectedKey] });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonth = () => {
    if (!gridRef.current) return;
    gsap.to(gridRef.current, { opacity: 0, x: -20, duration: 0.3, onComplete: () => {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
      else setViewMonth(m => m - 1);
      gsap.fromTo(gridRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
  };

  const nextMonth = () => {
    if (!gridRef.current) return;
    gsap.to(gridRef.current, { opacity: 0, x: 20, duration: 0.3, onComplete: () => {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
      else setViewMonth(m => m + 1);
      gsap.fromTo(gridRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
  };

  // Build calendar cells
  const cells: { day: number; current: boolean; key: string }[] = [];

  for (let i = 0; i < firstDay; i++) {
    const d = daysInPrevMonth - firstDay + 1 + i;
    const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, current: false, key: toKey(prevY, prevM, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, key: toKey(viewYear, viewMonth, d) });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day: d, current: false, key: toKey(nextY, nextM, d) });
  }

  const selectedEvents = selectedKey ? (SAMPLE_EVENTS[selectedKey] ?? []) : [];
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const formatSelectedDate = () => {
    if (!selectedKey) return 'Upcoming Schedule';
    const [y, m, d] = selectedKey.split('-').map(Number);
    return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
  };

  return (
    <section id="movement-timeline" ref={containerRef} className="w-full py-12 px-4 md:py-24 md:px-6 bg-[#fcfcfc] dark:bg-background overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.2_0.08_240)]/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-[oklch(0.2_0.08_240)]/10 min-w-[40px] md:min-w-[60px]" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black text-[oklch(0.2_0.08_240)] dark:text-white leading-[0.85] tracking-tighter uppercase whitespace-pre-wrap">
              The <span className="text-[oklch(0.2_0.08_240)]/40">Movement</span> <br />Timeline
            </h2>
          </div>
          <p className="max-w-md text-base md:text-xl text-[oklch(0.2_0.08_240)]/60 font-medium leading-relaxed italic border-l-4 border-[oklch(0.2_0.08_240)] px-6 md:px-8">
            Don’t just scroll. Show up. Find a local workshop, community cleanup, or eco-event happening near you this month.
          </p>
        </div>

        {/* Main Interface Wrapper */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16">
          
          {/* ── Left Side: Calendar Core ── */}
          <div className="space-y-8 md:space-y-12">
            {/* Month Control Bar */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] border border-[oklch(0.2_0.08_240)]/5 p-4 md:p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
              <button
                onClick={prevMonth}
                className="group p-3 md:p-4 rounded-full hover:bg-[oklch(0.2_0.08_240)] hover:text-white transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90 border border-transparent hover:border-[oklch(0.2_0.08_240)]"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <div className="text-center">
                <h3 className="text-xl md:text-4xl font-black text-[oklch(0.2_0.08_240)] dark:text-white tracking-tighter uppercase flex items-center justify-center gap-4">
                   <span>{MONTH_NAMES[viewMonth]}</span>
                   <span className="opacity-20">{viewYear}</span>
                </h3>
              </div>
              
              <button
                onClick={nextMonth}
                className="group p-3 md:p-4 rounded-full hover:bg-[oklch(0.2_0.08_240)] hover:text-white transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90 border border-transparent hover:border-[oklch(0.2_0.08_240)]"
                aria-label="Next Month"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Calendar Grid Container */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.1)] border border-[oklch(0.2_0.08_240)]/5 relative overflow-hidden group/grid">
              {/* Dynamic glass effect */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-[oklch(0.2_0.08_240)]/[0.03] rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[oklch(0.2_0.08_240)]/[0.03] rounded-full blur-[100px] pointer-events-none" />
              
              {/* Day Names Row */}
              <div className="grid grid-cols-7 mb-6 md:mb-10">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-[oklch(0.2_0.08_240)]/20 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div 
                ref={gridRef}
                className="grid grid-cols-7 gap-2 md:gap-6"
              >
                {cells.map((cell, i) => {
                  if (!cell.current) {
                    return <div key={i} className="aspect-square md:aspect-[5/4]" />;
                  }

                  const hasEvent = !!SAMPLE_EVENTS[cell.key];
                  const isSelected = selectedKey === cell.key;
                  const isToday = cell.key === todayKey;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedKey(cell.key)}
                      className={[
                        'relative aspect-square md:aspect-[5/4] rounded-xl md:rounded-[2rem] transition-all duration-700 group overflow-hidden border',
                        'cursor-pointer',
                        isSelected 
                          ? 'bg-[oklch(0.2_0.08_240)] text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] scale-[1.08] z-20 border-[oklch(0.2_0.08_240)]' 
                          : 'bg-[#fafafa] dark:bg-slate-900 border-transparent hover:bg-white hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:scale-[1.02] dark:hover:bg-slate-800',
                        isToday && !isSelected ? 'border-[oklch(0.2_0.08_240)]/10' : '',
                      ].join(' ')}
                    >
                      {/* Interactive focus ring */}
                      <div className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit]" />

                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-4">
                        <span className={[
                          'text-xl md:text-4xl font-black tracking-tighter transition-all duration-700',
                          isSelected ? 'text-white translate-y-[-2px]' : 'text-[oklch(0.2_0.08_240)]/90 dark:text-white/90 group-hover:scale-110',
                          isToday && !isSelected ? 'text-[oklch(0.2_0.08_240)]' : '',
                        ].join(' ')}>
                          {cell.day}
                        </span>
                        


                        {isToday && !hasEvent && (
                           <div className="absolute top-2 right-2 md:top-4 md:right-4 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[oklch(0.2_0.08_240)]/10" />
                        )}
                      </div>

                      {/* Event count indicator */}
                      {hasEvent && cell.current && (
                        <div className={`absolute z-20 ${cell.day > 9 ? 'top-1.5 right-1.5 md:top-3 md:right-3' : 'top-2 right-2 md:top-4 md:right-4'}`}>
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-blink shadow-[0_0_10px_rgba(16,185,129,0.5)] ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right Side: Dynamic Content Panel ── */}
          <div ref={panelRef} className="lg:sticky lg:top-32 h-auto lg:h-[calc(100vh-120px)] flex flex-col gap-6 md:gap-8">
            {/* Header of Content Panel */}
            <div className="bg-[oklch(0.2_0.08_240)] text-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative overflow-hidden group shrink-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                  </div>
                  {selectedKey && (
                    <button 
                      onClick={() => {
                        setSelectedKey(null);
                        const container = containerRef.current;
                        if (container) {
                          const top = container.getBoundingClientRect().top + window.pageYOffset - 40;
                          const currentScroll = window.pageYOffset;
                          const obj = { val: currentScroll };
                          gsap.to(obj, {
                            val: top,
                            duration: 1,
                            ease: "power4.inOut",
                            onUpdate: () => window.scrollTo(0, obj.val)
                          });
                        }
                      }}
                      className="lg:hidden text-white/60 hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors px-4 py-2 rounded-full border border-white/10 hover:bg-white/5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Calendar
                    </button>
                  )}
                </div>
                <h4 className="text-2xl md:text-4xl font-black leading-[0.85] tracking-tighter uppercase whitespace-pre-wrap">
                  {formatSelectedDate()}
                </h4>
              </div>
            </div>

            {/* Content Scrollable List */}
            <div 
              ref={detailsRef}
              className="flex-1 overflow-y-auto pr-2 md:pr-4 space-y-4 md:space-y-6 max-h-[500px] lg:max-h-none custom-scrollbar"
            >
              {selectedKey === null ? (
                <div className="flex flex-col items-center justify-center py-12 md:py-20 px-6 md:px-8 text-center bg-white border border-[oklch(0.2_0.08_240)]/5 rounded-3xl md:rounded-[3rem] group shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[oklch(0.2_0.08_240)]/[0.02] flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[oklch(0.2_0.08_240)]/5 transition-colors duration-700">
                    <Calendar className="w-6 h-6 md:w-10 md:h-10 text-[oklch(0.2_0.08_240)]/10 group-hover:text-[oklch(0.2_0.08_240)]/20 transition-all duration-700 group-hover:scale-110" />
                  </div>
                  <h5 className="text-xs md:text-sm font-black uppercase tracking-widest mb-2">Awaiting Selection</h5>
                  <p className="text-[oklch(0.2_0.08_240)]/40 text-xs md:text-sm font-medium leading-relaxed italic">Select a waypoint on the movement timeline to reveal synchronized events.</p>
                </div>
              ) : selectedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 md:py-20 px-6 md:px-8 text-center bg-[#fafafa] border border-[oklch(0.2_0.08_240)]/5 rounded-3xl md:rounded-[3rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
                   <div className="w-1.5 h-[50px] md:w-2 md:h-[80px] bg-[oklch(0.2_0.08_240)]/5 rounded-full mb-6 md:mb-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-[oklch(0.2_0.08_240)]/10 animate-bounce" />
                   </div>
                  <h5 className="text-xs md:text-sm font-black uppercase tracking-widest mb-2">Clear Horizon</h5>
                  <p className="text-[oklch(0.2_0.08_240)]/30 text-xs md:text-sm font-medium">No synchronized events scheduled for this specific date.</p>
                </div>
              ) : (
                selectedEvents.map(event => (
                  <div
                    key={event.id}
                    className="event-card group relative bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-[oklch(0.2_0.08_240)]/[0.03] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] hover:border-[oklch(0.2_0.08_240)]/10 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  >
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                      <div className="px-3 md:px-4 py-1.5 md:py-2 bg-[oklch(0.2_0.08_240)]/[0.03] dark:bg-white/5 rounded-full flex items-center gap-2">
                        <Clock className="w-3 md:w-3.5 h-3 md:h-3.5 text-[oklch(0.2_0.08_240)]/20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[oklch(0.2_0.08_240)]/60 dark:text-white/60">
                          {event.time}
                        </span>
                      </div>
                      <Link 
                        href={`/events/${slugify(event.title)}`}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[oklch(0.2_0.08_240)]/10 flex items-center justify-center bg-[oklch(0.2_0.08_240)]/5 text-[oklch(0.2_0.08_240)] group-hover:bg-[oklch(0.2_0.08_240)] group-hover:text-white transition-all duration-500 ease-out"
                        aria-label={`Go to ${event.title} details`}
                      >
                        <ArrowRight className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      </Link>
                    </div>
                    
                    <h5 className="text-lg md:text-2xl font-black text-[oklch(0.2_0.08_240)] dark:text-white uppercase leading-[0.9] tracking-tighter mb-3 md:mb-4">
                      {event.title}
                    </h5>
                    
                    <div className="flex items-center gap-2 md:gap-3 text-[oklch(0.2_0.08_240)]/40 dark:text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6">
                      <MapPin className="w-3 md:w-4 h-3 md:h-4 text-[oklch(0.2_0.08_240)]/20" />
                      <span>{event.location}</span>
                    </div>
                    
                    <p className="text-[oklch(0.2_0.08_240)]/50 dark:text-white/50 text-sm md:text-base leading-relaxed font-medium">
                      {event.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px oklch(0.2 0.08 240 / 0.1);
          color: transparent;
        }
        .animate-blink {
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: oklch(0.2 0.08 240 / 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: oklch(0.2 0.08 240 / 0.2);
        }
        @media (min-width: 1024px) {
          .lg\:scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .lg\:scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </section>
  );
}
