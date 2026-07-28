import React from 'react';
import TextAnimation1 from '@/components/TextAnimation1';

export function StorySection() {
  return (
    <>
      {/* Our Story Section - Minimalist */}
      <section className="bg-white text-black relative">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8 md:gap-12">
            {/* Left Column - Label */}
            <div className="mb-4 md:mb-0">
              <p className="text-xl md:text-2xl font-bold tracking-tight">Our Philosophy</p>
            </div>

            {/* Right Column - Main Content */}
            <div>
              <TextAnimation1>
                <p className="text-3xl md:text-4xl lg:text-[40px] font-medium leading-tight tracking-tight mb-12 md:mb-16">
                  We believe Sundays shouldn&apos;t just be for resting. By uniting people with a shared purpose, we turn the weekend into a catalyst for climate action.
                </p>

                <p className="text-xl md:text-2xl lg:text-[28px] font-normal leading-snug tracking-tight">
                  Sunday is the bridge between the week behind us and the week ahead. It&apos;s the perfect day to pause, reset, and step outside. Transform your Sunday, and together, we&apos;ll change the trajectory of our environment.
                </p>
              </TextAnimation1>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
