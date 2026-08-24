import { cn } from "@/lib/utils"
import ButtonWithIcon from "@/components/ui/button-with-icon"
import Link from "next/link"
import Image from "next/image"

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
            <ButtonWithIcon label="Contact Us" asChild>
              <Link href="/contact" />
            </ButtonWithIcon>
          </div>
        </div>
      </div>
    </section>
  )
}


