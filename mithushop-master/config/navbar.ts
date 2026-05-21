import { site } from "@/config/site"

export type NavbarLink = {
  label: string
  href: string
}

export const navbarConfig = {
  brand: site.brand,
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Social Media", href: "/social-media" },
    { label: "Shop", href: "/shop" },
    { label: "Website Policies", href: "/policies" },
  ] satisfies NavbarLink[],
  cart: {
    href: "/cart",
    ariaLabel: "Shopping cart",
  },
} as const
