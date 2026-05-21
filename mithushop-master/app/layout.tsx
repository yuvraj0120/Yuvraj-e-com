import type { Metadata } from "next"
import { headers } from "next/headers"
import localFont from "next/font/local"
import { SiteFooter } from "@/app/footer"
import { SiteNavbar } from "@/app/navbar"
import { AppProviders } from "@/components/providers/app-providers"
import { site } from "@/config/site"
import "./globals.css"

const bricolageSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "../public/fonts/BricolageGrotesque-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/BricolageGrotesque-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/BricolageGrotesque-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/BricolageGrotesque-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/BricolageGrotesque-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/BricolageGrotesque-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/BricolageGrotesque-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Phones, gadgets & accessories`,
    template: `%s | ${site.name}`,
  },
  description:
    `${site.name} in Belgharia, Kolkata — mobiles, gadgets, and accessories. ` +
    "COD and prepaid, dependable delivery, and support you can reach by phone or email.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = (await headers()).get("x-pathname") ?? ""
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")
  const storeCurrency: "₹" = "₹"

  return (
    <html lang="en" className={`${bricolageSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__MITHU_CURRENCY__ = ${JSON.stringify(storeCurrency)};`,
          }}
        />
        <AppProviders>
          {!isAdminRoute ? <SiteNavbar /> : null}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          {!isAdminRoute ? <SiteFooter /> : null}
        </AppProviders>
      </body>
    </html>
  )
}
