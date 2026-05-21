type Setting = {
  label: string
  value: string
}

export function SettingsGeneralPanel({ items }: { items: Setting[] }) {
  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground">
      <h2 className="text-lg font-semibold">Store information</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
