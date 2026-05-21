import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/require-admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const { id } = await context.params
  const body = (await req.json()) as {
    name?: string | null
    role?: "ADMIN" | "CUSTOMER"
    password?: string | null
  }

  const existing = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 })
  }

  const data: {
    name?: string | null
    role?: "ADMIN" | "CUSTOMER"
    passwordHash?: string
  } = {}
  if (body.name !== undefined) {
    const trimmed = body.name?.trim()
    data.name = trimmed ? trimmed : null
  }
  if (body.role !== undefined) {
    data.role = body.role
  }
  if (body.password !== undefined && body.password !== null) {
    const p = body.password.trim()
    if (p.length > 0) {
      if (p.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters." },
          { status: 400 }
        )
      }
      data.passwordHash = await bcrypt.hash(p, 12)
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Nothing to update." },
      { status: 400 }
    )
  }

  if (data.role === "ADMIN" || existing.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
    if (existing.role === "ADMIN" && data.role && data.role !== "ADMIN") {
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin." },
          { status: 400 }
        )
      }
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  })
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const { id } = await context.params

  if (id === gate.adminId) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    )
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  })
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 })
  }

  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the only admin." },
        { status: 400 }
      )
    }
  }

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
