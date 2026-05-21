import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()
  if (!email) {
    return NextResponse.json({ role: null }, { status: 200 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  })

  return NextResponse.json({ role: user?.role ?? null }, { status: 200 })
}
