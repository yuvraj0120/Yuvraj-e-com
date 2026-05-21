import { prisma } from "@/lib/prisma"
import {
  parseStoredVariants,
  toShopColorVariants,
} from "@/lib/product-variants"

export type ShopProduct = {
  id: string
  sku: string
  title: string
  category: string
  description: string
  imageUrl: string
  galleryImageUrls: string[]
  colorVariants: Array<{
    color: string
    imageUrl: string
    galleryImageUrls: string[]
  }>
  originalPrice: number
  discountPrice: number
  discountPercent: number
  isFeatured: boolean
  isNew: boolean
  isRecommended: boolean
  showStockUrgency: boolean
  stockCount: number
  popularityScore: number
  averageRating: number
  newnessRank: number
}

export type ShopSortOption =
  | "default"
  | "popularity"
  | "rating"
  | "latest"
  | "price-asc"
  | "price-desc"

export const shopSortOptions: { value: ShopSortOption; label: string }[] = [
  { value: "default", label: "Default sorting" },
  { value: "popularity", label: "Sort by popularity" },
  { value: "rating", label: "Sort by average rating" },
  { value: "latest", label: "Sort by latest" },
  { value: "price-asc", label: "Sort by price: low to high" },
  { value: "price-desc", label: "Sort by price: high to low" },
]

const SORT_VALUES = shopSortOptions.map((o) => o.value) as ShopSortOption[]

export function parseShopSort(v: string | undefined): ShopSortOption {
  if (v && (SORT_VALUES as readonly string[]).includes(v)) {
    return v as ShopSortOption
  }
  return "default"
}

/** Reserved label for “no category filter” in URLs and UI */
export const SHOP_ALL_CATEGORY = "All" as const

export type ShopCategoryFilter = typeof SHOP_ALL_CATEGORY | string

export async function getShopCategoryNames(): Promise<string[]> {
  const rows = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  })
  return rows.map((r) => r.name)
}

export function parseShopCategoryParam(
  raw: string | undefined,
  validNames: string[]
): ShopCategoryFilter {
  if (!raw || raw === SHOP_ALL_CATEGORY) return SHOP_ALL_CATEGORY
  return validNames.includes(raw) ? raw : SHOP_ALL_CATEGORY
}

export function buildHomeBrowseQuery(category: ShopCategoryFilter): string {
  if (category === SHOP_ALL_CATEGORY) return ""
  return `?category=${encodeURIComponent(category)}`
}

export function productDetailPath(productId: string) {
  return `/shop/product/${encodeURIComponent(productId)}`
}

export const SHOP_PAGE_SIZE = 20

function toShopProduct(input: {
  id: string
  sku: string
  title: string
  description: string
  imageUrl: string
  galleryImageUrls: unknown
  colorVariants: unknown
  originalPrice: number
  discountPrice: number
  discountPercent: number
  isFeatured: boolean
  isNew: boolean
  isRecommended: boolean
  showStockUrgency: boolean
  stockCount: number
  popularityScore: number
  averageRating: number
  newnessRank: number
  category: { name: string }
}): ShopProduct {
  const galleryImageUrls = Array.isArray(input.galleryImageUrls)
    ? input.galleryImageUrls
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter(Boolean)
    : []
  const colorVariants = toShopColorVariants(parseStoredVariants(input.colorVariants))

  return {
    id: input.id,
    sku: input.sku,
    title: input.title,
    category: input.category.name,
    description: input.description,
    imageUrl: input.imageUrl,
    galleryImageUrls,
    colorVariants,
    originalPrice: input.originalPrice,
    discountPrice: input.discountPrice,
    discountPercent: input.discountPercent,
    isFeatured: input.isFeatured,
    isNew: input.isNew,
    isRecommended: input.isRecommended,
    showStockUrgency: input.showStockUrgency,
    stockCount: input.stockCount,
    popularityScore: input.popularityScore,
    averageRating: input.averageRating,
    newnessRank: input.newnessRank,
  }
}

export async function getAllShopProducts(): Promise<ShopProduct[]> {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { category: { select: { name: true } } },
  })
  return products.map(toShopProduct)
}

export async function getProductById(id: string): Promise<ShopProduct | undefined> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  })
  if (!product || product.status !== "PUBLISHED") return undefined
  return toShopProduct(product)
}

export function filterProductsByCategory(
  products: ShopProduct[],
  category: string
): ShopProduct[] {
  if (category === SHOP_ALL_CATEGORY || !category) return products
  return products.filter((p) => p.category === category)
}

export function paginateProducts<T>(items: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * pageSize
  return {
    slice: items.slice(start, start + pageSize),
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    page: safePage,
  }
}

export function sortProducts(
  products: ShopProduct[],
  sort: ShopSortOption
): ShopProduct[] {
  if (sort === "default") return [...products]
  const copy = [...products]
  switch (sort) {
    case "popularity":
      return copy.sort((a, b) => b.popularityScore - a.popularityScore)
    case "rating":
      return copy.sort((a, b) => b.averageRating - a.averageRating)
    case "latest":
      return copy.sort((a, b) => b.newnessRank - a.newnessRank)
    case "price-asc":
      return copy.sort((a, b) => a.discountPrice - b.discountPrice)
    case "price-desc":
      return copy.sort((a, b) => b.discountPrice - a.discountPrice)
    default:
      return copy
  }
}

export function buildShopQuery(opts: {
  category: ShopCategoryFilter
  sort: ShopSortOption
  page?: number | string
}): string {
  const p = new URLSearchParams()
  if (opts.category !== SHOP_ALL_CATEGORY) p.set("category", opts.category)
  if (opts.sort !== "default") p.set("sort", opts.sort)
  const pg = String(opts.page ?? 1)
  if (pg !== "1" && pg !== "NaN") p.set("page", pg)
  const s = p.toString()
  return s ? `?${s}` : ""
}
