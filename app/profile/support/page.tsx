import { site } from "@/config/site"

export default function ProfileSupportPage() {
  return (
    <section className="rounded-xl border bg-card p-6 text-card-foreground">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Support</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Contact our team for any account, order, or delivery support.
      </p>

      <div className="mt-6 space-y-3 rounded-lg border p-4">
        <p className="text-sm">
          <span className="text-muted-foreground">Email: </span>
          <a
            href={`mailto:${site.contact.email}`}
            className="font-medium text-primary hover:underline"
          >
            {site.contact.email}
          </a>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Phone: </span>
          <a
            href={site.contact.phoneTel}
            className="font-medium text-primary hover:underline"
          >
            {site.contact.phone}
          </a>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Address: </span>
          {site.contact.address}
        </p>
      </div>
    </section>
  )
}
