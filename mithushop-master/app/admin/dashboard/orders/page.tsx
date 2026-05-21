import { OrdersManager } from "@/app/admin/dashboard/orders/_components/orders-manager"

export default function AdminOrdersPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review full order details and download order reports.
          </p>
        </header>
        <OrdersManager />
      </div>
    </main>
  )
}
