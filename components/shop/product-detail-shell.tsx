"use client"

import { useEffect, useMemo, useState } from "react"

import { ProductDetailActions } from "@/components/shop/product-detail-actions"
import { ProductDetailGallery } from "@/components/shop/product-detail-gallery"
import { ProductRatingSummary } from "@/components/shop/product-rating-summary"
import type { ShopProduct } from "@/data/products"

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
})

function formatPrice(n: number) {
  return inr.format(n)
}

function reviewCountForProduct(popularityScore: number) {
  return Math.max(0, Math.floor(popularityScore / 4.2))
}

function uniqueImages(urls: string[]) {
  return Array.from(
    new Set(urls.map((x) => x.trim()).filter(Boolean))
  ).slice(0, 4)
}

export function ProductDetailShell({
  product,
  onlinePrepayAmount,
  shareText,
}: {
  product: ShopProduct
  onlinePrepayAmount: number
  shareText: string
}) {
  const variants = product.colorVariants
  const variantKey = variants.map((v) => v.color).join("\0")
  const [selectedColor, setSelectedColor] = useState(
    () => variants[0]?.color ?? ""
  )

  useEffect(() => {
    if (!variants.length) {
      setSelectedColor("")
      return
    }
    setSelectedColor((c) =>
      c && variants.some((v) => v.color === c) ? c : variants[0]!.color
    )
  }, [product.id, variantKey])

  const { main, rest } = useMemo(() => {
    if (!variants.length) {
      const imgs = uniqueImages([
        product.imageUrl,
        ...product.galleryImageUrls,
      ])
      const m = imgs[0] ?? product.imageUrl
      return { main: m, rest: imgs.slice(1) }
    }
    const v =
      variants.find((x) => x.color === selectedColor) ?? variants[0]!
    const imgs = uniqueImages([
      v.imageUrl,
      ...(v.galleryImageUrls ?? []),
    ])
    const m = imgs[0] ?? v.imageUrl
    return { main: m, rest: imgs.slice(1) }
  }, [product, variants, selectedColor])

  const reviewCount = reviewCountForProduct(product.popularityScore)
  const onlinePrepayFormatted = formatPrice(onlinePrepayAmount)

  return (
    <>
      <ProductDetailGallery
        imageUrl={main}
        galleryImageUrls={rest}
        title={product.title}
        discountPercent={product.discountPercent}
        isFeatured={product.isFeatured}
      />

      <div className="flex min-w-0 flex-col gap-4 lg:pt-1">
        <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[1.65rem] xl:text-3xl">
          {product.title}
        </h1>

        <ProductRatingSummary
          rating={product.averageRating}
          reviewCount={reviewCount}
        />

        <div className="flex flex-wrap items-baseline gap-2 gap-y-1 pt-1">
          <span className="text-lg text-muted-foreground line-through sm:text-xl">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-2xl font-bold text-blue-600 sm:text-3xl dark:text-blue-400">
            {formatPrice(product.discountPrice)}
          </span>
        </div>

        <section
          className="rounded-xl border border-border bg-card/60 p-4 shadow-sm sm:p-5"
          aria-labelledby="product-description-heading"
        >
          <h2
            id="product-description-heading"
            className="text-sm font-semibold uppercase tracking-wide text-foreground"
          >
            Description
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </section>

        {product.showStockUrgency ? (
          <p className="text-sm font-semibold text-orange-600 dark:text-orange-500">
            🔥 Hurry! Only {product.stockCount} left in stock – order soon!
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            In stock — ships after payment confirmation.
          </p>
        )}

        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Cash on delivery / prepaid delivery</li>
        </ul>

        <ProductDetailActions
          productId={product.id}
          title={product.title}
          shareText={shareText}
          onlinePrepayFormatted={onlinePrepayFormatted}
          onlinePrepayAmount={onlinePrepayAmount}
          imageUrl={main}
          unitPrice={product.discountPrice}
          sku={product.sku}
          colorVariants={product.colorVariants}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />

        <div className="space-y-1 border-t border-border pt-4 text-sm">
          <p className="text-muted-foreground">
            Category:{" "}
            <span className="font-semibold text-foreground">
              {product.category}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        </div>
      </div>
    </>
  )
}
