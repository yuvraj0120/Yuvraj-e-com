import { ProfileSidebar } from "@/app/profile/_components/profile-sidebar"

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-start">
        <ProfileSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  )
}
