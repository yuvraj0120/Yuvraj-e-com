import type { Metadata } from "next"
import Link from "next/link"
import { BadgeCheck, CreditCard, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About us",
  description:
    "Yuvraj-e-com Mobile Center — gadgets, mobiles, COD and prepaid, quality service.",
}

const highlights = [
  {
    icon: Smartphone,
    title: "Gadgets & mobiles",
    text: "We deal in all types of gadgets and mobile.",
  },
  {
    icon: CreditCard,
    title: "Flexible payment",
    text: "COD and prepaid available.",
  },
  {
    icon: BadgeCheck,
    title: "Quality & service",
    text: "Best service and top quality products.",
  },
] as const

export default function AboutPage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.92_0_0),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.28_0_0),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-14 sm:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            About us
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Yuvraj-e-com Mobile Center
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">Yuvraj</p>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            Your local stop for phones and accessories — honest pricing, clear
            options, and support you can count on before and after your purchase.
          </p>
        </header>

        <section
          aria-labelledby="about-highlights-heading"
          className="mt-14 sm:mt-16"
        >
          <h2
            id="about-highlights-heading"
            className="sr-only"
          >
            What we offer
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Card className="h-full border-border/80 bg-card/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/15">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-[15px] leading-snug">
                      {text}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <div className="mx-auto mt-14 flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 px-6 py-8 text-center backdrop-blur-sm sm:mt-16">
          <p className="text-sm font-medium text-foreground">
            Ready to browse?
          </p>
          <p className="text-sm text-muted-foreground">
            Explore the shop for the latest devices and accessories.
          </p>
          <Link
            href="/shop"
            className="mt-1 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Visit shop
          </Link>
        </div>
      </div>
    </main>
  )
}
