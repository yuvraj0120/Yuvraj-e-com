"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { formatInr } from "@/lib/format-inr"

type ProfileOrder = {
  id: string
  orderNumber: string
  placedAt: string
  paymentStatus: "PENDING" | "PAID" | "REFUNDED"
  orderStatus: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  shippingAddress: string
  shippingMethod: string
  trackingId: string | null
  items: Array<{
    id: string
    title: string
    sku: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }>
}

function getDisplayOrderStatus(order: Pick<ProfileOrder, "paymentStatus" | "orderStatus">) {
  if (order.paymentStatus === "PAID" && order.orderStatus === "PROCESSING") {
    return "CONFIRMED"
  }
  if (order.orderStatus === "CANCELLED") return "CANCELLED"
  return order.orderStatus
}

function getDisplayPaymentStatus(
  order: Pick<ProfileOrder, "paymentStatus" | "orderStatus">
) {
  if (order.orderStatus === "CANCELLED") return "FAILED"
  return order.paymentStatus
}

export default function ProfileOrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<ProfileOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/profile/orders", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as ProfileOrder[]
        if (mounted) setOrders(data)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const email = session?.user?.email ?? "Not available"

  return (
    <section className="rounded-xl border bg-card p-6 text-card-foreground">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View your placed orders and full details.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Need to cancel an order? Please connect to our team support.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? <p className="text-sm text-muted-foreground">Loading orders...</p> : null}
        {!loading && orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No orders found for {email} yet.
          </p>
        ) : null}
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.placedAt).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  Payment:{" "}
                  <span className="font-medium">{getDisplayPaymentStatus(order)}</span>
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span className="font-medium">{getDisplayOrderStatus(order)}</span>
                </p>
                <p className="mt-1 text-base font-semibold">{formatInr(order.total)}</p>
              </div>
            </div>

            <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm">
              <p>
                <span className="font-medium">Shipping:</span> {order.shippingMethod}
              </p>
              <p className="mt-1">
                <span className="font-medium">Address:</span> {order.shippingAddress}
              </p>
              {order.trackingId ? (
                <p className="mt-1">
                  <span className="font-medium">Tracking:</span> {order.trackingId}
                </p>
              ) : null}
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-2 text-left text-muted-foreground">Item</th>
                    <th className="px-2 py-2 text-left text-muted-foreground">SKU</th>
                    <th className="px-2 py-2 text-right text-muted-foreground">Qty</th>
                    <th className="px-2 py-2 text-right text-muted-foreground">Price</th>
                    <th className="px-2 py-2 text-right text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-2 py-2">{item.title}</td>
                      <td className="px-2 py-2">{item.sku}</td>
                      <td className="px-2 py-2 text-right">{item.quantity}</td>
                      <td className="px-2 py-2 text-right">{formatInr(item.unitPrice)}</td>
                      <td className="px-2 py-2 text-right">{formatInr(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
              <p>Subtotal: {formatInr(order.subtotal)}</p>
              <p>Discount: -{formatInr(order.discount)}</p>
              <p>Shipping: {formatInr(order.shippingCharge)}</p>
              <p className="font-medium text-foreground">
                Grand Total: {formatInr(order.total)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
