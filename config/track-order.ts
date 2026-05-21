/**
 * Order tracking — query keys must match your carrier portal if it supports URL params.
 * Otherwise users still land on the portal and can paste order ID / email there.
 */
export const trackOrderConfig = {
  carrierLabel: "ShipRocket",
  /** Public tracking page */
  portalUrl: "https://www.shiprocket.in/shipment-tracking/",
  /** Query parameter names appended to `portalUrl` when tracking */
  queryKeys: {
    orderId: "order_id",
    billingEmail: "email",
  },
  buildTrackingUrl(input: { orderId: string; billingEmail: string }) {
    const orderId = input.orderId.trim()
    const email = input.billingEmail.trim().toLowerCase()
    if (!orderId || !email) return trackOrderConfig.portalUrl

    const base = trackOrderConfig.portalUrl.replace(/\/?$/, "/")
    const params = new URLSearchParams()
    params.set(trackOrderConfig.queryKeys.orderId, orderId)
    params.set(trackOrderConfig.queryKeys.billingEmail, email)
    return `${base}?${params.toString()}`
  },
  tips: [
    "Use the same billing email you entered at checkout and your order ID from the confirmation email.",
    "Order ID may be labeled “Order number” or “Order #” on your receipt.",
    "If the portal doesn’t pick up the link, open it manually and search with order ID and email.",
    "Dispatch timing follows our FAQ (next business day; Saturday orders go out Monday).",
  ],
} as const
