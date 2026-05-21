"use client"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  buildShopQuery,
  shopSortOptions,
  type ShopCategoryFilter,
  type ShopSortOption,
} from "@/data/products"

type Props = {
  category: ShopCategoryFilter
  sort: ShopSortOption
}

export function ShopSortSelect({ category, sort }: Props) {
  const router = useRouter()

  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:items-end">
      <span className="text-xs font-medium text-muted-foreground sm:text-right">
        Sort
      </span>
      <Select
        value={sort}
        onValueChange={(next) => {
          const v = (next ?? "default") as ShopSortOption
          const qs = buildShopQuery({
            category,
            sort: v,
            page: 1,
          })
          router.push(qs ? `/shop${qs}` : "/shop")
        }}
      >
        <SelectTrigger
          size="default"
          className="h-9 w-full min-w-[min(100%,17rem)] sm:min-w-[17.5rem]"
          aria-label="Sort products"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" className="min-w-[var(--anchor-width)]">
          {shopSortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
