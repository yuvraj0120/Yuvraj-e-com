type RecentOrder = {
  id: string
  customer: string
  amount: string
  status: "Paid" | "Pending" | "Shipped"
}

type AdminRecentOrdersProps = {
  orders: RecentOrder[]
}

export function AdminRecentOrders({ orders }: AdminRecentOrdersProps) {
  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground">
      <h2 className="text-lg font-semibold">Recent Orders</h2>
      <div className="mt-4 space-y-3">
        {orders.map((order) => (
          <article
            key={order.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{order.customer}</p>
              <p className="text-xs text-muted-foreground">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{order.amount}</p>
              <p className="text-xs text-muted-foreground">{order.status}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
