"use client";
import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MotionLink = motion.create(Link);

/**
 * @interface Article
 * Defines the structure for a single article card.
 */
interface Article {
  id: string | number;
  imageSrc: string;
  title: string;
  linkText: string;
  linkHref: string;
}

import { cn } from '@/lib/utils';

/**
 * @interface ArticleCardGridProps
 * Defines the props for the ArticleCardGrid component.
 */
interface ArticleCardGridProps {
  title?: string;
  articles: Article[];
  className?: string;
}

/**
 * A responsive grid of article cards with a title.
 * Features animations on load and hover.
 */
export const ArticleCardGrid: React.FC<ArticleCardGridProps> = ({ title, articles, className }) => {
  // Animation variant for the grid container to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variant for each card item
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
    <section className={cn("w-full max-w-6xl mx-auto py-12 px-4 md:px-6 bg-background text-foreground", className)}>
      {title && (
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          {title}
        </h2>
      )}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {articles.map((article) => (
          <MotionLink
            key={article.id}
            href={article.linkHref}
            className="group block overflow-hidden rounded-lg bg-card border hover:border-primary/50 transition-colors duration-300"
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Card Image */}
              <div className="overflow-hidden">
                 <img
                    src={article.imageSrc}
                    alt={article.title}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex-grow">
                  {article.title}
                </h3>
                <div className="relative flex items-center gap-1 overflow-hidden rounded-full border border-primary/10 bg-transparent px-6 py-2 text-xs font-black uppercase tracking-widest text-[#111111] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:border-transparent group-hover:text-white mt-auto w-fit">
                  {/* Left arrow (arr-2) */}
                  <ArrowRight 
                    className="absolute w-3.5 h-3.5 left-[-25%] stroke-[#111111] fill-none z-[9] group-hover:left-3 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
                  />

                  {/* Text */}
                  <span className="relative z-[1] -translate-x-0 group-hover:translate-x-3 pr-4 transition-all duration-[800ms] ease-out">
                    {article.linkText}
                  </span>

                  {/* Circle */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-[50%] opacity-0 group-hover:w-[150%] group-hover:h-[150%] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"></span>

                  {/* Right arrow (arr-1) */}
                  <ArrowRight 
                    className="absolute w-3.5 h-3.5 right-3 stroke-[#111111] fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
                  />
                </div>
              </div>
            </div>
          </MotionLink>
        ))}
      </motion.div>
    </section>
  );
};