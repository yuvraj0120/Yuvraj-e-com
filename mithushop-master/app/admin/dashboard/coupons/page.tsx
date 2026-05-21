import { CouponsTable } from "@/app/admin/dashboard/coupons/_components/coupons-table"

export default function AdminCouponsPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit and delete coupons from database.
          </p>
        </header>
        <CouponsTable />
      </div>
    </main>
  )
}
