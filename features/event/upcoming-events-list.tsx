import React from "react";
import Link from "next/link";

interface EventItem {
  id: string | number;
  dayOfWeek: string;
  dayNumber: string;
  monthYear: string;
  title: string;
  dateRange: string;
  price: string;
  href: string;
}

const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 1,
    dayOfWeek: "Sun",
    dayNumber: "23",
    monthYear: "Aug 2026",
    title: "Edible Gardening Workshop",
    dateRange: "August 23, 2026 • 10:00 AM – 01:00 PM IST",
    price: "₹700",
    href: "/events/edible-gardening-workshop",
  },
];

export function UpcomingEventsList() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 md:py-24 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-8">
          Upcoming events
        </h2>

        {/* Filter Pill */}
        <div className="mb-10">
          <span className="inline-flex items-center rounded-full border border-gray-800 bg-transparent px-6 py-2.5 text-base md:text-lg font-medium text-gray-900">
            Workshops & Community
          </span>
        </div>

        {/* The Events List */}
        <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex flex-row items-center py-8 md:py-10 gap-8 md:gap-12"
            >
              {/* 1. Left Column: The Date Box */}
              <div className="w-[96px] h-[116px] md:w-[108px] md:h-[128px] shrink-0 border border-gray-200 flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-700">
                  {event.dayOfWeek}
                </span>
                <span className="text-4xl md:text-5xl font-bold leading-none my-1.5 text-black">
                  {event.dayNumber}
                </span>
                <span className="text-xs md:text-sm font-semibold text-gray-700">
                  {event.monthYear}
                </span>
              </div>

              {/* 2. Middle Column: Event Details */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h3 className="text-2xl md:text-3xl font-semibold text-black tracking-tight">
                  <Link href={event.href} className="hover:text-primary transition-colors">
                    {event.title}
                  </Link>
                </h3>
                <p className="text-lg md:text-xl font-normal text-gray-700">
                  {event.dateRange}
                </p>
                <p className="text-lg md:text-xl font-medium text-gray-900">
                  {event.price}
                </p>
              </div>

              {/* 3. Right Column: Action Button */}
              <div className="ml-auto shrink-0">
                <Link
                  href={event.href}
                  className="inline-block rounded-full border border-gray-300 bg-transparent px-8 py-3.5 text-base md:text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Save my spot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

