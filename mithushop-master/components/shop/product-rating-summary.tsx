import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  rating: number
  reviewCount: number
  className?: string
}

export function ProductRatingSummary({
  rating,
  reviewCount,
  className,
}: Props) {
  const display = Math.min(5, Math.max(0, Math.round(rating)))

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <div
        className="flex gap-0.5"
        aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < display
          return (
            <Star
              key={i}
              className={cn(
                "size-[1.15rem] shrink-0 stroke-amber-500/80",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted/25 text-muted-foreground/45"
              )}
            />
          )
        })}
      </div>
      <a
        href="#reviews"
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        ( {reviewCount} Reviews )
      </a>
    </div>
  )
}
