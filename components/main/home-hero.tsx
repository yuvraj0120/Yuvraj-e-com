"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

/** Up to 4 banners — Picsum seeds keep images stable; replace URLs with your assets. */
const BANNER_IMAGES = [
  "https://picsum.photos/seed/Yuvraj-e-com-hero-1/1600/520",
  "https://picsum.photos/seed/Yuvraj-e-com-hero-2/1600/520",
  "https://picsum.photos/seed/Yuvraj-e-com-hero-3/1600/520",
  "https://picsum.photos/seed/Yuvraj-e-com-hero-4/1600/520",
] as const

const ROTATE_MS = 5000
const count = BANNER_IMAGES.length

export function HomeHero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (motionQuery.matches || count <= 1) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, ROTATE_MS)

    return () => window.clearInterval(id)
  }, [index])

  const goPrev = () => {
    setIndex((i) => (i - 1 + count) % count)
  }

  const goNext = () => {
    setIndex((i) => (i + 1) % count)
  }

  return (
    <section
      aria-label="Featured banner"
      aria-roledescription="carousel"
      className="flex flex-col"
    >
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/10] min-h-[240px] w-full max-h-[min(70vh,560px)] md:aspect-[21/9] md:max-h-[520px]">
          {BANNER_IMAGES.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              aria-hidden={i !== index}
              className={cn(
                "object-cover transition-opacity duration-700 ease-in-out",
                i === index ? "z-[2] opacity-100" : "z-[1] opacity-0"
              )}
              sizes="100vw"
            />
          ))}

          {/* Light bottom fade so dots stay visible on bright photos */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-20 bg-gradient-to-t from-background/35 to-transparent"
          />

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous banner image"
                className={cn(
                  "absolute top-1/2 left-2 z-20 flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full md:left-4 md:size-12",
                  "border border-white/35 bg-black/45 text-white shadow-lg backdrop-blur-md",
                  "transition-colors hover:bg-black/60 active:bg-black/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                )}
              >
                <ChevronLeft className="size-6 md:size-7" strokeWidth={2.25} aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next banner image"
                className={cn(
                  "absolute top-1/2 right-2 z-20 flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full md:right-4 md:size-12",
                  "border border-white/35 bg-black/45 text-white shadow-lg backdrop-blur-md",
                  "transition-colors hover:bg-black/60 active:bg-black/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                )}
              >
                <ChevronRight className="size-6 md:size-7" strokeWidth={2.25} aria-hidden />
              </button>
            </>
          ) : null}

          {count > 1 ? (
            <div
              className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1 md:bottom-6 md:gap-1.5"
              role="group"
              aria-label="Choose banner slide"
            >
              {BANNER_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show banner image ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => setIndex(i)}
                  className="flex h-9 min-w-9 touch-manipulation items-center justify-center rounded-full p-0"
                >
                  <span
                    className={cn(
                      "block h-2 w-2 rounded-full transition-all",
                      i === index
                        ? "scale-125 bg-primary"
                        : "bg-foreground/30 hover:bg-foreground/50"
                    )}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

    </section>
  )
}
