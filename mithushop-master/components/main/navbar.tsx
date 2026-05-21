"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CrownIcon, Menu01Icon } from "@hugeicons/core-free-icons"

import { NavbarCartPopover } from "@/components/main/navbar-cart"
import { navbarConfig } from "@/config/navbar"
import { HugeIcon } from "@/components/ui/huge-icon"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const linkClass =
  "text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"

const mobileTriggerClass =
  "md:hidden text-foreground/80 hover:text-foreground"

/**
 * Sheet/dialog is mounted only after hydration so server HTML and the first
 * client render stay aligned (Base UI portals + ref wiring can differ on SSR).
 */
function NavbarMobileMenu() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          mobileTriggerClass,
          "pointer-events-none opacity-70"
        )}
        aria-hidden
      >
        <HugeIcon icon={Menu01Icon} size={20} />
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              mobileTriggerClass
            )}
            aria-label="Open menu"
          >
            <HugeIcon icon={Menu01Icon} size={20} />
          </button>
        }
      />
      <SheetContent side="right" className="w-[min(100%,20rem)]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2 pb-4" aria-label="Mobile">
          {navbarConfig.links.map((item) => (
            <SheetClose
              key={item.href}
              nativeButton={false}
              render={
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function BrandLogo() {
  const { brand } = navbarConfig
  if (brand.logoSrc) {
    return (
      <Image
        src={brand.logoSrc}
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-md object-cover"
      />
    )
  }
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#c8d0c0] text-amber-700 shadow-sm ring-1 ring-black/5"
      aria-hidden
    >
      <HugeIcon icon={CrownIcon} size={20} />
    </span>
  )
}

function UserProfileBadge() {
  const { data: session, status } = useSession()
  const [profileHref, setProfileHref] = useState("/profile")
  const name = session?.user?.name?.trim()
  const email = session?.user?.email?.trim()
  const letter = (name?.[0] ?? email?.[0] ?? "U").toUpperCase()

  useEffect(() => {
    if (status !== "authenticated") {
      setProfileHref("/profile")
      return
    }
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/profile/role", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { role?: string | null }
        if (!mounted) return
        setProfileHref(data.role === "ADMIN" ? "/admin/dashboard" : "/profile")
      } catch {
        if (mounted) setProfileHref("/profile")
      }
    })()
    return () => {
      mounted = false
    }
  }, [status])

  if (status === "loading") {
    return (
      <div
        className="flex size-9 items-center justify-center rounded-full border text-xs text-muted-foreground"
        aria-hidden
      >
        ...
      </div>
    )
  }

  if (status !== "authenticated") {
    return (
      <Link
        href="/login?callbackUrl=/checkout"
        className="rounded-md px-2 py-1 text-sm font-medium text-foreground/80 hover:text-foreground"
      >
        Login
      </Link>
    )
  }

  return (
    <Link
      href={profileHref}
      className="flex size-9 items-center justify-center rounded-full border bg-muted text-sm font-semibold text-foreground"
      title={name || email || "User"}
      aria-label="Open profile"
    >
      {letter}
    </Link>
  )
}

export function MainNavbar({ className }: { className?: string }) {
  const { brand, links } = navbarConfig

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href={brand.href}
          className="flex shrink-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <BrandLogo />
          <span className="sr-only">{brand.name}</span>
        </Link>

        <nav
          className="hidden flex-1 items-center gap-8 md:flex"
          aria-label="Main"
        >
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <NavbarCartPopover />
          <UserProfileBadge />

          <NavbarMobileMenu />
        </div>
      </div>
    </header>
  )
}
