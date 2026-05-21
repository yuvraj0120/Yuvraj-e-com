export type OrderFulfillmentStatus =
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"

export function deliveryHeadline(status: OrderFulfillmentStatus): string {
  switch (status) {
    case "Processing":
      return "Order is being prepared"
    case "Shipped":
      return "Delivery on the way"
    case "Delivered":
      return "Delivered successfully"
    case "Cancelled":
      return "Order cancelled"
  }
}

export function deliveryBadgeLabel(status: OrderFulfillmentStatus): string {
  switch (status) {
    case "Processing":
      return "Preparing"
    case "Shipped":
      return "On the way"
    case "Delivered":
      return "Delivered"
    case "Cancelled":
      return "Cancelled"
  }
}

export function deliveryBadgeClassName(status: OrderFulfillmentStatus): string {
  switch (status) {
    case "Processing":
      return "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
    case "Shipped":
      return "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100"
    case "Delivered":
      return "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
    case "Cancelled":
      return "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
  }
}
