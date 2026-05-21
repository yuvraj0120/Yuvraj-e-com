import { CategoriesManager } from "@/app/admin/dashboard/categories/_components/categories-manager"

export default function AdminCategoriesPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage shop categories. Products must be assigned to one of these.
          </p>
        </header>
        <CategoriesManager />
      </div>
    </main>
  )
}
