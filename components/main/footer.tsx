import Link from "next/link"
import { Mail01Icon, TelephoneIcon } from "@hugeicons/core-free-icons"

import { footerConfig } from "@/config/footer"
import { HugeIcon } from "@/components/ui/huge-icon"
import { cn } from "@/lib/utils"

const footerLinkClass =
  "block text-sm text-foreground transition-colors hover:text-foreground/80"

export function MainFooter({ className }: { className?: string }) {
  const { brandTitle, navLinks, updates, visitStore, policyLinks, copyright } =
    footerConfig

  return (
    <footer
      className={cn(
        "mt-auto border-t border-border bg-background text-foreground",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-foreground">
              {brandTitle}
            </p>
            <nav className="mt-6 flex flex-col gap-3" aria-label="Footer">
              {navLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    footerLinkClass,
                    item.emphasized && "font-semibold text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-8">
            <div className="max-w-md rounded-xl border border-border bg-muted/30 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">
                {updates.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {updates.description}
              </p>
              <Link
                href={updates.ctaHref}
                className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {updates.ctaLabel} →
              </Link>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {visitStore.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {visitStore.address}
              </p>
              <a
                href={`mailto:${visitStore.email}`}
                className="mt-3 flex items-center gap-2 text-sm text-foreground hover:underline"
              >
                <HugeIcon
                  icon={Mail01Icon}
                  size={16}
                  className="text-muted-foreground"
                />
                {visitStore.email}
              </a>
              <a
                href={visitStore.phoneTel}
                className="mt-2 flex items-center gap-2 text-sm text-foreground hover:underline"
              >
                <HugeIcon
                  icon={TelephoneIcon}
                  size={16}
                  className="text-muted-foreground"
                />
                {visitStore.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-border">
        <nav
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 sm:gap-x-10 sm:px-6 lg:px-8"
          aria-label="Policies"
        >
          {policyLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="px-4 py-5 text-center text-sm text-muted-foreground">
        Copyright {copyright.owner}{" "}
        {new Date().getFullYear()}.
      </p>
    </footer>
  )
}
