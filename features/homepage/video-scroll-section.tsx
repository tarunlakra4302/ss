"use client";
import { VideoScrollHero } from "@/features/homepage/video-scroll-hero";

export const VideoScrollSection = () => {
  return (
    <section className="w-full relative">
      <VideoScrollHero 
        videoSrc="/videos/Ajeeb%20Dastan.mp4"
        enableAnimations={true} 
        startScale={0.85} 
      />
    </section>
  );
};