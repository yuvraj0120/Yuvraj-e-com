import {
  CheckCircle2,
  Package,
  Truck,
  XCircle,
} from "lucide-react"

import type { AdminOrderRecord } from "@/app/admin/dashboard/orders/_components/orders-table"
import {
  deliveryBadgeClassName,
  deliveryHeadline,
  type OrderFulfillmentStatus,
} from "@/app/admin/dashboard/orders/_components/order-status-helpers"
import { formatInr } from "@/lib/format-inr"
import { cn } from "@/lib/utils"

function formatMoney(value: number) {
  return formatInr(value)
}

function StatusIcon({ status }: { status: OrderFulfillmentStatus }) {
  const className = "size-5 shrink-0"
  switch (status) {
    case "Processing":
      return <Package className={className} aria-hidden />
    case "Shipped":
      return <Truck className={className} aria-hidden />
    case "Delivered":
      return <CheckCircle2 className={className} aria-hidden />
    case "Cancelled":
      return <XCircle className={className} aria-hidden />
  }
}

export function OrderDetailsCard({
  order,
  variant = "card",
}: {
  order: AdminOrderRecord
  variant?: "card" | "plain"
}) {
  const inner = (
    <>
      <div
        className={cn(
          "flex gap-3 rounded-lg border px-4 py-3",
          deliveryBadgeClassName(order.status)
        )}
      >
        <StatusIcon status={order.status} />
        <div className="min-w-0">
          <p className="font-semibold leading-snug">
            {deliveryHeadline(order.status)}
          </p>
          <p className="mt-1 text-sm opacity-90">
            {order.shippingMethod}
            {order.trackingId && order.trackingId !== "-" ? (
              <>
                {" "}
                · Tracking:{" "}
                <span className="font-mono">{order.trackingId}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Order summary</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-mono">{order.id}</span>
          {" · "}
          {new Date(order.createdAt).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="font-medium">{order.customer}</p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Ship to</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {order.shippingAddress}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-md border bg-muted/50 px-2 py-1 font-medium">
          Payment: {order.payment}
        </span>
        <span
          className={cn(
            "rounded-md border px-2 py-1 font-medium",
            deliveryBadgeClassName(order.status)
          )}
        >
          {deliveryHeadline(order.status)}
        </span>
      </div>

      <div className="rounded-lg border">
        <div className="border-b px-3 py-2 text-sm font-medium">Items</div>
        <div className="divide-y">
          {order.lines.map((line) => (
            <div
              key={`${order.id}-${line.title}-${line.qty}`}
              className="flex items-center justify-between px-3 py-2 text-sm"
            >
              <p>
                {line.title}{" "}
                <span className="text-muted-foreground">×{line.qty}</span>
              </p>
              <p className="font-medium tabular-nums">
                {formatMoney(line.qty * line.unitPrice)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-3 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Subtotal</p>
          <p className="tabular-nums">{formatMoney(order.subtotal)}</p>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-muted-foreground">Shipping</p>
          <p className="tabular-nums">{formatMoney(order.shippingCharge)}</p>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-muted-foreground">Discount</p>
          <p className="tabular-nums">− {formatMoney(order.discount)}</p>
        </div>
        <div className="mt-2 flex items-center justify-between border-t pt-2 font-semibold">
          <p>Total</p>
          <p className="tabular-nums">{formatMoney(order.total)}</p>
        </div>
      </div>
    </>
  )

  if (variant === "plain") {
    return <div className="space-y-4">{inner}</div>
  }

  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground">
      {inner}
    </section>
  )
}
