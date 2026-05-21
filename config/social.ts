import { site } from "@/config/site"

export type SocialLink = {
  id: string
  label: string
  /** Full URL; `null` when not set yet (shown as “coming soon”). */
  href: string | null
  /** Short line under the title, e.g. handle or channel name */
  subtitle?: string | null
}

export const socialConfig = {
  links: site.social.links satisfies readonly SocialLink[],
} as const
