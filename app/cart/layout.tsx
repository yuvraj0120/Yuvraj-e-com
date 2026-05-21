import type { Metadata } from "next"

import { site } from "@/config/site"

export const metadata: Metadata = {
  title: "Cart",
  description: `Shopping cart — ${site.name}.`,
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
