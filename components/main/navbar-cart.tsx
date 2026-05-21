"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons"

import { CartLineControls } from "@/app/cart/_components/cart-line-controls"
import { buttonVariants } from "@/components/ui/button-variants"
import { HugeIcon } from "@/components/ui/huge-icon"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCart } from "@/contexts/cart-context"
import { formatInr } from "@/lib/format-inr"
import { cn } from "@/lib/utils"

import { navbarConfig } from "@/config/navbar"

export function NavbarCartPopover() {
  const {
    itemCount,
    lines,
    subtotal,
    balanceDueLater,
    removeLine,
    setLineQuantity,
  } = useCart()
  const [open, setOpen] = useState(false)
  const { cart } = navbarConfig
  const fullLines = lines.filter((line) => line.paymentType === "full")
  const partialLines = lines.filter((line) => line.paymentType === "deposit")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={
          itemCount > 0
            ? `${cart.ariaLabel}, ${itemCount} items`
            : cart.ariaLabel
        }
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative text-foreground/80 hover:text-foreground"
        )}
      >
        <HugeIcon icon={ShoppingCart01Icon} size={20} />
        {itemCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-bold leading-none text-primary-foreground tabular-nums">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-[min(100vw-1.5rem,22rem)] gap-0 overflow-hidden p-0 shadow-lg ring-1 ring-border"
      >
        <div className="border-b border-border bg-muted/40 px-3 py-2.5">
          <PopoverTitle className="text-base font-semibold">
            Your cart
          </PopoverTitle>
        </div>

        <div className="max-h-[min(55vh,22rem)] overflow-y-auto overscroll-contain px-2">
          {lines.length === 0 ? (
            <p className="px-2 py-10 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            <div className="py-1">
              {fullLines.length > 0 ? (
                <div className="mb-1 px-1 pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Full payment
                  </p>
                </div>
              ) : null}
              {fullLines.map((line) => (
                <CartLineControls
                  key={line.lineId}
                  line={line}
                  onRemove={removeLine}
                  onQuantityChange={setLineQuantity}
                />
              ))}

              {partialLines.length > 0 ? (
                <div className="mb-1 mt-2 border-t border-border px-1 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Partial payment (online + COD)
                  </p>
                </div>
              ) : null}
              {partialLines.map((line) => (
                <CartLineControls
                  key={line.lineId}
                  line={line}
                  onRemove={removeLine}
                  onQuantityChange={setLineQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="space-y-2 border-t border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pay now</span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatInr(subtotal)}
              </span>
            </div>
            {balanceDueLater > 0 ? (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Due on COD</span>
                <span className="tabular-nums">{formatInr(balanceDueLater)}</span>
              </div>
            ) : null}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "h-9 w-full justify-center rounded-lg text-sm font-medium"
              )}
            >
              View cart
            </Link>
          </div>
        ) : (
          <div className="border-t border-border p-3">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "h-9 w-full justify-center rounded-lg text-sm font-medium"
              )}
            >
              Browse shop
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
