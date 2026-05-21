"use client"

import { INDIAN_STATES } from "@/config/indian-states"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

export type BillingDetails = {
  firstName: string
  lastName: string
  country: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
}

export const emptyBillingDetails: BillingDetails = {
  firstName: "",
  lastName: "",
  country: "India",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
}

export function validateBilling(
  f: BillingDetails
): Partial<Record<keyof BillingDetails, string>> | null {
  const errors: Partial<Record<keyof BillingDetails, string>> = {}
  if (!f.firstName.trim()) errors.firstName = "Please enter your first name."
  if (!f.lastName.trim()) errors.lastName = "Please enter your last name."
  if (!f.country.trim()) errors.country = "Please select a country."
  if (!f.addressLine1.trim()) {
    errors.addressLine1 = "Please enter your street address."
  }
  if (!f.city.trim()) errors.city = "Please enter your town or city."
  if (!f.state.trim()) errors.state = "Please select or enter your state."
  if (!/^\d{6}$/.test(f.pincode.trim())) {
    errors.pincode = "Please enter a valid 6-digit PIN code."
  }
  if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Please enter a valid phone number (at least 10 digits)."
  }
  return Object.keys(errors).length > 0 ? errors : null
}

type Props = {
  value: BillingDetails
  onChange: (next: BillingDetails) => void
  lockedEmail?: string
  errors?: Partial<Record<keyof BillingDetails, string>> | null
}

export function CheckoutBillingForm({
  value,
  onChange,
  lockedEmail,
  errors,
}: Props) {
  function patch(p: Partial<BillingDetails>) {
    onChange({ ...value, ...p })
  }

  const err = errors ?? {}

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Billing details</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the address where we should deliver your order.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bill-first">
            First name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bill-first"
            value={value.firstName}
            onChange={(e) => patch({ firstName: e.target.value })}
            autoComplete="given-name"
            aria-invalid={Boolean(err.firstName)}
          />
          {err.firstName ? (
            <p className="text-xs text-destructive" role="alert">
              {err.firstName}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bill-last">
            Last name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bill-last"
            value={value.lastName}
            onChange={(e) => patch({ lastName: e.target.value })}
            autoComplete="family-name"
            aria-invalid={Boolean(err.lastName)}
          />
          {err.lastName ? (
            <p className="text-xs text-destructive" role="alert">
              {err.lastName}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bill-country">
            Country / region <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bill-country"
            value={value.country}
            onChange={(e) => patch({ country: e.target.value })}
            autoComplete="country-name"
            aria-invalid={Boolean(err.country)}
          />
          {err.country ? (
            <p className="text-xs text-destructive" role="alert">
              {err.country}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bill-a1">
            Street address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bill-a1"
            placeholder="House number and street name"
            value={value.addressLine1}
            onChange={(e) => patch({ addressLine1: e.target.value })}
            autoComplete="address-line1"
            aria-invalid={Boolean(err.addressLine1)}
          />
          {err.addressLine1 ? (
            <p className="text-xs text-destructive" role="alert">
              {err.addressLine1}
            </p>
          ) : null}
          <Input
            id="bill-a2"
            className="mt-2"
            placeholder="Apartment, suite, unit, etc. (optional)"
            value={value.addressLine2}
            onChange={(e) => patch({ addressLine2: e.target.value })}
            autoComplete="address-line2"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bill-city">
            Town / city <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bill-city"
            value={value.city}
            onChange={(e) => patch({ city: e.target.value })}
            autoComplete="address-level2"
            aria-invalid={Boolean(err.city)}
          />
          {err.city ? (
            <p className="text-xs text-destructive" role="alert">
              {err.city}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bill-state">
            State <span className="text-destructive">*</span>
          </Label>
          <NativeSelect
            id="bill-state"
            className="w-full"
            value={value.state}
            onChange={(e) => patch({ state: e.target.value })}
            aria-invalid={Boolean(err.state)}
          >
            <NativeSelectOption value="">Select state</NativeSelectOption>
            {INDIAN_STATES.map((s) => (
              <NativeSelectOption key={s.value} value={s.value}>
                {s.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {err.state ? (
            <p className="text-xs text-destructive" role="alert">
              {err.state}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bill-pin">
            PIN code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bill-pin"
            inputMode="numeric"
            maxLength={6}
            value={value.pincode}
            onChange={(e) =>
              patch({
                pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
              })
            }
            autoComplete="postal-code"
            aria-invalid={Boolean(err.pincode)}
          />
          {err.pincode ? (
            <p className="text-xs text-destructive" role="alert">
              {err.pincode}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bill-phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bill-phone"
            type="tel"
            value={value.phone}
            onChange={(e) => patch({ phone: e.target.value })}
            autoComplete="tel"
            aria-invalid={Boolean(err.phone)}
          />
          {err.phone ? (
            <p className="text-xs text-destructive" role="alert">
              {err.phone}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bill-email">Email</Label>
          <Input
            id="bill-email"
            type="email"
            value={lockedEmail ?? value.email}
            onChange={(e) => patch({ email: e.target.value })}
            autoComplete="email"
            readOnly={Boolean(lockedEmail)}
            disabled={Boolean(lockedEmail)}
          />
        </div>
      </div>
    </section>
  )
}
