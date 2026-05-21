type SalesRow = {
  product: string
  category: string
  sold: number
  revenue: string
}

type DashboardSalesTableProps = {
  rows: SalesRow[]
}

export function DashboardSalesTable({ rows }: DashboardSalesTableProps) {
  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground">
      <h2 className="text-lg font-semibold">Top Products</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">
                Product
              </th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">
                Category
              </th>
              <th className="px-2 py-2 text-right font-medium text-muted-foreground">
                Units Sold
              </th>
              <th className="px-2 py-2 text-right font-medium text-muted-foreground">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-2 py-4 text-muted-foreground" colSpan={4}>
                  No product sales available yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.product} className="border-b last:border-0">
                  <td className="px-2 py-2">{row.product}</td>
                  <td className="px-2 py-2 text-muted-foreground">{row.category}</td>
                  <td className="px-2 py-2 text-right">{row.sold}</td>
                  <td className="px-2 py-2 text-right font-semibold">{row.revenue}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
