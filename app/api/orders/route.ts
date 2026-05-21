import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type OrderLineInput = {
  productId: string
  title: string
  sku: string
  quantity: number
  unitPrice: number
  paymentType: "full" | "deposit"
}

type CreateOrderPayload = {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  paymentOutcome: "success"
  couponCode?: string | null
  subtotal: number
  discount: number
  total: number
  lines: OrderLineInput[]
}

function buildOrderNumber() {
  return `Yuvraj-e-com-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const signedEmail = session?.user?.email?.toLowerCase()
  if (!signedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = (await req.json()) as CreateOrderPayload
  if (!Array.isArray(payload.lines) || payload.lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: signedEmail },
    select: { id: true },
  })

  const paymentStatus = "PAID"
  const orderStatus = "PROCESSING"

  const created = await prisma.order.create({
    data: {
      orderNumber: buildOrderNumber(),
      userId: user?.id ?? null,
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim(),
      customerPhone: payload.customerPhone.trim(),
      paymentStatus,
      orderStatus,
      shippingAddress: payload.shippingAddress.trim(),
      shippingMethod: "Standard",
      subtotal: payload.subtotal,
      shippingCharge: 0,
      discount: payload.discount,
      total: payload.total,
      items: {
        create: payload.lines.map((line) => ({
          productId: line.productId,
          title:
            line.paymentType === "deposit"
              ? `${line.title} (Partial payment)`
              : line.title,
          sku: line.sku,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          lineTotal: line.unitPrice * line.quantity,
        })),
      },
    },
    select: {
      id: true,
      orderNumber: true,
      paymentStatus: true,
      orderStatus: true,
    },
  })

  const couponCode = payload.couponCode?.trim().toUpperCase()
  if (couponCode) {
    const couponKey = `coupon:${couponCode}`
    const couponSetting = await prisma.setting.findUnique({
      where: { key: couponKey },
    })
    if (couponSetting) {
      try {
        const parsed = JSON.parse(couponSetting.value) as {
          code: string
          type: "PERCENT" | "FLAT"
          value: number
          usageLimit: number
          usedCount?: number
          status: "ACTIVE" | "INACTIVE"
        }
        await prisma.setting.update({
          where: { key: couponKey },
          data: {
            value: JSON.stringify({
              ...parsed,
              usedCount: (parsed.usedCount ?? 0) + 1,
            }),
          },
        })
      } catch {
        /* ignore invalid coupon payload */
      }
    }
  }

  return NextResponse.json(created, { status: 201 })
}
