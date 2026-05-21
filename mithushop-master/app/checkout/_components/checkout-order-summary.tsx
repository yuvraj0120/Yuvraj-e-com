"use client"

import Image from "next/image"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import type { CartLine } from "@/contexts/cart-context"
import { linePayableTotal } from "@/lib/cart-line"
import type { CouponDiscountResult } from "@/lib/coupons"
import { formatInr } from "@/lib/format-inr"
import { ONLINE_PARTIAL_PREPAY_INR } from "@/lib/partial-payment"
import { cn } from "@/lib/utils"

import { CheckoutCouponBlock } from "./checkout-coupon-block"

type PaymentChoice = "partial_cod" | "full_online"

type Props = {
  lines: CartLine[]
  subtotal: number
  balanceDueLater: number
  fullRetailTotal: number
  discount: number
  totalPayOnline: number
  couponInput: string
  setCouponInput: (v: string) => void
  appliedCode: string | null
  discountResult: CouponDiscountResult | null
  couponError: string | null
  applyCoupon: (e: FormEvent) => void
  removeCoupon: () => void
  paymentChoice: PaymentChoice
  onPaymentChoiceChange: (v: PaymentChoice) => void
  codAgreement: boolean
  onCodAgreementChange: (v: boolean) => void
  codAgreementError: boolean
  onPlaceOrder: () => void
}

export function CheckoutOrderSummary({
  lines,
  subtotal,
  balanceDueLater,
  fullRetailTotal,
  discount,
  totalPayOnline,
  couponInput,
  setCouponInput,
  appliedCode,
  discountResult,
  couponError,
  applyCoupon,
  removeCoupon,
  paymentChoice,
  onPaymentChoiceChange,
  codAgreement,
  onCodAgreementChange,
  codAgreementError,
  onPlaceOrder,
}: Props) {
  const needsPartialPath = balanceDueLater > 0

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-foreground">Your order</h2>

        <ul className="mt-4 divide-y divide-border">
          {lines.map((line) => {
            const payNow = linePayableTotal(line)
            return (
              <li
                key={line.lineId}
                className="flex gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  <Image
                    src={line.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {line.title}{" "}
                    <span className="font-normal text-muted-foreground">
                      (× {line.quantity})
                    </span>
                  </p>
                  {line.variantLabel ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Color:{" "}
                      <span className="font-medium text-foreground">
                        {line.variantLabel}
                      </span>
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm tabular-nums font-semibold text-foreground">
                    {formatInr(payNow)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        <Separator className="my-4" />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotal (pay online)</dt>
            <dd className="tabular-nums font-medium text-foreground">
              {formatInr(subtotal)}
            </dd>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between gap-4 text-green-600 dark:text-green-500">
              <dt>Coupon ({appliedCode})</dt>
              <dd className="tabular-nums font-medium">−{formatInr(discount)}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-4 text-muted-foreground">
            <dt className="flex items-center gap-2">
              <Checkbox checked disabled id="ship-free" />
              <Label htmlFor="ship-free" className="cursor-default font-normal">
                Shipping
              </Label>
            </dt>
            <dd className="tabular-nums font-medium text-foreground">
              Free shipping
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
          <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-semibold">
            <dt className="text-foreground">Total (pay online now)</dt>
            <dd className="tabular-nums text-foreground">
              {formatInr(totalPayOnline)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-muted-foreground">
          Full item value (reference): {formatInr(fullRetailTotal)}. Coupon
          applies only to the amount you pay online, not the COD portion.
        </p>
      </div>

      <CheckoutCouponBlock
        idPrefix="checkout"
        couponInput={couponInput}
        onCouponInputChange={(v) => {
          setCouponInput(v)
        }}
        appliedCode={appliedCode}
        discount={discount}
        discountResult={discountResult}
        couponError={couponError}
        onApply={applyCoupon}
        onRemove={removeCoupon}
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-foreground">Payment method</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you complete this order.
        </p>

        <RadioGroup
          value={paymentChoice}
          onValueChange={(v) => onPaymentChoiceChange(v as PaymentChoice)}
          className="mt-4 gap-4"
        >
          <label
            htmlFor="pay-partial"
            className={cn(
              "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
              paymentChoice === "partial_cod" && "border-primary bg-primary/5",
              !needsPartialPath && "pointer-events-none opacity-50"
            )}
          >
            <RadioGroupItem
              value="partial_cod"
              id="pay-partial"
              disabled={!needsPartialPath}
              className="mt-0.5 border-amber-600 data-checked:border-amber-600 data-checked:bg-amber-600 dark:data-checked:bg-amber-600"
            />
            <span className="min-w-0">
              <span className="font-medium text-foreground">
                Partial online + COD
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Pay {formatInr(totalPayOnline)} online now to confirm your order.
                {balanceDueLater > 0 ? (
                  <>
                    {" "}
                    Pay the remaining {formatInr(balanceDueLater)} in cash when
                    your order is delivered. For many items we collect a{" "}
                    {formatInr(ONLINE_PARTIAL_PREPAY_INR)} advance online (your
                    cart may use a different split — amounts above are exact).
                  </>
                ) : (
                  " Not available — your cart has no balance due on delivery."
                )}
              </span>
            </span>
          </label>

          <label
            htmlFor="pay-full"
            className={cn(
              "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
              paymentChoice === "full_online" && "border-primary bg-primary/5",
              needsPartialPath && "pointer-events-none opacity-50"
            )}
          >
            <RadioGroupItem
              value="full_online"
              id="pay-full"
              disabled={needsPartialPath}
            />
            <span className="min-w-0">
              <span className="font-medium text-foreground">
                Pay full amount online
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {needsPartialPath
                  ? "Unavailable while your cart includes partial-pay items with a COD balance."
                  : `Pay ${formatInr(totalPayOnline)} at the next step using the payment gateway.`}
              </span>
            </span>
          </label>
        </RadioGroup>

        {needsPartialPath ? (
          <div
            className={cn(
              "mt-4 rounded-lg border p-3",
              codAgreementError
                ? "border-destructive bg-destructive/5"
                : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
            )}
          >
            <div className="flex gap-3">
              <Checkbox
                id="cod-agree"
                checked={codAgreement}
                onCheckedChange={(c) => onCodAgreementChange(c === true)}
                className="mt-0.5"
                aria-invalid={codAgreementError}
              />
              <Label
                htmlFor="cod-agree"
                className="cursor-pointer text-sm leading-snug font-normal text-foreground"
              >
                I understand I am paying {formatInr(totalPayOnline)} online now
                as order confirmation, and I will pay{" "}
                {formatInr(balanceDueLater)} on cash on delivery when I receive
                the order.
              </Label>
            </div>
            {codAgreementError ? (
              <p className="mt-2 text-xs text-destructive" role="alert">
                Please confirm the partial payment and COD terms to place your
                order.
              </p>
            ) : null}
          </div>
        ) : null}

        <Button type="button" className="mt-6 w-full" size="lg" onClick={onPlaceOrder}>
          Place order
        </Button>
      </div>
    </div>
  )
}
