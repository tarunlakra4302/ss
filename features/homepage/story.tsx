import React from 'react';
import TextAnimation1 from '@/components/TextAnimation1';

export function StorySection() {
  return (
    <>
      {/* Our Philosophy Section - Minimalist Editorial */}
      <section className="bg-[#FFFFFF] text-black relative font-sans">
        <div className="max-w-7xl mx-auto py-24 px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Column 1: The Label (Left Side) */}
            <div className="md:col-span-3 self-start">
              <p className="text-lg md:text-xl font-medium tracking-tight text-black mt-1 select-none">
                Our Philosophy
              </p>
            </div>

            {/* Column 2: The Main Content (Right Side) */}
            <div className="md:col-start-6 md:col-span-7 max-w-3xl flex flex-col gap-10 md:gap-12">
              <TextAnimation1>
                <p className="text-4xl md:text-[40px] lg:text-[44px] font-medium leading-tight md:leading-[1.1] tracking-[-0.03em] text-black mb-10 md:mb-12">
                  We believe Sundays shouldn&apos;t just be for resting. By uniting people with a shared purpose, we turn the weekend into a catalyst for climate action.
                </p>

                <p className="text-2xl md:text-[30px] lg:text-[32px] font-normal leading-snug md:leading-[1.3] tracking-[-0.02em] text-black">
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


