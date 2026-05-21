"use client"

import { useEffect, useMemo, useState } from "react"

import { OrderDetailsCard } from "@/app/admin/dashboard/orders/_components/order-details-card"
import { deliveryBadgeLabel } from "@/app/admin/dashboard/orders/_components/order-status-helpers"
import {
  type AdminOrderRecord,
  OrdersTable,
} from "@/app/admin/dashboard/orders/_components/orders-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

function escapeCsv(value: string | number) {
  const text = String(value).replaceAll('"', '""')
  return `"${text}"`
}

export function OrdersManager() {
  const [rows, setRows] = useState<AdminOrderRecord[]>([])
  const [query, setQuery] = useState("")
  const [deliveryFilter, setDeliveryFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [detailOrder, setDetailOrder] = useState<AdminOrderRecord | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/admin/orders", { cache: "no-store" })
      if (!res.ok) return
      const data = (await res.json()) as AdminOrderRecord[]
      setRows(data)
    })()
  }, [])

  const filteredOrders = useMemo(() => {
    return rows.filter((order) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q)

      const matchesDelivery =
        deliveryFilter === "all" || order.status === deliveryFilter
      const matchesPayment =
        paymentFilter === "all" || order.payment === paymentFilter
      return matchesQuery && matchesDelivery && matchesPayment
    })
  }, [query, rows, deliveryFilter, paymentFilter])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pagedOrders = filteredOrders.slice(start, start + pageSize)

  useEffect(() => {
    setPage(1)
  }, [query, deliveryFilter, paymentFilter, pageSize])

  function downloadReportCsv() {
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Email",
      "Phone",
      "Payment",
      "Delivery stage",
      "Shipping Method",
      "Tracking ID",
      "Subtotal",
      "Shipping",
      "Discount",
      "Total",
    ]

    const lines = filteredOrders.map((order) => [
      order.id,
      order.createdAt,
      order.customer,
      order.customerEmail,
      order.customerPhone,
      order.payment,
      deliveryBadgeLabel(order.status),
      order.shippingMethod,
      order.trackingId,
      order.subtotal,
      order.shippingCharge,
      order.discount,
      order.total,
    ])

    const csv = [headers, ...lines]
      .map((line) => line.map(escapeCsv).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-4 text-card-foreground">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2 sm:col-span-2 xl:col-span-1">
              <Label htmlFor="order-search">Search</Label>
              <Input
                id="order-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order ID, customer name or email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-delivery-filter">Delivery status</Label>
              <NativeSelect
                id="order-delivery-filter"
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value)}
                className="w-full"
              >
                <NativeSelectOption value="all">All stages</NativeSelectOption>
                <NativeSelectOption value="Processing">
                  Preparing order
                </NativeSelectOption>
                <NativeSelectOption value="Shipped">
                  On the way
                </NativeSelectOption>
                <NativeSelectOption value="Delivered">Delivered</NativeSelectOption>
                <NativeSelectOption value="Cancelled">Cancelled</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-payment-filter">Payment</Label>
              <NativeSelect
                id="order-payment-filter"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full"
              >
                <NativeSelectOption value="all">All payments</NativeSelectOption>
                <NativeSelectOption value="Paid">Paid</NativeSelectOption>
                <NativeSelectOption value="Pending">Pending</NativeSelectOption>
                <NativeSelectOption value="Refunded">Refunded</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-page-size">Per page</Label>
              <NativeSelect
                id="order-page-size"
                value={String(pageSize)}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full"
              >
                <NativeSelectOption value="20">20</NativeSelectOption>
                <NativeSelectOption value="50">50</NativeSelectOption>
                <NativeSelectOption value="100">100</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <Button
            type="button"
            className="w-full shrink-0 lg:w-auto"
            onClick={downloadReportCsv}
          >
            Download report (CSV)
          </Button>
        </div>
      </section>

      <OrdersTable rows={pagedOrders} onViewDetails={setDetailOrder} />

      <Dialog
        open={detailOrder !== null}
        onOpenChange={(open) => {
          if (!open) setDetailOrder(null)
        }}
      >
        <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b px-4 py-4 sm:px-6">
            <DialogTitle>Order details</DialogTitle>
            <DialogDescription>
              Delivery status, line items, and payment breakdown.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(90vh-7rem)] overflow-y-auto p-4 sm:p-6">
            {detailOrder ? (
              <OrderDetailsCard order={detailOrder} variant="plain" />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {safePage > 1 ? (
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
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
                    setPage(p)
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
                    setPage((p) => Math.min(totalPages, p + 1))
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
    </div>
  )
}
