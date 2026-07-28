"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { SectionContainer } from "@/components/layout/section-container";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, CheckCircle2, Bookmark, Heart } from "lucide-react";

// Mock blog database
const BLOG_POSTS_DATA: Record<string, {
  title: string;
  subtitle?: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  published: string;
  readTime: string;
  tags: string[];
  image: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      highlight?: string;
      image?: string;
      imageCaption?: string;
    }[];
    takeaways: string[];
  };
}> = {
  "sustainability-and-why-you-should-care-about-it": {
    title: "Sustainability and Why you should care about it",
    author: "Anjali Lakra",
    authorRole: "Sustainability Advocate & Environmental Strategist",
    published: "Mar 21, 2023",
    readTime: "4 min read",
    tags: ["Sustainability", "Eco Friendly", "Zero Waste"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    content: {
      intro: "Sustainability is an act of love and care, for the place you call home — Mother Earth. Sustainability is about community living and not being hyper-individualistic. No man is an island, and we cannot thrive without caring for others.",
      sections: [
        {
          heading: "The Roadblock of Hyper-Individualism",
          body: [
            "Let me make this loud and clear. One of the biggest roadblocks to sustainability is the whole hyper-individualistic mindset people have.",
            "It’s not a me problem. It’s the government’s job to care. I am not responsible for it.",
            "But we are responsible. For all of it. Maybe some institutions or individuals are more responsible than others but sustainability is a problem that is going to take a collective effort for its best resolution."
          ]
        },
        {
          heading: "Why Do I Care and Why Should We All Care?",
          body: [
            "People will often question — Why do I even care? Why should I care? I don’t have time for all this.",
            "There have been countless articles, and papers on this topic. Environmental studies have been pushed to schools, colleges etc. But still every passing day, the problem is increasing and deteriorating the planet. Here, I’m writing one more article in the library of sustainability. “Why do I care and why should we all care?”",
            "Sustainability is an act of love. Not trying to romanticise it but can’t help it. It is!",
            "The planet is facing its worst crises. Pollution is at its peak. Many species are going extinct. We have huge landfills everywhere because the waste management system is so poor."
          ]
        },
        {
          heading: "Choosing Effort Over Convenience",
          body: [
            "Let’s be honest, in this day and age, it is difficult to find sustainable products as compared to non-sustainable ones. But we who care about the environment, still do. The system is designed in such a way that being environmentally friendly takes more effort and being ignorant of Mother Earth is the easier option.",
            "I can order my groceries from some same-day delivery app or from the supermarket next door. It’s simple and convenient. But because I love and care about the environment, I am putting that extra effort to google ‘plastic-free grocery alternatives near me’ and getting it from there. Some stores are far away and cannot provide same day delivery. Some will take a couple of days to deliver the order. But I choose to wait because I care about Mother Earth. And I really don’t know what to tell you. You should too. I’m kind of tired of seeing people who are least worried about the environment. I don’t want to sound preachy. Some of them are my best friends. I often wonder — how do I make them care?"
          ],
          highlight: "We have not inherited the land from our parents, we are borrowing it from our children."
        },
        {
          heading: "An Epiphany for Future Generations",
          body: [
            "Recently I had an epiphany. It is nothing groundbreaking and goes on the same lines — “We have not inherited the land from our parents, we are borrowing it from our children.”",
            "I have seen my friends who are in their late 20s — 30s planning their kids. They want to give their child everything. They are saving for the future. Taking insurance plans, investment plans etc, so their kids will not have any problems in the future. I think every parent loves their kids dearly and will do anything for them.",
            "We have to agree on the fact that over time, the environment is becoming worse and worse. The pollution is only increasing, and the rivers and seashores are only getting dirtier. Do you as a parent really want to leave that kind of earth for your children? If you can invest money for securing your child’s future financially, then why not invest in the environment so that they can live healthier lives?",
            "We have been seeing a rise in many lifestyle-based diseases, many of which have been triggered directly by pollution/climate change etc. You’re investing your life’s savings for your kids so they can have a peaceful life, but how come you’re ignoring the environmental aspect? Why would you not want your kids to enjoy the same clean earth which you did, but leave them with a dirtier and more harmful version of it?"
          ]
        },
        {
          heading: "Nothing Good Comes Without Effort",
          body: [
            "I don’t have any more emotional tactics left in me to convince you to be more environmentally conscious.",
            "And I completely understand. Many of us want to live a more sustainable life but there are some structural issues which need to be solved.",
            "Well, nothing good in life comes easy or without any effort. We need to put in the efforts if we want to see the results."
          ]
        }
      ],
      takeaways: [
        "Sustainability is about community living, not hyper-individualism.",
        "If you invest financially for your child's future, invest in the environment so they can live healthier lives.",
        "Nothing good in life comes easy—living sustainably takes collective effort."
      ]
    }
  },
  "the-culture-of-free-and-sustainability": {
    title: "The Culture of “Free” and Sustainability",
    author: "Anjali Lakra",
    authorRole: "Sustainability Advocate & Environmental Strategist",
    published: "Mar 28, 2023",
    readTime: "3 min read",
    tags: ["Fast Fashion", "Sustainability", "Free", "Overconsumption", "Capitalism"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop",
    content: {
      intro: "A friend reached out and asked me about how she should price her classes. I told her that you could lure more clients by giving them a demo class. She was just starting off with her classes and asked if she should give classes for free — to the first few clients. I was immediately like — no do not do that. When you give the demo class charge for the demo as well.",
      sections: [
        {
          heading: "Filtering the Serious from the Casual",
          body: [
            "She asked— Why? People are giving free demo classes. Many institutions do that. I simply told her — Those institutions have the financial backing to give freebies, you do not, so don’t do it.",
            "Is she reducing the number of clients through this: Maybe yes or maybe not. But through this, she can definitely filter out people who are not serious about joining her class. Because people who will pay, are definitely serious about it."
          ]
        },
        {
          heading: "The Pitfall of Free Culture",
          body: [
            "Now I am a freelance photographer, you see. Initially, when I started with photography, I used to do free shoots. And that was the worst mistake of my life. I helped propagate the “free” culture.",
            "You see — when you get something for free or, are not paying the true value of the product or service, you will not value that product.",
            "You know when I was in college; I used to buy clothes like buying groceries. I never thought twice because I would get clothes for dirt-cheap prices from flea markets. I would have this mindset - I can wear this t-shirt and literally throw it away because it’s so cheap!!!! Oh God, how wasteful I was."
          ]
        },
        {
          heading: "Fast Fashion & The Detrimental Race to the Bottom",
          body: [
            "I’m trying to overcome that mindset but this is the same mindset most of us girls have, thanks to the Fast Fashion stores that are driving the price of their products lower and lower (while also driving down the quality of clothes).",
            "This whole culture of getting work done for free or at ‘low cost’ is detrimental.",
            "All we consumers want is to buy products as cheaply as possible. What does that make the corporations do? Thrive to reduce costs by hook or crook. (Many a time by paying bare minimum wages to its employees, and let me tell you that minimum wage is not enough for sustenance. And no, you cannot work hard or save your way out of poverty)"
          ],
          highlight: "Fortunately or unfortunately, the price we pay for a product is directly proportional to its value. If we are getting things for free, there will definitely be a lot of wasteful use."
        },
        {
          heading: "Overconsumption & Throwaway Mindsets",
          body: [
            "The disposable culture is being propagated to us — single-use products. The more disposable the product is, the lesser we value it. This is also driving our generation to go into overconsumption mode.",
            "“Let me buy this because it's cheap.”",
            "How many times have you gone to a restaurant and ordered food because everything was so affordable and ended up wasting half of it because you ended up overestimating your capacity to consume?",
            "How many times have you ordered groceries because it was on sale and never ended up consuming them?",
            "How many times have you ordered n number of clothes because they were on sale? And honestly answer, how many times did you end up wearing those clothes? And also do tell me if you even like half of those clothes."
          ],
          image: "/images/i-have-nothing-to-wear.jpg",
          imageCaption: "(The meme is nothing but a result of overconsumption and throwaway culture.)"
        },
        {
          heading: "Nothing in This World is Free",
          body: [
            "Let me end this by drawing two parallels.",
            "We all love freebies.",
            "Everything has a cost and nothing in this world is free. If you don’t bear the cost, someone else will."
          ]
        }
      ],
      takeaways: []
    }
  },
  "a-note-to-current-and-future-parents": {
    title: "A Note to Current and Future Parents",
    author: "Anjali Lakra",
    authorRole: "Sustainability Advocate & Environmental Strategist",
    published: "Sep 27, 2023",
    readTime: "4 min read",
    tags: ["Sustainability", "Parents", "Children", "Climate Change", "Earth"],
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop",
    content: {
      intro: "As bleak or pessimistic it sounds, your kids are not going to have a good future if we don’t take immediate action towards climate change. You all might have heard this quote — “We borrow the earth from our grandchildren”. The earth you live in is borrowed from future generations. Are you taking enough care of it?",
      sections: [
        {
          heading: "Ignorance Will Not Change the Truth",
          body: [
            "Climate crisis is getting worse and worse. We all have witnessed it. But we just choose to ignore it. The truth doesn’t change because of ignorance. If you’re not going to acknowledge it, it is going to bite you sooner than later.",
            "I am sure all of you are saving money for your kids’ bright future. But what future if you’re going to destroy the planet. And no, you can’t be delusional to think we will magically discover life(as rich as the one on Earth) on Mars and shift there when Earth gets destroyed. First learn to take care of the planet which you have and then think about futuristic things."
          ]
        },
        {
          heading: "Money Cannot Buy Clean Air or Water",
          body: [
            "Money is not the only kind of investment you can do. Money cannot save your kids when the air outside is too polluted to breathe. You can install multiple air purifiers, wear masks to lessen the problem but you cannot shield your kids from it. Is that the kind of life you want to imagine for your kids? Suffocating and finding it hard to breathe because the air is too polluted?",
            "You can buy AC to get temporary relief from heat. But how are you going to install air conditioners outside? Or you’re going to avoid going outside completely and lock yourself inside your homes, because the heat outside is unbearable."
          ]
        },
        {
          heading: "The Reality Across Our Cities and Tourist Hubs",
          body: [
            "Cities of India have seen a massive shift in temperature. The AQI has been degrading, pollution is on the rise, our cities have been clogged by plastic waste everywhere. The effects of the environmental degradation can be seen in the quality of food we consume too. It has become less nutritious than before. Multiple diseases are on the rise because of it.",
            "These days, all the tourist places are extremely polluted. If you visit a place after a few years gap, you’ll notice how much it has changed for worse. I’ve heard people say — “Abhi ghum lo, baad mei accha nahi rahega.” Are you seriously this selfish that you want to visit these places before it gets too crowded, commercialised and exploited but will do nothing to stop the madness? The hill stations of north India has witnessed the worse of climate change. Incessant floods have destroyed so many lives and livelihoods. All results of climate change. As a tourist, we go to places but pay no heed to make sure we leave the place as it was. Do you not want to keep these places intact for your kids and future generations?"
          ]
        },
        {
          heading: "Demanding Systemic Policy Change & Individual Mindfulness",
          body: [
            "There are lot of action one can take at an individual level as well as a community level. But first we need to stop living in ignorance and accept that the problem exists. Please read about the problem that exists and acknowledge it. Get as much in depth knowledge about the problem as you can. The solution is there, but it will take a massive effort from each one of us. We need to become more mindful of all our individual actions and how it affects the planet but also fight for systematic change and ask our leaders to bring policy change.",
            "I hope next time when you’re purchasing your grocery items and it comes in plastic, you’ll realise that that piece of plastic is not going to disappear from Earth for hundreds of years. Even if it decomposes, it becomes microplastic — it will enter the soil and water system and eventually the food system. The fruit and vegetables you eat, has that plastic. The seafood also has the same plastic. You and your kids are going to consume the same plastic infused food which is eventually going to degrade their health. I hope this is a good enough reason to convince you to ask for policy action. Ask the manufactures to stop using plastic."
          ],
          highlight: "It’s kinda comforting to know that money cannot shield us from climate change. Elon Musk and Ambanis are also eating the same microplastic laden food, breathing the same polluted air. Even being the richest person on the planet is not going to shield you from Climate change."
        },
        {
          heading: "A Final Question to Every Parent",
          body: [
            "I am sure each one of you would give up on your life if it means saving the life of your kids. But will you take the responsibility, take action, fight the system which is destroying the planet if it meant that your kids will have a better future?"
          ]
        }
      ],
      takeaways: []
    }
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "sustainability-and-why-you-should-care-about-it";
  const post = BLOG_POSTS_DATA[slug] || BLOG_POSTS_DATA["sustainability-and-why-you-should-care-about-it"];

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
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
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
