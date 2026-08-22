"use client";

import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface MediaItem {
  src: string;
  alt: string;
  title: string;
  type?: "image" | "video";
}

const Skiper54 = () => {
  const mediaItems: MediaItem[] = [
    {
      src: "/images/events/Agara Lake walk_24 May 2026.jpg",
      alt: "Agara Lake Walk & Biodiversity",
      title: "Agara Lake Walk",
      type: "image",
    },
    {
      src: "/images/events/Children at Sapling Care (1).MOV",
      alt: "Children at Sapling Care",
      title: "Sapling Care Youth Drive",
      type: "video",
    },
    {
      src: "/images/events/Edible Gardening workshop by Muthukaran_10 May.jpg",
      alt: "Edible Gardening Workshop by Muthukaran",
      title: "Edible Gardening Workshop",
      type: "image",
    },
    {
      src: "/images/events/Impact Analytics team at Rewilding Project at Kasturinagar Lake_6 June 2026.jpg",
      alt: "Rewilding Project at Kasturinagar Lake",
      title: "Rewilding Kasturinagar Lake",
      type: "image",
    },
    {
      src: "/images/events/Kitchen Secrets_26 July 2026.jpg",
      alt: "Kitchen Secrets Workshop",
      title: "Kitchen Secrets Event",
      type: "image",
    },
    {
      src: "/images/events/Odette Katrak at the Kitchen Secrets event_26 July 2026.jpg",
      alt: "Odette Katrak at Kitchen Secrets",
      title: "Sustainable Cooking Masterclass",
      type: "image",
    },
    {
      src: "/images/events/Sapling Care at Ambalipura Lake_9 August 2026.jpg",
      alt: "Sapling Care at Ambalipura Lake",
      title: "Sapling Care at Ambalipura Lake",
      type: "image",
    },
    {
      src: "/images/events/Soil preparation activity at Kasturinagar Lake_31 May 2026.jpeg",
      alt: "Soil preparation activity at Kasturinagar Lake",
      title: "Soil Preparation Activity",
      type: "image",
    },
    {
      src: "/images/events/Swap Gala event with music performance_22 March 2026.JPG",
      alt: "Swap Gala event with music performance",
      title: "Swap Gala & Music Fest",
      type: "image",
    },
    {
      src: "/images/events/Zero Waste Meet up at Swacha Graha Kalika Kendra.jpg",
      alt: "Zero Waste Meet up at Swacha Graha Kalika Kendra",
      title: "Zero Waste Community Meet",
      type: "image",
    },
    {
      src: "/images/events/Edible Gardening workshop by Muthukaran_10 May2.jpg",
      alt: "Gardening Workshop Session",
      title: "Organic Urban Cultivation",
      type: "image",
    },
    {
      src: "/images/events/Kitchen Secrets_26 July 2026 (B).jpg",
      alt: "Kitchen Secrets Community",
      title: "Zero Waste Food Prep",
      type: "image",
    },
  ];
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3] py-12">
      <Carousel_006
        images={mediaItems}
        className=""
        loop={true}
        showNavigation={true}
        showPagination={true}
      />
    </div>
  );
};

interface Carousel_006Props {
  images: MediaItem[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
}

const Carousel_006 = ({
  images,
  className,
  autoplay = false,
  loop = true,
  showNavigation = true,
  showPagination = true,
}: Carousel_006Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      className={cn("w-full", className)}
      opts={{
        loop,
        slidesToScroll: 1,
      }}
      plugins={
        autoplay
          ? [
              Autoplay({
                delay: 2000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]
          : []
      }
    >
      <CarouselContent className="flex h-[500px] w-full">
        {images.map((item, index) => (
          <CarouselItem
            key={index}
            className="relative flex h-[81.5%] w-full basis-[73%] items-center justify-center sm:basis-[50%] md:basis-[30%] lg:basis-[25%] xl:basis-[21%]"
          >
            <motion.div
              initial={false}
              animate={{
                clipPath:
                  current !== index
                    ? "inset(15% 0 15% 0 round 2rem)"
                    : "inset(0 0 0 0 round 2rem)",
              }}
              className="h-full w-full overflow-hidden rounded-3xl"
            >
              <div className="relative h-full w-full border bg-neutral-900">
                {item.type === "video" || item.src.endsWith(".MOV") || item.src.endsWith(".mp4") ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full scale-105 object-cover"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full scale-105 object-cover"
                  />
                )}
              </div>
            </motion.div>
            <AnimatePresence mode="wait">
              {current === index && (
                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-0 left-2 flex h-[14%] w-full translate-y-full items-center justify-center p-2 text-center font-medium tracking-tight text-black/40"
                >
                  {item.title}
                </motion.div>
              )}
            </AnimatePresence>
          </CarouselItem>
        ))}
      </CarouselContent>

      {showNavigation && (
        <div className="absolute -bottom-4 right-0 flex w-full items-center justify-between gap-2 px-4 pointer-events-none">
          <button
            aria-label="Previous slide"
            onClick={() => api?.scrollPrev()}
            className="rounded-full bg-black/10 hover:bg-black/20 p-2 pointer-events-auto transition-colors"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => api?.scrollNext()}
            className="rounded-full bg-black/10 hover:bg-black/20 p-2 pointer-events-auto transition-colors"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      )}

      {showPagination && (
        <div className="flex w-full items-center justify-center mt-2">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: images.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 w-2 cursor-pointer rounded-full transition-all",
                  current === index ? "bg-black" : "bg-[#D9D9D9]",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </Carousel>
  );
};

export { Skiper54 };
