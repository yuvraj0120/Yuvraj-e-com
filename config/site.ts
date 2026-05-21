/**
 * Site-wide contact, URL, and branding — single source of truth for footer,
 * policies, FAQ, social page, etc.
 */
export const site = {
  /** Company / store name used across the site */
  name: "Demo Shop",
  /** Navbar brand */
  brand: {
    name: "Demo Store",
    href: "/",
    /** Set to e.g. `/navbar-logo.png` in `public/` when you have an asset */
    logoSrc: null as string | null,
  },
  /** Public site URL (https) */
  url: "https://example-store.com",
  /** Hostname only, e.g. for legal copy without a scheme */
  host: "example-store.com",
  legal: {
    copyrightOwner: "DEMO OWNER",
  },
  contact: {
    email: "demo@example.com",
    phone: "+1 (555) 010-2020",
    phoneTel: "tel:+15550102020",
    address: "123 Demo Street, Sample City, CA 90210",
  },
  social: {
    links: [
      {
        id: "youtube",
        label: "YouTube",
        href: "https://www.youtube.com/@demo_store",
        subtitle: "@demo_store",
      },
      {
        id: "facebook",
        label: "Facebook",
        href: "https://www.facebook.com/demo.store",
        subtitle: "demo.store",
      },
      {
        id: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/demo.store",
        subtitle: "@demo.store",
      },
    ] as const,
  },
} as const
