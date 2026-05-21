export type PaymentMode = "full" | "deposit"

export type CartLineInput = {
  productId: string
  title: string
  imageUrl: string
  /** e.g. color name when product has variants */
  variantLabel?: string
  /** Full sale price per unit (before any deposit split). */
  unitPrice: number
  sku: string
  paymentType: PaymentMode
  /** INR per unit paid **online** now when `paymentType === "deposit"`; remainder on COD. */
  depositPerUnit: number
}

export type CartLine = CartLineInput & {
  quantity: number
  lineId: string
}
