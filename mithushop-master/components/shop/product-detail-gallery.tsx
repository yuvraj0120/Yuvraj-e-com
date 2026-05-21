"use client"

import Image from "next/image"
import { useState } from "react"

import { buildProductGallerySlides } from "@/lib/product-gallery"
import { cn } from "@/lib/utils"

type Props = {
  imageUrl: string
  galleryImageUrls?: string[]
  title: string
  discountPercent: number
  isFeatured: boolean
}

export function ProductDetailGallery({
  imageUrl,
  galleryImageUrls = [],
  title,
  discountPercent,
  isFeatured,
}: Props) {
  const slides = buildProductGallerySlides(imageUrl, galleryImageUrls)
  const [active, setActive] = useState(0)
  const mainSrc = slides[active]?.mainSrc ?? imageUrl

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <ul
        className="m-0 flex list-none flex-row gap-2 p-0 sm:w-[5.25rem] sm:flex-col sm:shrink-0 sm:overflow-visible"
        aria-label="Product images"
      >
        {slides.map((slide, i) => (
          <li key={i} className="shrink-0">
            <button
              type="button"
              aria-current={active === i ? true : undefined}
              aria-label={`View product image ${i + 1}`}
              onClick={() => setActive(i)}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-all sm:size-[4.5rem]",
              active === i
                ? "border-blue-600 ring-2 ring-blue-600/25"
                : "border-transparent opacity-80 hover:opacity-100"
            )}
          >
            <Image
              src={slide.thumbSrc}
              alt=""
              fill
              className="object-cover"
              sizes="72px"
            />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-xl border border-border bg-muted/40 shadow-inner sm:min-h-[min(72vw,420px)] lg:aspect-square lg:min-h-0">
        <Image
          src={mainSrc}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 55vw, 520px"
        />
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-2">
          {discountPercent > 0 ? (
            <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
              -{discountPercent}%
            </span>
          ) : null}
          {isFeatured ? (
            <span className="rounded-md bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
              Featured
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
