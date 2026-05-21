"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  buildCartLineId,
  cartBalanceDueLater,
  cartPayableSubtotal,
} from "@/lib/cart-line"
import type { CartLine, CartLineInput, PaymentMode } from "@/lib/cart-types"

export type { CartLine, CartLineInput, PaymentMode } from "@/lib/cart-types"

const STORAGE_KEY = "Yuvraj-e-com-cart-v2"

function normalizeInput(item: CartLineInput): CartLineInput {
  const paymentType: PaymentMode =
    item.paymentType === "deposit" ? "deposit" : "full"
  let depositPerUnit =
    typeof item.depositPerUnit === "number" && !Number.isNaN(item.depositPerUnit)
      ? Math.max(0, item.depositPerUnit)
      : 0
  if (paymentType === "full") {
    depositPerUnit = 0
  }
  if (paymentType === "deposit" && depositPerUnit <= 0) {
    return { ...item, paymentType: "full", depositPerUnit: 0 }
  }
  if (depositPerUnit >= item.unitPrice) {
    return { ...item, paymentType: "full", depositPerUnit: 0 }
  }
  return { ...item, paymentType, depositPerUnit }
}

function toCartLine(input: CartLineInput, quantity: number): CartLine {
  const n = normalizeInput(input)
  return {
    ...n,
    quantity,
    lineId: buildCartLineId(
      n.productId,
      n.paymentType,
      n.depositPerUnit,
      n.variantLabel
    ),
  }
}

function migrateStoredRow(row: unknown): CartLine | null {
  if (row == null || typeof row !== "object") return null
  const r = row as Record<string, unknown>
  if (typeof r.productId !== "string") return null
  if (typeof r.quantity !== "number") return null
  if (typeof r.title !== "string") return null
  if (typeof r.imageUrl !== "string") return null
  if (typeof r.unitPrice !== "number") return null
  if (typeof r.sku !== "string") return null

  const paymentType: PaymentMode =
    r.paymentType === "deposit" ? "deposit" : "full"
  let depositPerUnit =
    typeof r.depositPerUnit === "number" && !Number.isNaN(r.depositPerUnit)
      ? r.depositPerUnit
      : 0
  if (paymentType === "full") depositPerUnit = 0

  const variantLabel =
    typeof r.variantLabel === "string" && r.variantLabel.trim()
      ? r.variantLabel.trim()
      : undefined

  const input: CartLineInput = {
    productId: r.productId,
    title: r.title,
    imageUrl: r.imageUrl,
    unitPrice: r.unitPrice,
    sku: r.sku,
    paymentType,
    depositPerUnit,
    variantLabel,
  }

  const normalized = normalizeInput(input)
  return {
    ...normalized,
    quantity: Math.min(99, Math.max(1, Math.floor(r.quantity))),
    lineId: buildCartLineId(
      normalized.productId,
      normalized.paymentType,
      normalized.depositPerUnit,
      normalized.variantLabel
    ),
  }
}

function loadStored(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const tryKeys = [STORAGE_KEY, "Yuvraj-e-com-cart-v1"]
    for (const key of tryKeys) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) continue
      const lines = parsed
        .map(migrateStoredRow)
        .filter((x): x is CartLine => x != null)
      return lines
    }
    return []
  } catch {
    return []
  }
}

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  /** Amount payable now (deposits or full price). */
  subtotal: number
  /** Remaining amount for partial lines — due on COD at delivery. */
  balanceDueLater: number
  hydrated: boolean
  addItem: (item: CartLineInput, quantity?: number) => void
  removeLine: (lineId: string) => void
  setLineQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLines(loadStored())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* ignore quota */
    }
  }, [lines, hydrated])

  const addItem = useCallback((item: CartLineInput, quantity = 1) => {
    const q = Math.min(99, Math.max(1, Math.floor(quantity)))
    const line = toCartLine(item, q)

    setLines((prev) => {
      const i = prev.findIndex((l) => l.lineId === line.lineId)
      if (i === -1) {
        return [...prev, line]
      }
      const next = [...prev]
      const merged = Math.min(99, next[i]!.quantity + q)
      next[i] = {
        ...next[i]!,
        ...line,
        quantity: merged,
      }
      return next
    })
  }, [])

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId))
  }, [])

  const clearCart = useCallback(() => {
    setLines([])
  }, [])

  const setLineQuantity = useCallback((lineId: string, quantity: number) => {
    const q = Math.floor(quantity)
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.lineId !== lineId))
      return
    }
    setLines((prev) =>
      prev.map((l) =>
        l.lineId === lineId
          ? { ...l, quantity: Math.min(99, q) }
          : l
      )
    )
  }, [])

  const itemCount = useMemo(
    () => lines.reduce((acc, l) => acc + l.quantity, 0),
    [lines]
  )

  const subtotal = useMemo(() => cartPayableSubtotal(lines), [lines])

  const balanceDueLater = useMemo(
    () => cartBalanceDueLater(lines),
    [lines]
  )

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      balanceDueLater,
      hydrated,
      addItem,
      removeLine,
      setLineQuantity,
      clearCart,
    }),
    [
      lines,
      itemCount,
      subtotal,
      balanceDueLater,
      hydrated,
      addItem,
      removeLine,
      setLineQuantity,
      clearCart,
    ]
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}
