import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type CouponType = "PERCENT" | "FLAT"
type CouponStatus = "ACTIVE" | "INACTIVE"

type CouponPayload = {
  type: CouponType
  value: number
  usageLimit: number
  status: CouponStatus
}

function keyForCoupon(code: string) {
  return `coupon:${code.toUpperCase()}`
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  const key = keyForCoupon(code)
  const body = (await req.json()) as CouponPayload

  const existing = await prisma.setting.findUnique({ where: { key } })
  if (!existing) {
    return NextResponse.json({ error: "Coupon not found." }, { status: 404 })
  }

  let usedCount = 0
  try {
    const parsed = JSON.parse(existing.value) as { usedCount?: number }
    usedCount = parsed.usedCount ?? 0
  } catch {
    usedCount = 0
  }

  await prisma.setting.update({
    where: { key },
    data: {
      value: JSON.stringify({
        code: code.toUpperCase(),
        type: body.type,
        value: body.value,
        usageLimit: body.usageLimit,
        usedCount,
        status: body.status,
      }),
    },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  const key = keyForCoupon(code)

  const existing = await prisma.setting.findUnique({ where: { key } })
  if (!existing) {
    return NextResponse.json({ error: "Coupon not found." }, { status: 404 })
  }

  await prisma.setting.delete({ where: { key } })
  return NextResponse.json({ ok: true })
}
