import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { id } = await context.params
  const target = await prisma.address.findUnique({ where: { id } })
  if (!target || target.userId !== user.id) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 })
  }

  await prisma.address.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
