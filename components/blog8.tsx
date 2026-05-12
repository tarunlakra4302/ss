import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  tags?: string[];
}

interface Blog8Props {
  heading?: string;
  description?: string;
  posts?: Post[];
}

const Blog8 = ({
  heading = "Blog Posts",
  description = "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.",
  posts = [
    {
      id: "post-1",
      title: "The Future of Eco-Friendly Web Design",
      summary: "How to minimize carbon footprints without sacrificing premium aesthetics and high-performance functionality in modern web applications.",
      label: "Sustainability",
      author: "Sustainable Sundays",
      published: "24 Mar 2024",
      url: "#",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      tags: ["Design", "Sustainability"],
    },
    {
      id: "post-2",
      title: "GSAP Masterclass: Liquid Animations",
      summary: "A deep dive into creating fluid motion effects that captivate users and elevate the digital experience through intentional animation.",
      label: "Technology",
      author: "Creative Team",
      published: "20 Mar 2024",
      url: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      tags: ["GSAP", "Animation"],
    },
  ],
}: Blog8Props) => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-16">
        <div className="text-center">
          <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20 w-full">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.15, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="sm:col-span-12 lg:col-span-10 lg:col-start-2"
            >
              <Card
                className="order-last border-0 bg-transparent shadow-none sm:order-first"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground md:gap-5 lg:gap-6">
                        {post.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                      <a
                        href={post.url}
                        className="hover:underline"
                      >
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-4 text-muted-foreground md:mt-5">
                      {post.summary}
                    </p>
                    <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                      <span className="text-muted-foreground">{post.author}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {post.published}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center space-x-2 md:mt-8">
                      <a
                        href={post.url}
                        className="inline-flex items-center font-semibold hover:underline md:text-base"
                      >
                        <span>Read more</span>
                        <ArrowRight className="ml-2 size-4 transition-transform" />
                      </a>
                    </div>
                  </div>
                  <div className="order-first sm:order-last sm:col-span-5">
                    <a href={post.url} className="block group">
                      <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog8 };
