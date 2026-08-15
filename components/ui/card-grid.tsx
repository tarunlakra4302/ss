"use client";
import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CardItem {
  id?: string | number;
  title: string;
  imageSrc: string;
  linkText?: string;
  linkHref?: string;
}

export const defaultCards: CardItem[] = [
  {
    id: 1,
    title: 'Climbing Adventures',
    imageSrc: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop',
    linkText: 'Learn more',
    linkHref: '/blog',
  },
  {
    id: 2,
    title: 'Become a member',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
    linkText: 'Learn more',
    linkHref: '/become-a-volunteer',
  },
  {
    id: 3,
    title: 'Volunteer',
    imageSrc: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop',
    linkText: 'Learn more',
    linkHref: '/become-a-volunteer',
  },
];

interface ArticleCardGridProps {
  title?: string;
  articles?: CardItem[];
  className?: string;
}

export const ArticleCardGrid: React.FC<ArticleCardGridProps> = ({
  title,
  articles = defaultCards,
  className,
}) => {
  const cardsToDisplay = articles && articles.length > 0 ? articles : defaultCards;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section className={cn("w-full bg-[#FFFFFF] py-12", className)}>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-neutral-900">
            {title}
          </h2>
        )}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cardsToDisplay.map((card, index) => {
            const href = card.linkHref || '/';
            const actionText = card.linkText || 'Learn more';

            return (
              <motion.div
                key={card.id ?? index}
                variants={itemVariants}
                className="w-full"
              >
                <Link
                  href={href}
                  className="relative block w-full aspect-[3/4] h-[520px] md:h-[560px] overflow-hidden rounded-2xl cursor-pointer group shadow-lg"
                >
                  {/* Full-bleed background image */}
                  <img
                    src={card.imageSrc}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Gradient Overlay (for text legibility) */}
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Card Header Title (Top-Left) */}
                  <h3 className="absolute top-6 left-6 z-10 text-white font-semibold text-xl md:text-2xl tracking-tight pr-6">
                    {card.title}
                  </h3>

                  {/* Bottom Glassmorphic CTA Bar */}
                  <div className="absolute inset-x-4 bottom-4 z-10 h-14 rounded-xl px-5 flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300">
                    <span className="text-white text-sm md:text-base font-normal tracking-normal">
                      {actionText}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};