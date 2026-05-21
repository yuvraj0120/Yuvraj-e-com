import { AdminSidebar } from "@/app/admin/_components/admin-sidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminSidebar>{children}</AdminSidebar>
}
