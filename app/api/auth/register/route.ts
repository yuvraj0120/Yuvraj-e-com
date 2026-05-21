import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string
      email?: string
      password?: string
    }
    const name = body.name?.trim() ?? ""
    const email = body.email?.trim().toLowerCase() ?? ""
    const password = body.password ?? ""

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
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
        { error: "This email is already registered." },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: {
        name: name || null,
        email,
        passwordHash,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "Unable to create account right now." },
      { status: 500 }
    )
  }
}
