"use client"

import { useEffect, useState } from "react"

import { INDIAN_STATES } from "@/config/indian-states"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

type Address = {
  id: string
  label: string
  firstName: string
  lastName: string
  country: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  email: string
  phone: string
  pincode: string
}

const MAX_ADDRESSES = 2

export default function ProfileAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [label, setLabel] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [country, setCountry] = useState("India")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [pincode, setPincode] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/profile/addresses", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load addresses")
        const data = (await res.json()) as Address[]
        if (mounted) setAddresses(data.slice(0, MAX_ADDRESSES))
      } catch {
        if (mounted) setError("Unable to load addresses.")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  function addAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (addresses.length >= MAX_ADDRESSES) return
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !country.trim() ||
      !addressLine1.trim() ||
      !city.trim() ||
      !state.trim() ||
      !phone.trim() ||
      !pincode.trim()
    ) {
      return
    }

    ;(async () => {
      setError(null)
      const res = await fetch("/api/profile/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          firstName,
          lastName,
          country,
          addressLine1,
          addressLine2,
          city,
          state,
          email,
          phone,
          pincode,
        }),
      })
      const json = (await res.json()) as Address | { error?: string }
      if (!res.ok) {
        setError((json as { error?: string }).error ?? "Unable to save address.")
        return
      }

      setAddresses((prev) => [...prev, json as Address].slice(0, MAX_ADDRESSES))
      setLabel("")
      setFirstName("")
      setLastName("")
      setCountry("India")
      setAddressLine1("")
      setAddressLine2("")
      setCity("")
      setState("")
      setEmail("")
      setPhone("")
      setPincode("")
    })()
  }

  function removeAddress(id: string) {
    ;(async () => {
      const res = await fetch(`/api/profile/addresses/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) return
      setAddresses((prev) => prev.filter((x) => x.id !== id))
    })()
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border bg-card p-6 text-card-foreground">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Addresses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You can save up to {MAX_ADDRESSES} addresses.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 text-card-foreground">
        <h2 className="text-lg font-semibold">Saved addresses</h2>
        <div className="mt-4 grid gap-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading addresses...</p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {!loading && addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No address saved yet.</p>
          ) : (
            addresses.map((item) => (
              <article key={item.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.firstName} {item.lastName}
                    </p>
                    {item.email ? (
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">{item.phone}</p>
                    <p className="mt-1 text-sm">{item.addressLine1}</p>
                    {item.addressLine2 ? (
                      <p className="text-sm">{item.addressLine2}</p>
                    ) : null}
                    <p className="text-sm">
                      {item.city}, {item.state} - {item.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.country}</p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAddress(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <form
        onSubmit={addAddress}
        className="rounded-xl border bg-card p-6 text-card-foreground"
      >
        <h2 className="text-lg font-semibold">Add address</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="addr-label">Label</Label>
            <Input
              id="addr-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Home / Office"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-first">First name</Label>
            <Input
              id="addr-first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-last">Last name</Label>
            <Input
              id="addr-last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-country">Country / region</Label>
            <Input
              id="addr-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="addr-line1">Street address</Label>
            <Input
              id="addr-line1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="House number and street name"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="addr-line2">Address line 2 (optional)</Label>
            <Input
              id="addr-line2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Apartment, suite, unit, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-city">Town / city</Label>
            <Input
              id="addr-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-state">State</Label>
            <NativeSelect
              id="addr-state"
              className="w-full"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <NativeSelectOption value="">Select state</NativeSelectOption>
              {INDIAN_STATES.map((s) => (
                <NativeSelectOption key={s.value} value={s.value}>
                  {s.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-phone">Phone</Label>
            <Input
              id="addr-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-email">Email (optional)</Label>
            <Input
              id="addr-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-pin">PIN code</Label>
            <Input
              id="addr-pin"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
            />
          </div>
        </div>
        <div className="mt-5">
          <Button type="submit" disabled={addresses.length >= MAX_ADDRESSES}>
            {addresses.length >= MAX_ADDRESSES
              ? "Address limit reached"
              : "Save address"}
          </Button>
        </div>
      </form>
    </section>
  )
}
