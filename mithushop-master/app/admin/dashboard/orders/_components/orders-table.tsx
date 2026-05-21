import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatInr } from "@/lib/format-inr"
import { cn } from "@/lib/utils"

import {
  deliveryBadgeClassName,
  deliveryBadgeLabel,
  type OrderFulfillmentStatus,
} from "@/app/admin/dashboard/orders/_components/order-status-helpers"

export type AdminOrderRecord = {
  id: string
  createdAt: string
  customer: string
  customerEmail: string
  customerPhone: string
  payment: "Paid" | "Pending" | "Refunded"
  status: OrderFulfillmentStatus
  shippingAddress: string
  shippingMethod: string
  trackingId: string
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  lines: Array<{ title: string; qty: number; unitPrice: number }>
}

type OrdersTableProps = {
  rows: AdminOrderRecord[]
  onViewDetails: (order: AdminOrderRecord) => void
}

function paymentBadgeClass(payment: AdminOrderRecord["payment"]) {
  switch (payment) {
    case "Paid":
      return "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
    case "Pending":
      return "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
    case "Refunded":
      return "border-violet-200 bg-violet-50/80 text-violet-950 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-100"
  }
}

export function OrdersTable({ rows, onViewDetails }: OrdersTableProps) {
  return (
    <section className="rounded-xl border bg-card text-card-foreground">
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold tracking-tight">Orders</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tabular view — use the eye to open full details.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="whitespace-nowrap px-3 py-3">Order ID</th>
              <th className="whitespace-nowrap px-3 py-3">Date</th>
              <th className="min-w-[140px] px-3 py-3">Customer</th>
              <th className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                Total
              </th>
              <th className="whitespace-nowrap px-3 py-3">Payment</th>
              <th className="min-w-[120px] px-3 py-3">Delivery</th>
              <th className="w-14 whitespace-nowrap px-3 py-3 text-right">
                View
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-10 text-center text-sm text-muted-foreground"
                >
                  No orders match your filters.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/80 last:border-0 hover:bg-muted/40"
              >
                <td className="px-3 py-2.5 font-mono text-xs font-medium">
                  {row.id}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {new Date(row.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-3 py-2.5">
                  <span className="font-medium text-foreground">
                    {row.customer}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {row.customerEmail}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-medium">
                  {formatInr(row.total)}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                      paymentBadgeClass(row.payment)
                    )}
                  >
                    {row.payment}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "inline-flex max-w-[11rem] rounded-md border px-2 py-0.5 text-xs font-medium",
                      deliveryBadgeClassName(row.status)
                    )}
                  >
                    {deliveryBadgeLabel(row.status)}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="cursor-pointer"
                    aria-label={`View details for order ${row.id}`}
                    onClick={() => onViewDetails(row)}
                  >
                    <Eye className="size-4" aria-hidden />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
