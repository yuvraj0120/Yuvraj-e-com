import Image from "next/image"
import Link from "next/link"

import { buildHomeBrowseQuery } from "@/data/products"
import { cn } from "@/lib/utils"

function categoryImageUrl(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  const seed = slug ? `mithu-shop-cat-${slug}` : "mithu-shop-cat"
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/800`
}

function categoryBrowseHref(category: string) {
  return `/${buildHomeBrowseQuery(category)}`
}

type Props = {
  categoryNames: string[]
}

export function HomeShopByCategory({ categoryNames }: Props) {
  return (
    <section
      className="border-t border-border bg-muted/30 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      aria-labelledby="shop-by-category-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="shop-by-category-heading"
          className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Shop by category
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          Pick a category to see everything we stock in that range.
        </p>

        {categoryNames.length === 0 ? (
          <p className="mx-auto mt-8 max-w-md rounded-xl border border-dashed border-border bg-background/80 px-4 py-10 text-center text-sm text-muted-foreground sm:mt-10">
            Categories will appear here once they are added in the admin.
          </p>
        ) : (
        <ul
          className={cn(
            "mt-8 grid gap-3 sm:mt-10 sm:gap-4",
            categoryNames.length <= 2
              ? "grid-cols-2"
              : categoryNames.length === 3
                ? "grid-cols-2 md:grid-cols-3"
                : categoryNames.length === 4
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          )}
        >
          {categoryNames.map((category) => (
            <li key={category} className="min-w-0">
              <Link
                href={categoryBrowseHref(category)}
                aria-label={`View all products in ${category}`}
                className={cn(
                  "group relative block aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
                  "outline-none transition-[box-shadow,transform] duration-300",
                  "hover:z-10 hover:shadow-lg hover:shadow-black/10",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <Image
                  src={categoryImageUrl(category)}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20"
                  aria-hidden
                />
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center px-2 text-center",
                    "text-xs font-bold uppercase tracking-[0.2em] text-white drop-shadow-md",
                    "sm:text-sm md:text-base"
                  )}
                >
                  {category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        )}
      </div>
    </section>
  )
}
