"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

type CouponType = "PERCENT" | "FLAT"
type CouponStatus = "ACTIVE" | "INACTIVE"

type CouponRow = {
  code: string
  type: CouponType
  value: number
  usageLimit: number
  usedCount: number
  status: CouponStatus
}

export function CouponsTable() {
  const [rows, setRows] = useState<CouponRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [form, setForm] = useState({
    code: "",
    type: "PERCENT" as CouponType,
    value: 10,
    usageLimit: 100,
    status: "ACTIVE" as CouponStatus,
  })

  async function loadCoupons() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/coupons", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load coupons")
      const data = (await res.json()) as CouponRow[]
      setRows(data)
      setError(null)
    } catch {
      setError("Unable to load coupons.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCoupons()
  }, [])

  function resetForm() {
    setForm({
      code: "",
      type: "PERCENT",
      value: 10,
      usageLimit: 100,
      status: "ACTIVE",
    })
    setEditingCode(null)
  }

  async function saveCoupon() {
    if (!form.code.trim()) return
    setSaving(true)
    setError(null)
    try {
      const isEdit = Boolean(editingCode)
      const endpoint = isEdit
        ? `/api/admin/coupons/${encodeURIComponent(editingCode ?? "")}`
        : "/api/admin/coupons"
      const method = isEdit ? "PATCH" : "POST"
      const body = isEdit
        ? JSON.stringify({
            type: form.type,
            value: Number(form.value),
            usageLimit: Number(form.usageLimit),
            status: form.status,
          })
        : JSON.stringify({
            code: form.code.trim().toUpperCase(),
            type: form.type,
            value: Number(form.value),
            usageLimit: Number(form.usageLimit),
            status: form.status,
          })

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      })
      if (!res.ok) {
        const msg = (await res.json()) as { error?: string }
        throw new Error(msg.error ?? "Unable to save coupon.")
      }

      await loadCoupons()
      setCreateDialogOpen(false)
      setEditDialogOpen(false)
      resetForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save coupon.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteCoupon(code: string) {
    setError(null)
    try {
      const res = await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const msg = (await res.json()) as { error?: string }
        throw new Error(msg.error ?? "Unable to delete coupon.")
      }
      if (editingCode === code) {
        setEditDialogOpen(false)
        resetForm()
      }
      await loadCoupons()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete coupon.")
    }
  }

  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Coupon Manager</h2>
        <span
          className="inline-flex size-5 items-center justify-center rounded-full border text-xs font-bold text-muted-foreground"
          title="Coupons give discount to customers at checkout. Create code, select type (percent/flat), set value, usage limit and status."
          aria-label="Coupon help"
        >
          i
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Hover the info icon to understand how coupon settings work.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => {
            resetForm()
            setCreateDialogOpen(true)
          }}
        >
          Create Coupon
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {loading ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading coupons...</p>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left text-muted-foreground">Code</th>
              <th className="px-2 py-2 text-left text-muted-foreground">Type</th>
              <th className="px-2 py-2 text-left text-muted-foreground">Value</th>
              <th className="px-2 py-2 text-left text-muted-foreground">Usage</th>
              <th className="px-2 py-2 text-left text-muted-foreground">Status</th>
              <th className="px-2 py-2 text-right text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-2 py-4 text-muted-foreground" colSpan={6}>
                  No coupons yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.code} className="border-b last:border-0">
                  <td className="px-2 py-2 font-medium">{row.code}</td>
                  <td className="px-2 py-2">{row.type}</td>
                  <td className="px-2 py-2">
                    {row.type === "PERCENT" ? `${row.value}%` : `INR ${row.value}`}
                  </td>
                  <td className="px-2 py-2">
                    {row.usedCount}/{row.usageLimit}
                  </td>
                  <td className="px-2 py-2">{row.status}</td>
                  <td className="px-2 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCode(row.code)
                          setForm({
                            code: row.code,
                            type: row.type,
                            value: row.value,
                            usageLimit: row.usageLimit,
                            status: row.status,
                          })
                          setEditDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => void deleteCoupon(row.code)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
            <DialogDescription>
              Add a new coupon with valid type, value and usage limit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">Coupon code</p>
          <Input
            placeholder="WELCOME10"
            value={form.code}
            onChange={(e) =>
              setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
            }
          />
          <p className="text-[11px] text-muted-foreground">
            Use uppercase letters/numbers only. No spaces.
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Discount type</p>
          <NativeSelect
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CouponType }))}
          >
            <NativeSelectOption value="PERCENT">Percent</NativeSelectOption>
            <NativeSelectOption value="FLAT">Flat</NativeSelectOption>
          </NativeSelect>
          <p className="text-[11px] text-muted-foreground">
            Percent = % off, Flat = fixed INR off.
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Discount value ({form.type === "PERCENT" ? "%" : "INR"})
          </p>
          <Input
            type="number"
            min={1}
            max={form.type === "PERCENT" ? 100 : undefined}
            value={form.value}
            onChange={(e) =>
              setForm((p) => ({ ...p, value: Number(e.target.value || "0") }))
            }
            placeholder={form.type === "PERCENT" ? "10" : "100"}
          />
          <p className="text-[11px] text-muted-foreground">
            {form.type === "PERCENT"
              ? "Enter 1 to 100."
              : "Enter a positive INR amount."}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Usage limit</p>
          <Input
            type="number"
            min={1}
            value={form.usageLimit}
            onChange={(e) =>
              setForm((p) => ({ ...p, usageLimit: Number(e.target.value || "0") }))
            }
            placeholder="100"
          />
          <p className="text-[11px] text-muted-foreground">
            Max number of successful uses allowed.
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <NativeSelect
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as CouponStatus }))}
          >
            <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>
            <NativeSelectOption value="INACTIVE">Inactive</NativeSelectOption>
          </NativeSelect>
          <p className="text-[11px] text-muted-foreground">
            Inactive coupons cannot be used.
          </p>
        </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => void saveCoupon()} disabled={saving}>
              Create Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>
              Update coupon type, value, limit or status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Coupon code</p>
              <Input value={form.code} disabled />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Discount type</p>
              <NativeSelect
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value as CouponType }))
                }
              >
                <NativeSelectOption value="PERCENT">Percent</NativeSelectOption>
                <NativeSelectOption value="FLAT">Flat</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Discount value ({form.type === "PERCENT" ? "%" : "INR"})
              </p>
              <Input
                type="number"
                min={1}
                max={form.type === "PERCENT" ? 100 : undefined}
                value={form.value}
                onChange={(e) =>
                  setForm((p) => ({ ...p, value: Number(e.target.value || "0") }))
                }
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Usage limit</p>
              <Input
                type="number"
                min={1}
                value={form.usageLimit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, usageLimit: Number(e.target.value || "0") }))
                }
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <NativeSelect
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value as CouponStatus }))
                }
              >
                <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>
                <NativeSelectOption value="INACTIVE">Inactive</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void saveCoupon()} disabled={saving}>
              Update Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
