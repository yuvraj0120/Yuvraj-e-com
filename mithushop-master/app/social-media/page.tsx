import Link from "next/link"
import {
  Camera01Icon,
  PlayCircleIcon,
  SquareArrowUpRightIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"

import { site } from "@/config/site"
import { socialConfig, type SocialLink } from "@/config/social"
import { HugeIcon } from "@/components/ui/huge-icon"
import { cn } from "@/lib/utils"

function SocialIcon({ id }: { id: string }) {
  switch (id) {
    case "youtube":
      return <HugeIcon icon={PlayCircleIcon} size={20} aria-hidden />
    case "whatsapp":
      return <HugeIcon icon={WhatsappIcon} size={20} aria-hidden />
    case "instagram":
      return <HugeIcon icon={Camera01Icon} size={20} aria-hidden />
    default:
      return <HugeIcon icon={SquareArrowUpRightIcon} size={20} aria-hidden />
  }
}

function SocialCard({ item }: { item: SocialLink }) {
  const active = Boolean(item.href)

  const content = (
    <>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <SocialIcon id={item.id} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground">{item.label}</h2>
          {item.subtitle ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{item.subtitle}</p>
          ) : null}
        </div>
      </div>

      {active ? (
        <div className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary underline-offset-4">
          Open
          <HugeIcon icon={SquareArrowUpRightIcon} size={14} aria-hidden />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Link coming soon.</p>
      )}
    </>
  )

  if (!active) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 px-5 py-5 shadow-sm">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={item.href!}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-5 shadow-sm transition-colors hover:bg-muted/40"
    >
      {content}
    </Link>
  )
}

export default function SocialMediaPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-foreground">
          Social media
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Follow {site.name} for updates, offers, and new stock.
        </p>
        <ul className="flex flex-col gap-4">
          {socialConfig.links.map((item) => (
            <li key={item.id}>
              <SocialCard item={item} />
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="social-contact-heading"
          className="mt-10 rounded-xl border border-border bg-muted/40 px-5 py-6"
        >
          <h2
            id="social-contact-heading"
            className="text-center text-sm font-semibold text-foreground"
          >
            Contact
          </h2>
          <ul className="mt-4 space-y-2 text-center text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={site.contact.phoneTel}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {site.contact.phone}
              </a>
            </li>
            <li>{site.contact.address}</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
