import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export function CartEmptyState() {
  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-4 py-12 text-center shadow-sm sm:p-6">
      <p className="text-sm text-muted-foreground">
        Your cart is empty. Browse the shop to add products.
      </p>
      <Link
        href="/shop"
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-6 inline-flex h-10 items-center justify-center px-6"
        )}
      >
        Go to shop
      </Link>
    </div>
  )
}
