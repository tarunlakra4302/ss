import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface NewsletterSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

export function NewsletterSection({
  title = "Your Next Sunday is Waiting.",
  className,
  ...props
}: NewsletterSectionProps) {
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 md:py-32",
        "overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="dark relative overflow-hidden rounded-xl bg-zinc-900 px-4 py-8 md:px-12 md:py-14">
          <Image
            src="/images/events/Kitchen Secrets_26 July 2026 (B).jpg"
            alt="Zero Waste Food Prep"
            fill
            className="object-cover object-[center_20%]"
          />
          <div className="relative z-10">
            <h2 className="mb-6 text-xl/[1.1] font-extrabold tracking-tight text-foreground md:text-2xl/[1.1]">
              {title}
            </h2>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] hover:bg-neutral-100 hover:shadow-lg hover:shadow-black/20 active:scale-[0.97] select-none relative overflow-hidden will-change-transform"
            >
              {/* Shimmer highlight on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none" />

              <span className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0.5">
                Contact Us
              </span>

              <span className="relative z-10 w-5 h-5 rounded-full bg-black/10 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:bg-black group-hover:text-white group-hover:translate-x-1 shrink-0">
                <ArrowRight className="w-3 h-3 transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-rotate-45" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
