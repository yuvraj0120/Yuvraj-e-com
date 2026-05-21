import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json()) as { name?: string }
  const name = body.name?.trim()
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { name },
    select: { name: true, email: true },
  })

  return NextResponse.json(updated)
}
