import type { Metadata } from "next"

import { faqConfig } from "@/config/faq"
import { FaqAccordion } from "./faq-accordion"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about products, shipping, ShipRocket, returns, and dispatch times.",
}

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-foreground">
          {faqConfig.title}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Tap a question to expand the answer.
        </p>

        <FaqAccordion />
      </div>
    </main>
  )
}
