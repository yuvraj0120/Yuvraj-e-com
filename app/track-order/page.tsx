import type { Metadata } from "next"
import Link from "next/link"
import { PackageSearch } from "lucide-react"

import { site } from "@/config/site"
import { trackOrderConfig } from "@/config/track-order"
import { TrackOrderForm } from "./track-order-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Track order",
  description: `Track your shipment with ${trackOrderConfig.carrierLabel} or contact ${site.name}.`,
}

export default function TrackOrderPage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,oklch(0.94_0_0),transparent)] dark:bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,oklch(0.26_0_0),transparent)]"
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15">
            <PackageSearch className="size-7" aria-hidden />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Track your order
          </h1>
          <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-[15px]">
            Enter your <strong className="font-medium text-foreground">order ID</strong>{" "}
            and <strong className="font-medium text-foreground">billing email</strong>{" "}
            to check status on {trackOrderConfig.carrierLabel}. Need help? See our{" "}
            <Link
              href="/faq"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              FAQ
            </Link>{" "}
            or contact us below.
          </p>
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Order lookup</CardTitle>
            <CardDescription>
              Use the order ID and billing email from your checkout confirmation
              — the same details you used when placing the order.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <TrackOrderForm />
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/80 bg-muted/30 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick tips</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {trackOrderConfig.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Still stuck?</CardTitle>
            <CardDescription>
              Reach out with your order ID and billing email and we&apos;ll help.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-sm">
            <p>
              <a
                href={`mailto:${site.contact.email}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {site.contact.email}
              </a>
            </p>
            <p>
              <a
                href={site.contact.phoneTel}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {site.contact.phone}
              </a>
            </p>
            <p className="text-muted-foreground">{site.contact.address}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
