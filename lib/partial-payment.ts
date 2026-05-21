/**
 * Partial payment: customer pays an amount **online now**; the **rest on COD**
 * when the order is delivered.
 */

/** Standard online prepay when the item is expensive enough (see logic below). */
export const ONLINE_PARTIAL_PREPAY_INR = 500

/**
 * Amount to pay **online** per unit for the partial (deposit) path.
 * - Above ~₹550 sale price: **₹500** online, remainder on **COD at delivery**.
 * - Cheaper items: a rounded split (~45%) so at least ~₹50 stays on COD when possible.
 */
export function onlinePrepayAmount(discountPrice: number): number {
  const p = Math.max(0, discountPrice)
  if (p > ONLINE_PARTIAL_PREPAY_INR + 49) {
    return ONLINE_PARTIAL_PREPAY_INR
  }
  const codFloor = 50
  const onlineMax = p - codFloor
  if (onlineMax < 50) {
    return Math.max(1, p - 1)
  }
  const target = Math.round((p * 0.45) / 50) * 50
  const online = Math.min(onlineMax, Math.max(100, target))
  return Math.max(50, Math.min(online, p - 1))
}
