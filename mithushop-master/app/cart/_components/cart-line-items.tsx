import { CartLineControls } from "./cart-line-controls"
import type { CartLine } from "@/contexts/cart-context"

type Props = {
  lines: CartLine[]
  onRemove: (lineId: string) => void
  onQuantityChange: (lineId: string, quantity: number) => void
}

export function CartLineItems({ lines, onRemove, onQuantityChange }: Props) {
  return (
    <div className="min-w-0 flex-1 space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Items</h2>
      <div className="divide-y divide-border rounded-lg border border-border bg-background px-3 sm:px-4">
        {lines.map((line) => (
          <CartLineControls
            key={line.lineId}
            line={line}
            showDivider={false}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </div>
  )
}
