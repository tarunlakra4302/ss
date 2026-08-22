import { Suspense } from "react";
import { EventDetail } from "@/features/event/event-detail";
import { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | Sustainable Sundays`,
    description: `Join us for ${slug.replace(/-/g, ' ')} and support sustainable initiatives.`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return (
    <div className="flex-1 w-full bg-white">
      <Navbar />
      <Suspense fallback={null}>
        <EventDetail slug={slug} />
      </Suspense>
    </div>
  );
}
