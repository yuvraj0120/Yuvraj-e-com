import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/require-admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const body = (await req.json()) as {
    name?: string | null
    email?: string
    password?: string
    role?: "ADMIN" | "CUSTOMER"
  }

  const email = body.email?.trim().toLowerCase() ?? ""
  const password = body.password ?? ""
  const name = body.name?.trim() ?? ""
  const role = body.role === "ADMIN" ? "ADMIN" : "CUSTOMER"

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 })
  }
  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    )
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json(
      { error: "A user with this email already exists." },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const created = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return NextResponse.json(
    {
      ...created,
      createdAt: created.createdAt.toISOString(),
    },
    { status: 201 }
  )
}
