import { HomeCategoryProductBrowse } from "@/components/main/home-category-product-browse"
import { HomeHero } from "@/components/main/home-hero"
import { HomeShopByCategory } from "@/components/main/home-shop-by-category"
import { getShopCategoryNames, parseShopCategoryParam } from "@/data/products"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const sp = await searchParams
  const categoryNames = await getShopCategoryNames()
  const browseCategory = parseShopCategoryParam(sp.category, categoryNames)

  return (
    <main className="flex flex-1 flex-col">
      <HomeHero />
      <HomeShopByCategory categoryNames={categoryNames} />
      <HomeCategoryProductBrowse
        activeCategory={browseCategory}
        categoryNames={categoryNames}
      />
    </main>
  )
}
