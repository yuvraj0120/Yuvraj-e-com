"use client"

import type { FormEvent } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

import { CheckoutCouponBlock } from "@/app/checkout/_components/checkout-coupon-block"
import type { CouponDiscountResult } from "@/lib/coupons"

import { CartTotalCostCard } from "./cart-total-cost-card"

type Props = {
  fullRetailTotal: number
  subtotal: number
  balanceDueLater: number
  discount: number
  appliedCode: string | null
  totalPayOnline: number
  couponInput: string
  onCouponInputChange: (value: string) => void
  discountResult: CouponDiscountResult | null
  couponError: string | null
  onApplyCoupon: (e: FormEvent) => void
  onRemoveCoupon: () => void
}

export function CartSidebar({
  fullRetailTotal,
  subtotal,
  balanceDueLater,
  discount,
  appliedCode,
  totalPayOnline,
  couponInput,
  onCouponInputChange,
  discountResult,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
}: Props) {
  const { data: session, status } = useSession()
  const name = session?.user?.name?.trim()
  const email = session?.user?.email?.trim()
  const letter = (name?.[0] ?? email?.[0] ?? "U").toUpperCase()

  return (
    <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-24 lg:w-96">
      <div className="rounded-xl border bg-card p-4">
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border bg-muted text-sm font-semibold">
              {letter}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name || "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        ) : (
          <div className="text-sm">
            <p className="text-muted-foreground">
              Login with email/password to checkout.
            </p>
            <Link
              href="/login?callbackUrl=/checkout"
              className="mt-2 inline-flex font-medium text-primary hover:underline"
            >
              Login now
            </Link>
          </div>
        )}
      </div>

      <CartTotalCostCard
        fullRetailTotal={fullRetailTotal}
        subtotal={subtotal}
        balanceDueLater={balanceDueLater}
        discount={discount}
        appliedCode={appliedCode}
        totalPayOnline={totalPayOnline}
      />

      <CheckoutCouponBlock
        idPrefix="cart"
        couponInput={couponInput}
        onCouponInputChange={onCouponInputChange}
        appliedCode={appliedCode}
        discount={discount}
        discountResult={discountResult}
        couponError={couponError}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
      />

      <p className="text-xs text-muted-foreground">
        Cart is stored in your browser until checkout or cleared.
      </p>
    </aside>
  )
}
