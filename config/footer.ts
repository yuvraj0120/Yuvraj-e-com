import { site } from "@/config/site"

export type FooterNavLink = {
  label: string
  href: string
  /** Emphasize (e.g. Login) */
  emphasized?: boolean
}

export type FooterPolicyLink = {
  label: string
  href: string
}

export const footerConfig = {
  brandTitle: site.name.toUpperCase(),
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "FAQ's", href: "/faq" },
    { label: "Social Media", href: "/social-media" },
    { label: "Tracking order", href: "/track-order" },
    { label: "Login", href: "/login", emphasized: true },
  ] satisfies FooterNavLink[],
  /** Static CTA — no form or personal data */
  updates: {
    title: "Stay updated",
    description:
      "Follow us on social media for new arrivals, offers, and stock updates.",
    ctaLabel: "Social media",
    ctaHref: "/social-media",
  },
  visitStore: {
    title: "Visit our store",
    address: site.contact.address,
    email: site.contact.email,
    phone: site.contact.phone,
    phoneTel: site.contact.phoneTel,
  },
  policyLinks: [
    { label: "Terms & Conditions", href: "/policies/terms" },
    { label: "Return & Refund Policy", href: "/policies#return-refund" },
    { label: "Privacy Policy", href: "/policies/privacy" },
    { label: "Shipping & Payment Policy", href: "/policies/shipping" },
  ] satisfies FooterPolicyLink[],
  copyright: {
    owner: site.legal.copyrightOwner,
  },
} as const
