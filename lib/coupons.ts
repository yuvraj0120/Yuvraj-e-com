import { formatInr } from "@/lib/format-inr"

export type CouponDefinition = {
  label: string
  type: "percent" | "fixed"
  value: number
  /** Minimum cart subtotal required (INR). */
  minSubtotal?: number
}

/** Default coupons; replace with API validation later. */
export const ACTIVE_COUPONS: Record<string, CouponDefinition> = {
  SAVE10: {
    label: "10% off your order",
    type: "percent",
    value: 10,
  },
  MMC50: {
    label: "₹50 off",
    type: "fixed",
    value: 50,
  },
  WELCOME100: {
    label: "₹100 off (orders ₹500+)",
    type: "fixed",
    value: 100,
    minSubtotal: 500,
  },
}

export function parseCouponCode(raw: string) {
  return raw.trim().toUpperCase()
}

export function getCouponDiscount(
  subtotal: number,
  code: string
):
  | { ok: true; discount: number; definition: CouponDefinition }
  | { ok: false; message: string } {
  const key = parseCouponCode(code)
  if (!key) {
    return { ok: false, message: "Enter a coupon code." }
  }

  const def = ACTIVE_COUPONS[key]
  if (!def) {
    return {
      ok: false,
      message: "That code isn’t valid or has expired.",
    }
  }

  if (def.minSubtotal != null && subtotal < def.minSubtotal) {
    return {
      ok: false,
      message: `Spend at least ${formatInr(def.minSubtotal)} to use this code.`,
    }
  }

  let discount = 0
  if (def.type === "percent") {
    discount = Math.round((subtotal * def.value) / 100)
  } else {
    discount = def.value
  }

  discount = Math.max(0, Math.min(discount, subtotal))

  return { ok: true, discount, definition: def }
}

export type CouponDiscountResult = ReturnType<typeof getCouponDiscount>
