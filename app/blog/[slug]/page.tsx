import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS_DATA } from "@/lib/data/blog-data";
import { BlogPostContent } from "@/components/blog/blog-post-content";

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_DATA[slug];

  if (!post) {
    return {
      title: "Blog | Sustainable Sundays",
    };
  }

  return {
    title: `${post.title} | Sustainable Sundays`,
    description: post.subtitle || post.content.intro.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.subtitle || post.content.intro.slice(0, 160),
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS_DATA[slug];

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
