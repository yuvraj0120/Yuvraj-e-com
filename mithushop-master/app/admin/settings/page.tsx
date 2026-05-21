import { site } from "@/config/site"

import { SettingsGeneralPanel } from "@/app/admin/settings/_components/settings-general-panel"

const TIMEZONE = "Asia/Kolkata"
const CURRENCY = "₹"

export default function AdminSettingsPage() {
  const items = [
    { label: "Store name", value: site.name },
    { label: "Website", value: site.url },
    { label: "Email", value: site.contact.email },
    { label: "Phone", value: site.contact.phone },
    { label: "Address", value: site.contact.address },
    { label: "Timezone", value: TIMEZONE },
    { label: "Currency", value: CURRENCY },
  ]

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Store details and defaults (read-only). Edit values in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              config/site.ts
            </code>
            .
          </p>
        </header>
        <SettingsGeneralPanel items={items} />
      </div>
    </main>
  )
}
