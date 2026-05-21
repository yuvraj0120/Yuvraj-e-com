import { ProfileCard } from "@/app/admin/profile/_components/profile-card"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()
  if (!email) redirect("/login?callbackUrl=/admin/profile")

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  if (!user) redirect("/login?callbackUrl=/admin/profile")

  const profile = {
    name: user.name ?? "Admin User",
    role: user.role,
    email: user.email,
    joined: user.createdAt.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    bio: "Administrator account with platform management access.",
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your admin profile details.
          </p>
        </header>
        <ProfileCard profile={profile} />
      </div>
    </main>
  )
}
