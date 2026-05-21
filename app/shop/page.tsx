import type { Metadata } from "next"
import Link from "next/link"

import { ProductCard } from "@/components/shop/product-card"
import { ShopSortSelect } from "@/components/shop/shop-sort-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import {
  buildShopQuery,
  filterProductsByCategory,
  getAllShopProducts,
  getShopCategoryNames,
  paginateProducts,
  parseShopCategoryParam,
  parseShopSort,
  SHOP_ALL_CATEGORY,
  SHOP_PAGE_SIZE,
  sortProducts,
  type ShopCategoryFilter,
} from "@/data/products"

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse mobiles, accessories, audio, wearables, and smart home at Mithu Mobile Center.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>
}) {
  const sp = await searchParams
  const categoryNames = await getShopCategoryNames()
  const category = parseShopCategoryParam(sp.category, categoryNames)
  const shopCategoryPills: ShopCategoryFilter[] = [
    SHOP_ALL_CATEGORY,
    ...categoryNames,
  ]
  const sort = parseShopSort(sp.sort)
  const pageNum = Math.max(1, parseInt(sp.page ?? "1", 10) || 1)

  const shopProducts = await getAllShopProducts()
  const filteredBase = filterProductsByCategory(shopProducts, category)

  const filtered = sortProducts(filteredBase, sort)

  const { slice, totalPages, page } = paginateProducts(
    filtered,
    pageNum,
    SHOP_PAGE_SIZE
  )

  const q = (pageOverride: string) =>
    buildShopQuery({ category, sort, page: pageOverride })

  const prevPage = page > 1 ? String(page - 1) : null
  const nextPage = page < totalPages ? String(page + 1) : null

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Shop
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} products
              {category !== SHOP_ALL_CATEGORY ? ` in ${category}` : ""}
            </p>
          </div>
          <ShopSortSelect category={category} sort={sort} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {shopCategoryPills.map((cat) => {
            const active = cat === category
            const href =
              "/shop" +
              buildShopQuery({
                category: cat,
                sort,
                page: 1,
              })
            return (
              <Link
                key={cat}
                href={href || "/shop"}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {cat}
              </Link>
            )
          })}
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {slice.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        {totalPages > 1 ? (
          <Pagination className="mt-10">
            <PaginationContent className="flex-wrap gap-1">
              <PaginationItem>
                {prevPage ? (
                  <PaginationPrevious href={`/shop${q(prevPage)}`} />
                ) : (
                  <span className="inline-flex h-8 min-w-[5rem] items-center justify-center rounded-lg px-2 text-sm text-muted-foreground">
                    Previous
                  </span>
                )}
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={`/shop${q(String(p))}`}
                    isActive={p === page}
                    size="icon"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                {nextPage ? (
                  <PaginationNext href={`/shop${q(nextPage)}`} />
                ) : (
                  <span className="inline-flex h-8 min-w-[5rem] items-center justify-center rounded-lg px-2 text-sm text-muted-foreground">
                    Next
                  </span>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </main>
  )
}
