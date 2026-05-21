"use client"

import { useMemo } from "react"

import { useCart } from "@/contexts/cart-context"
import { usePersistedCartCoupon } from "@/hooks/use-persisted-cart-coupon"
import { cartFullRetailSubtotal } from "@/lib/cart-line"

import { CartEmptyState } from "./_components/cart-empty-state"
import { CartHeader } from "./_components/cart-header"
import { CartLineItems } from "./_components/cart-line-items"
import { CartLoadingState } from "./_components/cart-loading-state"
import { CartSidebar } from "./_components/cart-sidebar"

export default function CartPage() {
  const {
    lines,
    itemCount,
    subtotal,
    balanceDueLater,
    hydrated,
    removeLine,
    setLineQuantity,
  } = useCart()

  const {
    couponInput,
    setCouponInput,
    appliedCode,
    couponError,
    discount,
    discountResult,
    applyCoupon,
    removeCoupon,
  } = usePersistedCartCoupon({
    subtotal,
    hydrated,
    linesLength: lines.length,
  })

  const fullRetailTotal = useMemo(() => cartFullRetailSubtotal(lines), [lines])
  const totalPayOnline = Math.max(0, subtotal - discount)

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <CartHeader itemCount={itemCount} />

        {!hydrated ? <CartLoadingState /> : null}

        {hydrated && lines.length === 0 ? <CartEmptyState /> : null}

        {hydrated && lines.length > 0 ? (
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <CartLineItems
              lines={lines}
              onRemove={removeLine}
              onQuantityChange={setLineQuantity}
            />
            <CartSidebar
              fullRetailTotal={fullRetailTotal}
              subtotal={subtotal}
              balanceDueLater={balanceDueLater}
              discount={discount}
              appliedCode={appliedCode}
              totalPayOnline={totalPayOnline}
              couponInput={couponInput}
              onCouponInputChange={setCouponInput}
              discountResult={discountResult}
              couponError={couponError}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
            />
          </div>
        ) : null}
      </div>
    </main>
  )
}
