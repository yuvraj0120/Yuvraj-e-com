type Props = {
  itemCount: number
}

export function CartHeader({ itemCount }: Props) {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Your cart
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {itemCount === 0
          ? "No items yet"
          : `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`}
      </p>
    </>
  )
}
