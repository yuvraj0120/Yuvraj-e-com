"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CategoryRow = {
  id: string
  name: string
  slug: string
  productCount: number
}

export function CategoriesManager() {
  const [rows, setRows] = useState<CategoryRow[]>([])
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch("/api/admin/categories", { cache: "no-store" })
    if (!res.ok) return
    setRows((await res.json()) as CategoryRow[])
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const name = newName.trim()
    if (!name) return
    setLoading(true)
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    const json = (await res.json()) as { error?: string }
    setLoading(false)
    if (!res.ok) {
      setError(json.error ?? "Could not create category.")
      return
    }
    setNewName("")
    await load()
  }

  async function saveEdit(id: string) {
    setError(null)
    const name = editName.trim()
    if (!name) return
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    const json = (await res.json()) as { error?: string }
    setLoading(false)
    if (!res.ok) {
      setError(json.error ?? "Could not update.")
      return
    }
    setEditingId(null)
    await load()
  }

  async function handleDelete(id: string) {
    setError(null)
    if (!confirm("Delete this category? Products must be moved first.")) return
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    const json = (await res.json()) as { error?: string }
    setLoading(false)
    if (!res.ok) {
      setError(json.error ?? "Could not delete.")
      return
    }
    await load()
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-4 text-card-foreground">
        <h2 className="text-lg font-semibold">Add category</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Names appear in the shop category filter and product form dropdown.
        </p>
        <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="new-cat-name">Name</Label>
            <Input
              id="new-cat-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Mobiles"
            />
          </div>
          <Button type="submit" disabled={loading || !newName.trim()}>
            Add
          </Button>
        </form>
      </section>

      <section className="rounded-xl border bg-card p-4 text-card-foreground">
        <h2 className="text-lg font-semibold">All categories</h2>
        {error ? (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        ) : null}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Slug</th>
                <th className="px-2 py-2">Products</th>
                <th className="px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="px-2 py-2">
                    {editingId === row.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span className="font-medium">{row.name}</span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-muted-foreground">{row.slug}</td>
                  <td className="px-2 py-2 tabular-nums">{row.productCount}</td>
                  <td className="px-2 py-2 text-right">
                    {editingId === row.id ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={loading}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={loading}
                          onClick={() => void saveEdit(row.id)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(row.id)
                            setEditName(row.name)
                          }}
                        >
                          Rename
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={row.productCount > 0}
                          onClick={() => void handleDelete(row.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No categories yet. Add one above — they will show on the shop page.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
