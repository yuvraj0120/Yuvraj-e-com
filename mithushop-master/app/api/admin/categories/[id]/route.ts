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

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const { id } = await context.params
  const body = (await req.json()) as { name?: string }
  const name = body.name?.trim() ?? ""
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 })
  }

  const slug = slugify(name)
  if (!slug) {
    return NextResponse.json({ error: "Invalid category name." }, { status: 400 })
  }

  const conflict = await prisma.category.findFirst({
    where: {
      AND: [{ id: { not: id } }, { OR: [{ slug }, { name }] }],
    },
    select: { id: true },
  })
  if (conflict) {
    return NextResponse.json(
      { error: "Another category already uses this name." },
      { status: 409 }
    )
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { name, slug },
    select: { id: true, name: true, slug: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const { id } = await context.params

  const count = await prisma.product.count({ where: { categoryId: id } })
  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${count} product(s) still use this category.` },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
