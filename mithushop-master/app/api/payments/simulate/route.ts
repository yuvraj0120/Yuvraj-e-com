import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST() {
  const status = Math.random() < 0.5 ? "success" : "failed"
  return NextResponse.json({
    status,
    message:
      status === "success"
        ? "Payment approved by test gateway."
        : "Payment declined by test gateway.",
  })
}
