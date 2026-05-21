import { ProductsManager } from "@/app/admin/dashboard/products/_components/products-manager"

export default function AdminProductsPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add full product details here so they can be shown to users.
          </p>
        </header>
        <ProductsManager />
      </div>
    </main>
  )
}
