import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { formatInr } from "@/lib/format-inr"
import { cn } from "@/lib/utils"

type Props = {
  fullRetailTotal: number
  subtotal: number
  balanceDueLater: number
  discount: number
  appliedCode: string | null
  totalPayOnline: number
}

export function CartTotalCostCard({
  fullRetailTotal,
  subtotal,
  balanceDueLater,
  discount,
  appliedCode,
  totalPayOnline,
}: Props) {
  return (
    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 sm:p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-primary">
        Total cost
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Order value (items)</dt>
          <dd className="tabular-nums font-medium text-foreground">
            {formatInr(fullRetailTotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Pay online now</dt>
          <dd className="tabular-nums font-medium text-foreground">
            {formatInr(subtotal)}
          </dd>
        </div>
        {balanceDueLater > 0 ? (
          <div className="flex justify-between gap-4 text-amber-800 dark:text-amber-200/90">
            <dt>Due on COD at delivery</dt>
            <dd className="tabular-nums font-medium">
              {formatInr(balanceDueLater)}
            </dd>
          </div>
        ) : null}
        {discount > 0 ? (
          <div className="flex justify-between gap-2 text-green-600 dark:text-green-500">
            <dt>Coupon ({appliedCode})</dt>
            <dd className="tabular-nums font-medium">−{formatInr(discount)}</dd>
          </div>
        ) : null}
        <div className="flex items-baseline justify-between gap-4 border-t border-primary/20 pt-4">
          <dt className="text-base font-semibold text-foreground">
            Total due online
          </dt>
          <dd className="text-2xl font-bold tabular-nums text-primary">
            {formatInr(totalPayOnline)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        Coupon discounts apply only to the amount you pay online now, not the
        COD portion.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Login with email and password is required at checkout.
      </p>

      <Link
        href="/checkout"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "mt-4 flex w-full"
        )}
      >
        Proceed to checkout
      </Link>
      <Link
        href="/shop"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-3 flex h-10 w-full items-center justify-center"
        )}
      >
        Continue shopping
      </Link>
    </div>
  )
}
