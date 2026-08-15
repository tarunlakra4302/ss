import { GradientBackground } from "@/components/ui/silk-blend-gradient"

export default function GradientBackgroundDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-8">
      <div className="relative h-[440px] w-full max-w-4xl overflow-hidden rounded-xl border border-white/20 shadow-2xl">
        <GradientBackground className="h-full w-full" />
      </div>
    </div>
  )
}
