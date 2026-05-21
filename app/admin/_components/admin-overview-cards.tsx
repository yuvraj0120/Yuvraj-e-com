type OverviewItem = {
  label: string
  value: string
  change: string
}

type AdminOverviewCardsProps = {
  items: OverviewItem[]
}

export function AdminOverviewCards({ items }: AdminOverviewCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border bg-card p-4 text-card-foreground"
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold">{item.value}</p>
          <p className="mt-1 text-xs text-emerald-600">{item.change}</p>
        </article>
      ))}
    </section>
  )
}
