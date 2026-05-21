import type { CartLine, PaymentMode } from "@/lib/cart-types"

function variantIdSegment(label: string | undefined) {
  const t = label?.trim() ?? ""
  if (!t) return ""
  const slug = t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return slug || "v"
}

export function buildCartLineId(
  productId: string,
  paymentType: PaymentMode,
  depositPerUnit: number,
  variantLabel?: string
) {
  const v = variantIdSegment(variantLabel)
  const suffix = v ? `:v:${v}` : ""
  return paymentType === "deposit"
    ? `${productId}:d:${depositPerUnit}${suffix}`
    : `${productId}:full${suffix}`
}

/** Amount customer pays now per unit for this line. */
export function linePayablePerUnit(line: CartLine): number {
  if (line.paymentType === "deposit" && line.depositPerUnit > 0) {
    return line.depositPerUnit
  }
  return line.unitPrice
}

export function linePayableTotal(line: CartLine): number {
  return linePayablePerUnit(line) * line.quantity
}

/** Remaining balance for deposit lines (per full unit price). */
export function lineBalanceLaterTotal(line: CartLine): number {
  if (line.paymentType !== "deposit" || line.depositPerUnit <= 0) return 0
  const perUnit = Math.max(0, line.unitPrice - line.depositPerUnit)
  return perUnit * line.quantity
}

export function cartPayableSubtotal(lines: CartLine[]): number {
  return lines.reduce((acc, l) => acc + linePayableTotal(l), 0)
}

export function cartBalanceDueLater(lines: CartLine[]): number {
  return lines.reduce((acc, l) => acc + lineBalanceLaterTotal(l), 0)
}

/** Full shelf price × qty (before online/COD split). */
export function cartFullRetailSubtotal(lines: CartLine[]): number {
  return lines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0)
}
