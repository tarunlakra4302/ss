"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { SectionContainer } from "@/components/layout/section-container";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, Bookmark, Heart } from "lucide-react";
import type { BlogPost } from "@/lib/data/blog-data";

export function BlogPostContent({ post }: { post: BlogPost }) {
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full mt-4 sm:mt-6 pt-2 pb-12 bg-background text-foreground min-h-screen">
        <SectionContainer className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4"
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to all articles
            </Link>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/10 dark:border-white/10"
              >
                <Tag className="w-3 h-3 mr-1.5 opacity-60" />
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Subtitle */}
          {post.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8"
            >
              {post.subtitle}
            </motion.p>
          )}

          {/* Meta bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-border mb-10 text-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {post.author}
                </div>
                <div className="text-xs text-muted-foreground">{post.authorRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{post.published}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 border border-border shadow-lg"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Article Body */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-8"
          >
            {/* Intro */}
            <p className="text-xl font-normal leading-relaxed text-foreground/80 border-l-4 border-emerald-500 pl-6 py-1 italic bg-emerald-500/5 rounded-r-lg">
              {post.content.intro}
            </p>

            {/* Sections */}
            {post.content.sections.map((section, idx) => (
              <div key={idx} className="space-y-4 pt-4">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                {section.body.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.highlight && (
                  <blockquote className="my-6 text-foreground font-semibold text-xl md:text-2xl italic text-center leading-relaxed">
                    "{section.highlight}"
                  </blockquote>
                )}
                {section.image && (
                  <figure className="my-8 flex flex-col items-center">
                    <div className="overflow-hidden rounded-2xl border border-border shadow-md max-w-md w-full">
                      <img
                        src={section.image}
                        alt={section.imageCaption || "Article illustration"}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {section.imageCaption && (
                      <figcaption className="mt-3 text-sm text-center text-muted-foreground italic">
                        {section.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>
            ))}
          </motion.article>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-6 border-t border-border mt-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  liked
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-rose-500" : ""}`} />
                {liked ? "Liked" : "Like"}
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  saved
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-500" : ""}`} />
                {saved ? "Saved" : "Save"}
              </button>
            </div>

            <button
              onClick={() => {
                if (typeof window !== "undefined" && navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  }).catch(() => {});
                } else if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Article link copied to clipboard!");
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </SectionContainer>
      </main>
    </>
  );
}
