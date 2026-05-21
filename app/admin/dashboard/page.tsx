import { DashboardKpiGrid } from "@/app/admin/dashboard/_components/dashboard-kpi-grid"
import { DashboardSalesTable } from "@/app/admin/dashboard/_components/dashboard-sales-table"
import { prisma } from "@/lib/prisma"
import { formatInr } from "@/lib/format-inr"

export default async function AdminDashboardPage() {
  const [orders, customerCount, publishedProducts, orderItems] = await Promise.all([
    prisma.order.findMany({
      select: { total: true, paymentStatus: true, orderStatus: true },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.orderItem.findMany({
      select: {
        title: true,
        quantity: true,
        lineTotal: true,
        product: { select: { category: { select: { name: true } } } },
      },
      take: 500,
    }),
  ])

  const paidRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((acc, o) => acc + o.total, 0)
  const totalOrders = orders.length
  const cancelledOrders = orders.filter((o) => o.orderStatus === "CANCELLED").length
  const cancelRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : "0.0"
  const avgOrderValue = totalOrders > 0 ? paidRevenue / totalOrders : 0

  const productMap = new Map<
    string,
    { product: string; category: string; sold: number; revenue: number }
  >()
  for (const item of orderItems) {
    const key = item.title.trim().toLowerCase()
    const existing = productMap.get(key)
    const category = item.product?.category?.name ?? "General"
    if (existing) {
      existing.sold += item.quantity
      existing.revenue += item.lineTotal
      continue
    }
    productMap.set(key, {
      product: item.title,
      category,
      sold: item.quantity,
      revenue: item.lineTotal,
    })
  }

  const salesRows = [...productMap.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((row) => ({
      product: row.product,
      category: row.category,
      sold: row.sold,
      revenue: formatInr(row.revenue),
    }))

  const kpis = [
    {
      title: "Paid Revenue",
      value: formatInr(paidRevenue),
      note: `${totalOrders} total orders`,
    },
    {
      title: "Customers",
      value: customerCount.toString(),
      note: "Registered customer accounts",
    },
    {
      title: "Published Products",
      value: publishedProducts.toString(),
      note: "Live products in catalog",
    },
    {
      title: "Average Order Value",
      value: formatInr(avgOrderValue),
      note: `Cancellation rate ${cancelRate}%`,
    },
  ]

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time overview from your database.
          </p>
        </header>

        <DashboardKpiGrid kpis={kpis} />
        <DashboardSalesTable rows={salesRows} />
      </div>
    </main>
  )
}
