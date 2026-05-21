"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/contexts/cart-context"
import { formatInr } from "@/lib/format-inr"
import { ONLINE_PARTIAL_PREPAY_INR } from "@/lib/partial-payment"
import { cn } from "@/lib/utils"

import { ProductCardShareButton } from "./product-card-share-button"

export type ProductDetailColorVariant = {
  color: string
  imageUrl: string
  galleryImageUrls?: string[]
}

type Props = {
  productId: string
  title: string
  shareText: string
  /** Pre-formatted online prepay, e.g. ₹500.00 */
  onlinePrepayFormatted: string
  /** Amount paid online per unit when choosing partial payment. */
  onlinePrepayAmount: number
  imageUrl: string
  unitPrice: number
  sku: string
  colorVariants: ProductDetailColorVariant[]
  /** When set with onSelectColor, variant selection is controlled (e.g. sync with gallery). */
  selectedColor?: string
  onSelectColor?: (color: string) => void
}

export function ProductDetailActions({
  productId,
  title,
  shareText,
  onlinePrepayFormatted,
  onlinePrepayAmount,
  imageUrl,
  unitPrice,
  sku,
  colorVariants,
  selectedColor: selectedColorProp,
  onSelectColor,
}: Props) {
  const router = useRouter()
  const { addItem, lines } = useCart()
  const [qty, setQty] = useState(1)
  const [payment, setPayment] = useState<"deposit" | "full">("deposit")
  const [internalColor, setInternalColor] = useState("")

  const controlled =
    typeof onSelectColor === "function" && selectedColorProp !== undefined

  useEffect(() => {
    if (controlled) return
    if (colorVariants.length > 0) {
      setInternalColor((c) =>
        c && colorVariants.some((v) => v.color === c)
          ? c
          : colorVariants[0]!.color
      )
    } else {
      setInternalColor("")
    }
  }, [colorVariants, controlled])

  const selectedColor = controlled ? selectedColorProp! : internalColor
  const setSelectedColor = controlled ? onSelectColor! : setInternalColor

  const selectedVariant = useMemo(() => {
    if (!colorVariants.length) return null
    return (
      colorVariants.find((v) => v.color === selectedColor) ?? colorVariants[0]!
    )
  }, [colorVariants, selectedColor])

  const displayImageUrl = selectedVariant?.imageUrl ?? imageUrl
  const variantLabel = selectedVariant?.color

  const buildPayload = () => ({
    productId,
    title,
    imageUrl: displayImageUrl,
    variantLabel,
    unitPrice,
    sku,
    paymentType: payment === "deposit" ? "deposit" as const : "full" as const,
    depositPerUnit: payment === "deposit" ? onlinePrepayAmount : 0,
  })

  const handleAddToCart = () => {
    addItem(buildPayload(), qty)
  }

  const handleBuyNow = () => {
    addItem(buildPayload(), qty)
    router.push("/cart")
  }

  const codPerUnit = Math.max(0, unitPrice - onlinePrepayAmount)
  const usesStandardFiveHundred =
    onlinePrepayAmount === ONLINE_PARTIAL_PREPAY_INR &&
    unitPrice > ONLINE_PARTIAL_PREPAY_INR
  function lineMatchesSelection(line: (typeof lines)[number]) {
    if (line.productId !== productId) return false
    const a = (line.variantLabel ?? "").trim()
    const b = (variantLabel ?? "").trim()
    return a === b
  }

  const sameSelectionLines = lines.filter(lineMatchesSelection)
  const fullLine = sameSelectionLines.find(
    (line) => line.paymentType === "full" && line.depositPerUnit === 0
  )
  const partialLine = sameSelectionLines.find(
    (line) => line.paymentType === "deposit" && line.depositPerUnit > 0
  )
  const quantityInCart = sameSelectionLines.reduce(
    (sum, line) => sum + line.quantity,
    0
  )

  return (
    <div className="space-y-5 border-t border-border pt-5">
      {colorVariants.length > 0 ? (
        <div className="space-y-2">
          <Label htmlFor="pd-variant">Color</Label>
          <NativeSelect
            id="pd-variant"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full max-w-xs"
          >
            {colorVariants.map((v) => (
              <NativeSelectOption key={v.color} value={v.color}>
                {v.color}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      ) : null}

      <div>
        <p className="text-sm font-semibold text-foreground">
          Pay online now: {onlinePrepayFormatted}{" "}
          <span className="font-normal text-muted-foreground">per item</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Balance{" "}
          <span className="font-medium text-foreground">
            {formatInr(codPerUnit)} per item
          </span>{" "}
          — cash on delivery when your order arrives.
        </p>
        <RadioGroup
          value={payment}
          onValueChange={(v) => setPayment(v as "deposit" | "full")}
          className="mt-3 gap-3"
        >
          <div className="flex items-center gap-2.5">
            <RadioGroupItem
              value="deposit"
              id="pd-deposit"
              className="border-green-600 data-checked:border-green-600 data-checked:bg-green-600 dark:data-checked:bg-green-600"
            />
            <Label htmlFor="pd-deposit" className="cursor-pointer font-normal">
              {usesStandardFiveHundred
                ? `${formatInr(ONLINE_PARTIAL_PREPAY_INR)} online + balance on COD`
                : "Partial — pay online, rest on COD"}
            </Label>
          </div>
          <div className="flex items-center gap-2.5">
            <RadioGroupItem value="full" id="pd-full" />
            <Label htmlFor="pd-full" className="cursor-pointer font-normal">
              Pay full amount online
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-wrap items-stretch gap-3">
        <div
          className="flex h-10 items-stretch overflow-hidden rounded-lg border border-input bg-background shadow-xs"
          role="group"
          aria-label="Quantity"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-full min-w-10 rounded-none border-r border-input px-0 text-lg font-medium"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </Button>
          <span className="flex min-w-11 items-center justify-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-full min-w-10 rounded-none border-l border-input px-0 text-lg font-medium"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
          >
            +
          </Button>
        </div>

        <Button
          type="button"
          className="h-10 min-w-[9.5rem] flex-1 bg-blue-600 px-6 text-sm font-bold uppercase tracking-wide text-white shadow-md hover:bg-blue-700 sm:flex-none dark:bg-blue-600 dark:hover:bg-blue-500"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>

        <Button
          type="button"
          className="h-10 min-w-[9.5rem] flex-1 bg-amber-400 px-6 text-sm font-bold uppercase tracking-wide text-gray-900 shadow-md hover:bg-amber-300 sm:flex-none dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-300"
          onClick={handleBuyNow}
        >
          Buy now
        </Button>

        <ProductCardShareButton
          productId={productId}
          title={title}
          text={shareText}
          className={cn(
            "relative inset-auto flex h-10 w-10 shrink-0 rounded-lg border border-border",
            "bg-background text-foreground shadow-sm backdrop-blur-none",
            "hover:bg-muted hover:text-foreground"
          )}
        />
      </div>

      {quantityInCart > 0 ? (
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-sm font-semibold text-foreground">
            This product in your cart
          </p>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            {fullLine ? (
              <p>
                Full payment:{" "}
                <span className="font-medium text-foreground">
                  {fullLine.quantity}
                </span>
              </p>
            ) : null}
            {partialLine ? (
              <p>
                Partial payment:{" "}
                <span className="font-medium text-foreground">
                  {partialLine.quantity}
                </span>
              </p>
            ) : null}
            <p>
              Total units:{" "}
              <span className="font-medium text-foreground">{quantityInCart}</span>
            </p>
          </div>
        </div>
      ) : null}

      {payment === "deposit" ? (
        <p className="text-xs text-muted-foreground">
          You complete {onlinePrepayFormatted} per item online to confirm your
          order. The remaining amount is paid in cash to the delivery partner
          when you receive the product (COD).
        </p>
      ) : null}
    </div>
  )
}
