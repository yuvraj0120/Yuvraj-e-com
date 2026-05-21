"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const profileNavItems = [
  { label: "Profile", href: "/profile" },
  { label: "Billing Addresses", href: "/profile/addresses" },
  { label: "Orders", href: "/profile/orders" },
  { label: "Support", href: "/profile/support" },
]

function isActive(pathname: string, href: string) {
  if (href === "/profile") return pathname === "/profile"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full rounded-xl border bg-card p-3 text-card-foreground lg:w-72 lg:sticky lg:top-24 lg:self-start">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        My Account
      </p>
      <nav className="space-y-1">
        {profileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition-colors",
              isActive(pathname, item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
