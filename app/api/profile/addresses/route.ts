import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json([], { status: 200 })

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(addresses)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const count = await prisma.address.count({ where: { userId: user.id } })
  if (count >= 2) {
    return NextResponse.json(
      { error: "You can save up to 2 addresses." },
      { status: 400 }
    )
  }

  const body = (await req.json()) as {
    label: string
    firstName: string
    lastName: string
    country: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    phone: string
    email?: string
  }

  const created = await prisma.address.create({
    data: {
      userId: user.id,
      label: body.label?.trim() || `Address ${count + 1}`,
      firstName: body.firstName?.trim() || "",
      lastName: body.lastName?.trim() || "",
      country: body.country?.trim() || "India",
      addressLine1: body.addressLine1?.trim() || "",
      addressLine2: body.addressLine2?.trim() || "",
      city: body.city?.trim() || "",
      state: body.state?.trim() || "",
      pincode: body.pincode?.trim() || "",
      phone: body.phone?.trim() || "",
      email: body.email?.trim() || null,
    },
  })

  return NextResponse.json(created, { status: 201 })
}
