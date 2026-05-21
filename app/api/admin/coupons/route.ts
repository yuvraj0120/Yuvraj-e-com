import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type CouponType = "PERCENT" | "FLAT"
type CouponStatus = "ACTIVE" | "INACTIVE"

type CouponPayload = {
  code: string
  type: CouponType
  value: number
  usageLimit: number
  status: CouponStatus
}

function keyForCoupon(code: string) {
  return `coupon:${code.toUpperCase()}`
}

export async function GET() {
  const rows = await prisma.setting.findMany({
    where: { key: { startsWith: "coupon:" } },
    orderBy: { updatedAt: "desc" },
  })

  const coupons = rows
    .map((row) => {
      try {
        const parsed = JSON.parse(row.value) as {
          code: string
          type: CouponType
          value: number
          usageLimit: number
          usedCount?: number
          status: CouponStatus
        }
        return {
          code: parsed.code,
          type: parsed.type,
          value: parsed.value,
          usageLimit: parsed.usageLimit,
          usedCount: parsed.usedCount ?? 0,
          status: parsed.status,
          updatedAt: row.updatedAt,
        }
      } catch {
        return null
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  return NextResponse.json(coupons)
}

export async function POST(req: Request) {
  const body = (await req.json()) as CouponPayload
  const normalizedCode = body.code.trim().toUpperCase()
  if (!normalizedCode) {
    return NextResponse.json({ error: "Coupon code is required." }, { status: 400 })
  }
  if (body.value <= 0) {
    return NextResponse.json({ error: "Coupon value must be greater than 0." }, { status: 400 })
  }

  const key = keyForCoupon(normalizedCode)
  const exists = await prisma.setting.findUnique({ where: { key } })
  if (exists) {
    return NextResponse.json({ error: "Coupon already exists." }, { status: 409 })
  }

  const created = await prisma.setting.create({
    data: {
      key,
      value: JSON.stringify({
        code: normalizedCode,
        type: body.type,
        value: body.value,
        usageLimit: body.usageLimit,
        usedCount: 0,
        status: body.status,
      }),
    },
  })

  return NextResponse.json({ ok: true, key: created.key }, { status: 201 })
}
