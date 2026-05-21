import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"

export const runtime = "nodejs"

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function GET() {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { products: true } },
    },
  })

  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      productCount: r._count.products,
    }))
  )
}

export async function POST(req: Request) {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const body = (await req.json()) as { name?: string }
  const name = body.name?.trim() ?? ""
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 })
  }

  const slug = slugify(name)
  if (!slug) {
    return NextResponse.json({ error: "Invalid category name." }, { status: 400 })
  }

  const existing = await prisma.category.findFirst({
    where: { OR: [{ slug }, { name }] },
    select: { id: true },
  })
  if (existing) {
    return NextResponse.json(
      { error: "A category with this name already exists." },
      { status: 409 }
    )
  }

  const created = await prisma.category.create({
    data: { name, slug },
    select: { id: true, name: true, slug: true },
  })

  return NextResponse.json(created, { status: 201 })
}
