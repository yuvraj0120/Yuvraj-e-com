import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function requireAdmin():
  Promise<
  | { ok: true; adminId: string }
  | { ok: false; response: NextResponse }
  > {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.trim().toLowerCase()
  if (!email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const admin = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  })

  if (!admin || admin.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { ok: true, adminId: admin.id }
}
