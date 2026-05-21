import { UsersTable } from "@/app/admin/dashboard/users/_components/users-table"

export default function AdminUsersPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create accounts, set roles (user or admin), update passwords, or remove
            accounts.
          </p>
        </header>
        <UsersTable />
      </div>
    </main>
  )
}
