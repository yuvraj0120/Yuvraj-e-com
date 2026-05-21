type DashboardKpi = {
  title: string
  value: string
  note: string
}

type DashboardKpiGridProps = {
  kpis: DashboardKpi[]
}

export function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <article
          key={kpi.title}
          className="rounded-xl border bg-card p-4 text-card-foreground"
        >
          <p className="text-sm text-muted-foreground">{kpi.title}</p>
          <p className="mt-2 text-2xl font-bold">{kpi.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{kpi.note}</p>
        </article>
      ))}
    </section>
  )
}
