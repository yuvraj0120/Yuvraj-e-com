import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { placedAt: "desc" },
    include: {
      items: {
        select: {
          title: true,
          quantity: true,
          unitPrice: true,
        },
      },
    },
  })

  return NextResponse.json(
    orders.map((o) => ({
      id: o.orderNumber,
      createdAt: o.placedAt.toISOString(),
      customer: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      payment:
        o.paymentStatus === "PAID"
          ? "Paid"
          : o.paymentStatus === "REFUNDED"
            ? "Refunded"
            : "Pending",
      status:
        o.orderStatus === "DELIVERED"
          ? "Delivered"
          : o.orderStatus === "SHIPPED"
            ? "Shipped"
            : o.orderStatus === "CANCELLED"
              ? "Cancelled"
              : "Processing",
      shippingAddress: o.shippingAddress,
      shippingMethod: o.shippingMethod,
      trackingId: o.trackingId ?? "-",
      subtotal: o.subtotal,
      shippingCharge: o.shippingCharge,
      discount: o.discount,
      total: o.total,
      lines: o.items.map((i) => ({
        title: i.title,
        qty: i.quantity,
        unitPrice: i.unitPrice,
      })),
    }))
  )
}
