"use client"

import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CouponDiscountResult } from "@/lib/coupons"
import { formatInr } from "@/lib/format-inr"

type Props = {
  idPrefix?: string
  couponInput: string
  onCouponInputChange: (value: string) => void
  appliedCode: string | null
  discount: number
  discountResult: CouponDiscountResult | null
  couponError: string | null
  onApply: (e: FormEvent) => void
  onRemove: () => void
}

export function CheckoutCouponBlock({
  idPrefix = "coupon",
  couponInput,
  onCouponInputChange,
  appliedCode,
  discount,
  discountResult,
  couponError,
  onApply,
  onRemove,
}: Props) {
  const id = `${idPrefix}-code`

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-foreground">Coupon code</h2>

      {appliedCode && discountResult && discountResult.ok ? (
        <div className="mt-4 rounded-lg border border-primary/30 bg-background px-3 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-foreground">{appliedCode}</p>
              <p className="text-xs text-muted-foreground">
                {discountResult.definition.label} · You save {formatInr(discount)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onApply} className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor={id} className="sr-only">
              Coupon code
            </Label>
            <Input
              id={id}
              name="coupon"
              placeholder="Enter code"
              value={couponInput}
              onChange={(e) => {
                onCouponInputChange(e.target.value)
              }}
              autoComplete="off"
              aria-invalid={Boolean(couponError)}
              className="h-10 uppercase placeholder:normal-case"
            />
            {couponError ? (
              <p className="text-xs text-destructive" role="alert">
                {couponError}
              </p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" variant="secondary">
            Apply coupon
          </Button>
        </form>
      )}
    </div>
  )
}
