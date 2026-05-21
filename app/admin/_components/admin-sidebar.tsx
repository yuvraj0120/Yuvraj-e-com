"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight01Icon,
  CrownIcon,
  Home09Icon,
  Mail01Icon,
  Settings02Icon,
  GridViewIcon,
  Search01Icon,
  TelephoneIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"

import { HugeIcon } from "@/components/ui/huge-icon"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Search01Icon },
  { label: "Orders", href: "/admin/dashboard/orders", icon: TelephoneIcon },
  { label: "Products", href: "/admin/dashboard/products", icon: ArrowRight01Icon },
  {
    label: "Categories",
    href: "/admin/dashboard/categories",
    icon: GridViewIcon,
  },
  { label: "Coupons", href: "/admin/dashboard/coupons", icon: Tick01Icon },
  { label: "Users", href: "/admin/dashboard/users", icon: Mail01Icon },
  { label: "Settings", href: "/admin/settings", icon: Settings02Icon },
  { label: "Profile", href: "/admin/profile", icon: Home09Icon },
]

function isActiveRoute(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  if (href === "/admin/dashboard") return pathname === "/admin/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <HugeIcon icon={CrownIcon} size={18} />
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {adminNavItems.map((item) => {
                const active = isActiveRoute(pathname, item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        active
                          ? "bg-black text-white data-active:bg-black data-active:text-white hover:bg-black/90 hover:text-white"
                          : ""
                      )}
                      render={<Link href={item.href} />}
                    >
                      <HugeIcon icon={item.icon} size={16} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="min-h-svh">
        <header className="sticky top-0 z-20 border-b bg-background/95 px-3 py-2 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-4">
          <SidebarTrigger />
        </header>
        <div className="min-h-0 flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
