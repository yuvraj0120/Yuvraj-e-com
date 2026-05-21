"use client"

import { Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { useCart } from "@/contexts/cart-context"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { cn } from "@/lib/utils"

type ColorVariant = { color: string; imageUrl: string }

type Props = {
  productId: string
  productTitle: string
  imageUrl: string
  unitPrice: number
  sku: string
  colorVariants: ColorVariant[]
}

export function ProductCardImageHoverActions({
  productId,
  productTitle,
  imageUrl,
  unitPrice,
  sku,
  colorVariants,
}: Props) {
  const { addItem, lines, setLineQuantity, removeLine } = useCart()
  const [selectedColor, setSelectedColor] = useState("")

  useEffect(() => {
    if (colorVariants.length > 0) {
      setSelectedColor((c) =>
        c && colorVariants.some((v) => v.color === c)
          ? c
          : colorVariants[0]!.color
      )
    } else {
      setSelectedColor("")
    }
  }, [colorVariants])

  const selectedVariant = useMemo(() => {
    if (!colorVariants.length) return null
    return (
      colorVariants.find((v) => v.color === selectedColor) ?? colorVariants[0]!
    )
  }, [colorVariants, selectedColor])

  const displayImageUrl = selectedVariant?.imageUrl ?? imageUrl
  const variantLabel = selectedVariant?.color

  function lineMatches(line: (typeof lines)[number]) {
    if (line.productId !== productId) return false
    if (line.paymentType !== "full" || line.depositPerUnit !== 0) return false
    const a = (line.variantLabel ?? "").trim()
    const b = (variantLabel ?? "").trim()
    return a === b
  }

  const fullLine = lines.find(lineMatches)
  const quantityInCart = fullLine?.quantity ?? 0

  return (
    <div
      className={cn(
        "absolute inset-0 z-[12] flex flex-col justify-end gap-2 p-2 sm:p-2.5",
        "bg-gradient-to-t from-black/75 via-black/40 to-transparent",
        "visible opacity-100 pointer-events-auto",
        "sm:invisible sm:opacity-0 sm:pointer-events-none sm:transition-[opacity,visibility] sm:duration-200",
        "sm:group-hover/image:visible sm:group-hover/image:opacity-100 sm:group-hover/image:pointer-events-auto",
        "sm:group-focus-within/image:visible sm:group-focus-within/image:opacity-100 sm:group-focus-within/image:pointer-events-auto"
      )}
    >
      {colorVariants.length > 0 ? (
        <div className="w-full">
          <label className="sr-only" htmlFor={`card-variant-${productId}`}>
            Color
          </label>
          <NativeSelect
            id={`card-variant-${productId}`}
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="h-8 w-full border-white/30 bg-white/95 text-xs text-gray-900 sm:h-9"
          >
            {colorVariants.map((v) => (
              <NativeSelectOption key={v.color} value={v.color}>
                {v.color}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      ) : null}

      <div className="flex w-full items-stretch gap-1.5 sm:gap-2">
        {quantityInCart === 0 ? (
          <button
            type="button"
            className="h-8 min-h-8 flex-1 rounded-md bg-white px-2 text-[11px] font-bold text-gray-900 shadow-md hover:bg-white/90 sm:h-9 sm:min-h-9 sm:text-xs"
            aria-label={`Add ${productTitle} to cart`}
            onClick={() =>
              addItem(
                {
                  productId,
                  title: productTitle,
                  imageUrl: displayImageUrl,
                  variantLabel,
                  unitPrice,
                  sku,
                  paymentType: "full",
                  depositPerUnit: 0,
                },
                1
              )
            }
          >
            Add to cart
          </button>
        ) : (
          <>
            <div
              className="grid h-8 flex-1 grid-cols-[2rem_1fr_2rem] items-stretch overflow-hidden rounded-md border border-white/70 bg-white/95 text-gray-900 shadow-md sm:h-9 sm:grid-cols-[2.25rem_1fr_2.25rem]"
              role="group"
              aria-label="Quantity"
            >
              <button
                type="button"
                className="flex h-full items-center justify-center border-r border-black/10 text-sm font-semibold"
                onClick={() => {
                  if (!fullLine) return
                  if (fullLine.quantity <= 1) {
                    removeLine(fullLine.lineId)
                    return
                  }
                  setLineQuantity(fullLine.lineId, fullLine.quantity - 1)
                }}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="flex h-full w-full items-center justify-center text-sm font-bold tabular-nums">
                {quantityInCart}
              </span>
              <button
                type="button"
                className="flex h-full items-center justify-center border-l border-black/10 text-sm font-semibold"
                onClick={() => {
                  if (!fullLine) return
                  setLineQuantity(
                    fullLine.lineId,
                    Math.min(99, fullLine.quantity + 1)
                  )
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="flex h-8 shrink-0 items-center gap-1 rounded-md bg-red-600 px-2 text-[11px] font-semibold text-white shadow-md hover:bg-red-700 sm:h-9 sm:text-xs"
              onClick={() => {
                if (!fullLine) return
                removeLine(fullLine.lineId)
              }}
              aria-label={`Remove ${productTitle} from cart`}
            >
              <Trash2 className="size-3.5" aria-hidden />
              <span>Remove</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
