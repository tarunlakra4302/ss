import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { PhilosophySection } from "@/components/sections/philosophy-section";

export const metadata: Metadata = {
  title: "Our Philosophy | Sustainable Sundays",
  description:
    "We believe Sundays shouldn’t just be for resting. By uniting people with a shared purpose, we turn the weekend into a catalyst for climate action.",
};

export default function XyzPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full pt-20 md:pt-24 bg-[#f7f7f7] flex flex-col justify-center">
        <PhilosophySection />
      </main>
    </>
  );
}
