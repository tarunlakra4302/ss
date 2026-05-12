"use client";
import { Navbar } from '@/components/navigation/navbar'
import { SectionContainer } from '@/components/layout/section-container'
import { motion } from 'framer-motion'
import { Blog8 } from '@/components/blog8'

const BlogPage = () => {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full mt-20">
      <SectionContainer className="min-h-[60vh] flex items-center justify-center bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center space-y-8 relative z-20"
        >
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black">
              Our <br /> <span className="text-black/40">Blog</span>
            </h1>
          </div>
          
          <p className="max-w-[700px] text-xl md:text-2xl text-black/70 font-medium leading-relaxed tracking-tight">
            Explore our latest thoughts on sustainable design, technological innovation, and the future of digital architecture.
          </p>

          <div className="flex flex-col items-center gap-2 pt-4">
            <span className="text-xs uppercase tracking-[0.2em] text-black/50 font-bold">Scroll Down</span>
            <span className="text-black/50 animate-bounce">↓</span>
          </div>
        </motion.div>
      </SectionContainer>
      
      <Blog8 heading="" description="" />

    </main>
    </>
  )
}

export default BlogPage
