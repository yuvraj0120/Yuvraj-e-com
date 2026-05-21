import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { customerEmail: email },
    orderBy: { placedAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      placedAt: true,
      paymentStatus: true,
      orderStatus: true,
      subtotal: true,
      shippingCharge: true,
      discount: true,
      total: true,
      shippingAddress: true,
      shippingMethod: true,
      trackingId: true,
      items: {
        select: {
          id: true,
          title: true,
          sku: true,
          quantity: true,
          unitPrice: true,
          lineTotal: true,
        },
      },
    },
  })

  return NextResponse.json(orders)
}
