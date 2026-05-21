"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CartLine } from "@/contexts/cart-context"
import { productDetailPath } from "@/data/products"
import {
  lineBalanceLaterTotal,
  linePayablePerUnit,
  linePayableTotal,
} from "@/lib/cart-line"
import { formatInr } from "@/lib/format-inr"
import { cn } from "@/lib/utils"

type Props = {
  line: CartLine
  /** When false, parent supplies dividers (e.g. divide-y). */
  showDivider?: boolean
  onRemove: (lineId: string) => void
  onQuantityChange: (lineId: string, quantity: number) => void
}

export function CartLineControls({
  line,
  showDivider = true,
  onRemove,
  onQuantityChange,
}: Props) {
  const href = productDetailPath(line.productId)
  const payNow = linePayableTotal(line)
  const perUnitNow = linePayablePerUnit(line)
  const balanceLater = lineBalanceLaterTotal(line)
  const fullLineTotal = line.unitPrice * line.quantity

  return (
    <div
      className={cn(
        "flex gap-3 py-3 sm:py-4",
        showDivider && "border-b border-border last:border-b-0"
      )}
    >
      <Link
        href={href}
        className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted sm:size-16"
      >
        <Image
          src={line.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="64px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={href}
            className="line-clamp-2 text-sm font-medium text-foreground hover:underline"
          >
            {line.title}
          </Link>
          <span
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              line.paymentType === "deposit"
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-100"
                : "bg-muted text-muted-foreground"
            )}
          >
            {line.paymentType === "deposit" ? "Online + COD" : "Full pay"}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          SKU: {line.sku}
          {line.variantLabel ? (
            <>
              {" "}
              · Color:{" "}
              <span className="font-medium text-foreground">
                {line.variantLabel}
              </span>
            </>
          ) : null}
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {formatInr(payNow)}
          <span className="ml-1.5 font-normal text-muted-foreground">
            ({formatInr(perUnitNow)} × {line.quantity})
          </span>
        </p>
        {line.paymentType === "deposit" && balanceLater > 0 ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Item total {formatInr(fullLineTotal)} · Due on COD at delivery{" "}
            <span className="font-medium text-foreground">
              {formatInr(balanceLater)}
            </span>
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div
            className="flex h-8 items-stretch overflow-hidden rounded-md border border-input bg-background"
            role="group"
            aria-label={`Quantity for ${line.title}`}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-full min-w-8 rounded-none border-r border-input px-0"
              onClick={() =>
                onQuantityChange(line.lineId, line.quantity - 1)
              }
            >
              −
            </Button>
            <span className="flex min-w-9 items-center justify-center text-xs font-semibold tabular-nums">
              {line.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-full min-w-8 rounded-none border-l border-input px-0"
              onClick={() =>
                onQuantityChange(line.lineId, line.quantity + 1)
              }
            >
              +
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${line.title} from cart`}
            onClick={() => onRemove(line.lineId)}
          >
            <Trash2 className="size-3.5" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
