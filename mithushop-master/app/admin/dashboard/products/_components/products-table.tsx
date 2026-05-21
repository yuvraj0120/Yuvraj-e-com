import { formatInr } from "@/lib/format-inr"

export type ProductVariantForm = {
  label: string
  imageUrls: [string, string, string, string]
}

export type AdminProductRecord = {
  id?: string
  name: string
  sku: string
  categoryId: string
  category: string
  brand: string
  hasVariants: boolean
  imageUrls: [string, string, string, string]
  variants: ProductVariantForm[]
  stock: number
  mrp: number
  salePrice: number
  status: "Published" | "Draft" | "Out of stock"
  visibility: "Public" | "Hidden"
  shortDescription: string
  tags: string[]
}

export function ProductsTable({
  rows,
  onEdit,
}: {
  rows: AdminProductRecord[]
  onEdit?: (product: AdminProductRecord) => void
}) {
  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground">
      <h2 className="text-lg font-semibold">Products</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left text-muted-foreground">Product</th>
              <th className="px-2 py-2 text-left text-muted-foreground">SKU</th>
              <th className="px-2 py-2 text-left text-muted-foreground">Category</th>
              <th className="px-2 py-2 text-left text-muted-foreground">Brand</th>
              <th className="px-2 py-2 text-left text-muted-foreground">Stock</th>
              <th className="px-2 py-2 text-left text-muted-foreground">MRP</th>
              <th className="px-2 py-2 text-left text-muted-foreground">
                Sale Price
              </th>
              <th className="px-2 py-2 text-left text-muted-foreground">
                Visibility
              </th>
              <th className="px-2 py-2 text-left text-muted-foreground">Status</th>
              <th className="px-2 py-2 text-right text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-2 py-10 text-center text-sm text-muted-foreground"
                >
                  No products match your filters.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr key={row.id ?? row.sku} className="border-b last:border-0">
                <td className="px-2 py-2">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.shortDescription}
                  </p>
                </td>
                <td className="px-2 py-2">{row.sku}</td>
                <td className="px-2 py-2">{row.category}</td>
                <td className="px-2 py-2">{row.brand || "-"}</td>
                <td className="px-2 py-2">{row.stock}</td>
                <td className="px-2 py-2">{formatInr(row.mrp)}</td>
                <td className="px-2 py-2">{formatInr(row.salePrice)}</td>
                <td className="px-2 py-2">{row.visibility}</td>
                <td className="px-2 py-2">{row.status}</td>
                <td className="px-2 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit?.(row)}
                    className="rounded-md border px-2 py-1 text-xs"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
