declare global {
  interface Window {
    __MITHU_CURRENCY__?: "₹" | "$"
  }
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
})

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

function getCurrencySymbol(): "₹" | "$" {
  if (typeof window === "undefined") return "₹"
  return window.__MITHU_CURRENCY__ === "$" ? "$" : "₹"
}

export function formatInr(n: number) {
  return getCurrencySymbol() === "$" ? usd.format(n) : inr.format(n)
}
