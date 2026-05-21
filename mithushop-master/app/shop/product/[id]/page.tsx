import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { site } from "@/config/site"
import { ProductDetailShell } from "@/components/shop/product-detail-shell"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { getProductById } from "@/data/products"
import { onlinePrepayAmount } from "@/lib/partial-payment"

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
})

function formatPrice(n: number) {
  return inr.format(n)
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(decodeURIComponent(id))
  if (!product) return { title: "Product" }
  const metaDesc =
    product.description.length > 155
      ? `${product.description.slice(0, 152)}…`
      : product.description

  return {
    title: `${product.title} | Shop`,
    description: `${metaDesc} ${product.sku} · ${site.name}.`,
    openGraph: {
      title: product.title,
      description: metaDesc,
      images: [{ url: product.imageUrl, width: 400, height: 400 }],
    },
  }
}

export default async function ShopProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProductById(decodeURIComponent(id))
  if (!product) notFound()

  const onlinePrepay = onlinePrepayAmount(product.discountPrice)
  const shareText = `${formatPrice(product.discountPrice)} · SKU ${product.sku}`

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-b from-muted/25 via-background to-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6 -ml-2 inline-flex text-muted-foreground"
          )}
        >
          ← Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 xl:gap-14">
          <ProductDetailShell
            product={product}
            onlinePrepayAmount={onlinePrepay}
            shareText={shareText}
          />
        </div>

        <section
          id="reviews"
          className="mt-14 scroll-mt-24 rounded-xl border border-border bg-card/50 p-6 shadow-sm sm:mt-20 sm:p-8"
        >
          <h2 className="text-lg font-bold text-foreground">
            Customer reviews
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Written reviews will appear here once orders go live. Star ratings
            above reflect current catalog data.
          </p>
        </section>
      </div>
    </main>
  )
}
