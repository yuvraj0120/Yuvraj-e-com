import crypto from "node:crypto"

import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string }
    const email = body.email?.trim().toLowerCase() ?? ""
    if (!email) {
      return NextResponse.json({ ok: true })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    await prisma.passwordResetRequest.create({
      data: {
        email,
        tokenHash,
        userId: user?.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    })

    // Intentionally no token/email response to prevent account enumeration.
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
