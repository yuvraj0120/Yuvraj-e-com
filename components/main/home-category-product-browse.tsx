import Link from "next/link"

import { ProductCard } from "@/components/shop/product-card"
import {
  buildHomeBrowseQuery,
  filterProductsByCategory,
  getAllShopProducts,
  SHOP_ALL_CATEGORY,
  type ShopCategoryFilter,
} from "@/data/products"
import { cn } from "@/lib/utils"

type Props = {
  activeCategory: ShopCategoryFilter
  categoryNames: string[]
}

export async function HomeCategoryProductBrowse({
  activeCategory,
  categoryNames,
}: Props) {
  const browseCategories: ShopCategoryFilter[] = [
    SHOP_ALL_CATEGORY,
    ...categoryNames,
  ]
  const allProducts = await getAllShopProducts()
  const products = filterProductsByCategory(
    allProducts,
    activeCategory === "All" ? "All" : activeCategory
  )

  return (
    <section
      className="border-t border-border bg-background px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="home-browse-products-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="home-browse-products-heading"
          className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Browse products
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCategory === "All"
            ? "All categories"
            : `${activeCategory} only`}{" "}
          · {products.length} item{products.length !== 1 ? "s" : ""}
        </p>

        <div className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:gap-10">
          <nav
            className={cn(
              "lg:w-56 lg:shrink-0",
              "lg:sticky lg:top-20 lg:z-10 lg:self-start",
              "lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:rounded-xl lg:bg-background lg:py-1 lg:pr-1"
            )}
            aria-label="Filter by category"
          >
            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:block">
              Categories
            </p>
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {browseCategories.map((cat) => {
                const active = cat === activeCategory
                const href = `/${buildHomeBrowseQuery(cat)}`
                return (
                  <li key={cat}>
                    <Link
                      href={href}
                      scroll={false}
                      className={cn(
                        "block rounded-xl border px-3 py-2 text-sm font-medium transition-colors lg:rounded-lg lg:px-3 lg:py-2.5",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      )}
                    >
                      {cat}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="min-w-0 flex-1">
            {products.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground">
                No products in this category.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <li key={product.id} className="min-w-0">
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
