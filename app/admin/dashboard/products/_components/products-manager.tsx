"use client"

import { useEffect, useMemo, useState } from "react"

import { ProductForm } from "@/app/admin/dashboard/products/_components/product-form"
import {
  type AdminProductRecord,
  ProductsTable,
} from "@/app/admin/dashboard/products/_components/products-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type CategoryRow = { id: string; name: string }

export function ProductsManager() {
  const [rows, setRows] = useState<AdminProductRecord[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProductRecord | null>(
    null
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<
    "all" | AdminProductRecord["status"]
  >("all")
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | AdminProductRecord["visibility"]
  >("all")

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return rows.filter((row) => {
      if (categoryFilter !== "all" && row.categoryId !== categoryFilter) {
        return false
      }
      if (statusFilter !== "all" && row.status !== statusFilter) return false
      if (visibilityFilter !== "all" && row.visibility !== visibilityFilter) {
        return false
      }
      if (!q) return true
      const hay = [
        row.name,
        row.sku,
        row.category,
        row.brand,
        row.shortDescription,
      ]
        .join(" ")
        .toLowerCase()
      return hay.includes(q)
    })
  }, [rows, searchQuery, categoryFilter, statusFilter, visibilityFilter])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, categoryFilter, statusFilter, visibilityFilter, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  async function loadCategories() {
    const res = await fetch("/api/admin/categories", { cache: "no-store" })
    if (!res.ok) return
    setCategories((await res.json()) as CategoryRow[])
  }

  async function loadProducts() {
    const res = await fetch("/api/admin/products", { cache: "no-store" })
    if (!res.ok) return
    setRows((await res.json()) as AdminProductRecord[])
  }

  useEffect(() => {
    void loadCategories()
    void loadProducts()
  }, [])

  function handleAddProduct(product: AdminProductRecord) {
    ;(async () => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!res.ok) return
      await loadProducts()
      setPage(1)
    })()
  }

  function handleUpdateProduct(product: AdminProductRecord) {
    ;(async () => {
      if (!product.id) return
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!res.ok) return
      await loadProducts()
      setEditDialogOpen(false)
      setEditingProduct(null)
    })()
  }

  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pagedRows = filteredRows.slice(start, start + pageSize)

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)))
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-4 text-card-foreground">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Product list</h2>
            <p className="text-sm text-muted-foreground">
              Manage products shown to users from here.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per page</span>
              <select
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger
                render={
                  <Button type="button" className="w-full sm:w-auto">
                    Add product
                  </Button>
                }
              />
              <DialogContent className="max-w-4xl p-0 sm:max-w-5xl">
                <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                  <DialogTitle>Add product</DialogTitle>
                  <DialogDescription>
                    Enter full product details to display in your shop.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[75vh] overflow-y-auto p-4 pt-2 sm:p-6 sm:pt-2">
                  <ProductForm
                    key={`add-${categories.length}`}
                    onSaveProduct={handleAddProduct}
                    onSubmitted={() => setDialogOpen(false)}
                    categories={categories}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="products-search" className="text-xs text-muted-foreground">
              Search
            </Label>
            <Input
              id="products-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, SKU, category…"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="products-category-filter"
              className="text-xs text-muted-foreground"
            >
              Category
            </Label>
            <NativeSelect
              id="products-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 w-full"
              disabled={categories.length === 0}
            >
              <NativeSelectOption value="all">All categories</NativeSelectOption>
              {categories.map((c) => (
                <NativeSelectOption key={c.id} value={c.id}>
                  {c.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="products-status-filter"
              className="text-xs text-muted-foreground"
            >
              Status
            </Label>
            <NativeSelect
              id="products-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="h-9 w-full"
            >
              <NativeSelectOption value="all">All statuses</NativeSelectOption>
              <NativeSelectOption value="Published">Published</NativeSelectOption>
              <NativeSelectOption value="Draft">Draft</NativeSelectOption>
              <NativeSelectOption value="Out of stock">
                Out of stock
              </NativeSelectOption>
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="products-visibility-filter"
              className="text-xs text-muted-foreground"
            >
              Visibility
            </Label>
            <NativeSelect
              id="products-visibility-filter"
              value={visibilityFilter}
              onChange={(e) =>
                setVisibilityFilter(e.target.value as typeof visibilityFilter)
              }
              className="h-9 w-full"
            >
              <NativeSelectOption value="all">All</NativeSelectOption>
              <NativeSelectOption value="Public">Public</NativeSelectOption>
              <NativeSelectOption value="Hidden">Hidden</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filteredRows.length} of {rows.length} products
          {filteredRows.length > 0
            ? ` · Page ${safePage} of ${totalPages}`
            : null}
        </p>
      </section>

      <ProductsTable
        rows={pagedRows}
        onEdit={(product) => {
          setEditingProduct(product)
          setEditDialogOpen(true)
        }}
      />

      {totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {safePage > 1 ? (
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(safePage - 1)
                  }}
                />
              ) : (
                <span className="inline-flex h-8 min-w-[5rem] items-center justify-center rounded-lg px-2 text-sm text-muted-foreground">
                  Previous
                </span>
              )}
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === safePage}
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(p)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              {safePage < totalPages ? (
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(safePage + 1)
                  }}
                />
              ) : (
                <span className="inline-flex h-8 min-w-[5rem] items-center justify-center rounded-lg px-2 text-sm text-muted-foreground">
                  Next
                </span>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl p-0 sm:max-w-5xl">
          <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>
              Update product details and save changes.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto p-4 pt-2 sm:p-6 sm:pt-2">
            {editingProduct ? (
              <ProductForm
                key={editingProduct.id ?? editingProduct.sku}
                initialProduct={editingProduct}
                submitLabel="Update product"
                onSaveProduct={handleUpdateProduct}
                categories={categories}
                onSubmitted={() => {
                  setEditDialogOpen(false)
                  setEditingProduct(null)
                }}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
