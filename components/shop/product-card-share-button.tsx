"use client"

import { Share08Icon } from "@hugeicons/core-free-icons"

import { site } from "@/config/site"
import { HugeIcon } from "@/components/ui/huge-icon"
import { productDetailPath } from "@/data/products"
import { cn } from "@/lib/utils"

type Props = {
  /** `ShopProduct.id` */
  productId: string
  title: string
  /** Body line for share sheet (e.g. price + SKU) */
  text: string
  className?: string
}

function absoluteProductUrl(productId: string): string {
  if (typeof window === "undefined") return ""
  const path = productDetailPath(productId)
  return new URL(path, window.location.origin).href
}

export function ProductCardShareButton({
  productId,
  title,
  text,
  className,
}: Props) {
  return (
    <button
      type="button"
      aria-label={`Share ${title}`}
      className={cn(
        "absolute top-2 right-2 z-10 flex size-9 items-center justify-center rounded-full",
        "bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      onClick={() => {
        const url = absoluteProductUrl(productId)
        if (!url) return

        const shareText = `${text}\n${site.name}`

        if (navigator.share) {
          void navigator.share({
            title,
            text: shareText,
            url,
          })
        } else if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(`${title}\n${url}`)
        }
      }}
    >
      <HugeIcon icon={Share08Icon} size={18} />
    </button>
  )
}
