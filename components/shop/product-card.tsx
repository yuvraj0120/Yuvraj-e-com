import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { productDetailPath, type ShopProduct } from "@/data/products"
import { cn } from "@/lib/utils"

import { ProductCardImageHoverActions } from "./product-card-image-hover-actions"
import { ProductCardShareButton } from "./product-card-share-button"

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
})

function formatPrice(n: number) {
  return inr.format(n)
}

function SkewTag({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-block -skew-x-12 rounded-sm px-2.5 py-0.5 shadow-sm",
        className
      )}
    >
      <span className="inline-block skew-x-12 text-[11px] font-bold tracking-wide text-black">
        {children}
      </span>
    </span>
  )
}

export function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="group/image relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover/image:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/image:scale-100"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <ProductCardImageHoverActions
          productId={product.id}
          productTitle={product.title}
          imageUrl={product.imageUrl}
          unitPrice={product.discountPrice}
          sku={product.sku}
          colorVariants={product.colorVariants}
        />
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
          {product.isFeatured ? (
            <span className="w-fit rounded-md bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              Featured
            </span>
          ) : null}
          {product.discountPercent > 0 ? (
            <span className="w-fit rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>
        <ProductCardShareButton
          productId={product.id}
          title={product.title}
          text={`${formatPrice(product.discountPrice)} · SKU ${product.sku}`}
          className="z-20"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {product.isRecommended ? (
            <SkewTag className="bg-cyan-400">Recommended</SkewTag>
          ) : null}
          {product.isNew ? (
            <SkewTag className="bg-orange-400">New</SkewTag>
          ) : null}
        </div>

        <h3 className="text-base font-bold leading-snug text-foreground">
          <Link
            href={productDetailPath(product.id)}
            className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            {product.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{product.category}</span>
          {" · "}
          SKU: {product.sku}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(product.discountPrice)}
          </span>
        </div>

        {product.showStockUrgency ? (
          <p className="text-sm font-bold text-red-600 dark:text-red-500">
            🔥 Hurry! Only {product.stockCount} left in stock!
          </p>
        ) : null}
      </div>
    </article>
  )
}
