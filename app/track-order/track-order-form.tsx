"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

import { trackOrderConfig } from "@/config/track-order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("")
  const [billingEmail, setBillingEmail] = useState("")
  const [error, setError] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const oid = orderId.trim()
    const mail = billingEmail.trim()

    if (!oid) {
      setError("Enter your order ID.")
      return
    }
    if (!mail) {
      setError("Enter your billing email.")
      return
    }
    if (!isValidEmail(mail)) {
      setError("Enter a valid billing email address.")
      return
    }

    setError("")
    window.open(
      trackOrderConfig.buildTrackingUrl({
        orderId: oid,
        billingEmail: mail,
      }),
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="order-id">Order ID</Label>
        <Input
          id="order-id"
          name="order_id"
          autoComplete="off"
          inputMode="text"
          placeholder="From your order confirmation"
          value={orderId}
          onChange={(e) => {
            setOrderId(e.target.value)
            setError("")
          }}
          aria-invalid={Boolean(error)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="billing-email">Billing email</Label>
        <Input
          id="billing-email"
          name="billing_email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Same email you used at checkout"
          value={billingEmail}
          onChange={(e) => {
            setBillingEmail(e.target.value)
            setError("")
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "track-form-error" : "track-form-hint"}
          className="h-10"
        />
        {error ? (
          <p id="track-form-error" className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : (
          <p id="track-form-hint" className="text-xs text-muted-foreground">
            We&apos;ll open {trackOrderConfig.carrierLabel} in a new tab. If the
            page doesn&apos;t pre-fill, enter your order ID and billing email on
            the tracking site.
          </p>
        )}
      </div>

      <Button type="submit" className="w-full gap-1.5 sm:w-auto">
        Track order
        <ExternalLink className="size-4 opacity-80" aria-hidden />
      </Button>
    </form>
  )
}
