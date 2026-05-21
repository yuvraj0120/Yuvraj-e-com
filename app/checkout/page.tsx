"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"

import {
  Cancel01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"

import {
  CheckoutBillingForm,
  emptyBillingDetails,
  validateBilling,
  type BillingDetails,
} from "@/app/checkout/_components/checkout-billing-form"
import { CheckoutOrderSummary } from "@/app/checkout/_components/checkout-order-summary"
import { buttonVariants } from "@/components/ui/button-variants"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCart } from "@/contexts/cart-context"
import { usePersistedCartCoupon } from "@/hooks/use-persisted-cart-coupon"
import { cartFullRetailSubtotal } from "@/lib/cart-line"
import { CART_COUPON_STORAGE_KEY } from "@/lib/cart-coupon-storage"
import { cn } from "@/lib/utils"
import { HugeIcon } from "@/components/ui/huge-icon"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"

type SavedAddress = {
  id: string
  label: string
  firstName: string
  lastName: string
  country: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  phone: string
  email?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const {
    lines,
    itemCount,
    subtotal,
    balanceDueLater,
    hydrated,
    clearCart,
  } = useCart()

  const [billing, setBilling] = useState<BillingDetails>(emptyBillingDetails)
  const [billingErrors, setBillingErrors] = useState<Partial<
    Record<keyof BillingDetails, string>
  > | null>(null)
  const [codAgreement, setCodAgreement] = useState(false)
  const [codAgreementError, setCodAgreementError] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed" | "pending"
  >("idle")
  const [pendingSecondsLeft, setPendingSecondsLeft] = useState(20)
  const [pendingResolving, setPendingResolving] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderReference, setOrderReference] = useState("")
  const [failedPaymentReference, setFailedPaymentReference] = useState("")
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState("")

  const {
    couponInput,
    setCouponInput,
    appliedCode,
    couponError,
    discount,
    discountResult,
    applyCoupon,
    removeCoupon,
  } = usePersistedCartCoupon({
    subtotal,
    hydrated,
    linesLength: lines.length,
  })

  const fullRetailTotal = useMemo(() => cartFullRetailSubtotal(lines), [lines])
  const totalPayOnline = Math.max(0, subtotal - discount)
  const needsPartialPath = balanceDueLater > 0
  const paymentChoice =
    balanceDueLater > 0 ? ("partial_cod" as const) : ("full_online" as const)
  const userEmail = session?.user?.email?.trim() ?? ""

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/checkout")
      return
    }
  }, [router, status])

  useEffect(() => {
    if (!hydrated) return
    if (status !== "authenticated") return
    if (lines.length === 0 && !orderPlaced) {
      router.replace("/cart")
    }
  }, [hydrated, lines.length, orderPlaced, router, status])

  useEffect(() => {
    if (!userEmail) return
    setBilling((prev) => (prev.email === userEmail ? prev : { ...prev, email: userEmail }))
  }, [userEmail])

  useEffect(() => {
    if (status !== "authenticated") return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/profile/addresses", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as SavedAddress[]
        if (!mounted) return
        setSavedAddresses(data)
      } catch {
        /* ignore */
      }
    })()
    return () => {
      mounted = false
    }
  }, [status])

  useEffect(() => {
    if (!selectedAddressId) return
    const selected = savedAddresses.find((item) => item.id === selectedAddressId)
    if (!selected) return
    setBilling((prev) => ({
      ...prev,
      firstName: selected.firstName,
      lastName: selected.lastName,
      country: selected.country,
      addressLine1: selected.addressLine1,
      addressLine2: selected.addressLine2 ?? "",
      city: selected.city,
      state: selected.state,
      pincode: selected.pincode,
      phone: selected.phone,
      email: userEmail || selected.email || prev.email,
    }))
  }, [savedAddresses, selectedAddressId, userEmail])

  async function saveOrderAndClearCart(): Promise<string | null> {
    if (placingOrder) return null
    setPlacingOrder(true)
    try {
      const customerName = `${billing.firstName} ${billing.lastName}`.trim()
      const shippingAddress = [
        billing.addressLine1,
        billing.addressLine2,
        `${billing.city}, ${billing.state} - ${billing.pincode}`,
        billing.country,
      ]
        .filter(Boolean)
        .join(", ")

      const total = Math.max(0, fullRetailTotal - discount)

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail: billing.email,
          customerPhone: billing.phone,
          shippingAddress,
          paymentOutcome: "success",
          couponCode: appliedCode,
          subtotal: fullRetailTotal,
          discount,
          total,
          lines: lines.map((line) => ({
            productId: line.productId,
            title: line.variantLabel
              ? `${line.title} (${line.variantLabel})`
              : line.title,
            sku: line.sku,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            paymentType: line.paymentType,
          })),
        }),
      })

      if (!res.ok) return null

      const created = (await res.json()) as { orderNumber?: string }
      const ref = created.orderNumber ?? ""
      setOrderReference(ref)
      setOrderPlaced(true)
      clearCart()
      setBilling(emptyBillingDetails)
      setCodAgreement(false)
      setSelectedAddressId("")
      try {
        sessionStorage.removeItem(CART_COUPON_STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return ref || null
    } catch {
      return null
    } finally {
      setPlacingOrder(false)
    }
  }

  function handlePlaceOrder() {
    const errs = validateBilling(billing)
    setBillingErrors(errs)
    if (errs) return

    if (needsPartialPath && !codAgreement) {
      setCodAgreementError(true)
      return
    }
    setCodAgreementError(false)
    setPaymentStatus("processing")
    setFailedPaymentReference("")
    setPendingSecondsLeft(20)
    setPendingResolving(false)
    setPaymentDialogOpen(true)
  }

  async function resolvePayment(status: "success" | "failed" | "pending") {
    setPaymentStatus(status)
    if (status === "failed") {
      setPendingResolving(false)
      const failRef = `PAYFAIL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
      setFailedPaymentReference(failRef)
      setPaymentDialogOpen(false)
      router.replace(`/checkout/result?type=failed&ref=${encodeURIComponent(failRef)}`)
      return
    }
    if (status === "pending") {
      const pendingRef = `PAYPENDING-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
      setPendingSecondsLeft(20)
      setPendingResolving(false)
      setPaymentDialogOpen(false)
      router.replace(`/checkout/result?type=pending&ref=${encodeURIComponent(pendingRef)}`)
      return
    }
    const ref = await saveOrderAndClearCart()
    if (ref) {
      setPaymentDialogOpen(false)
      router.replace(`/checkout/result?type=success&ref=${encodeURIComponent(ref)}`)
    }
  }

  useEffect(() => {
    if (!paymentDialogOpen || paymentStatus !== "pending") return
    if (pendingResolving) return
    if (pendingSecondsLeft <= 0) {
      ;(async () => {
        try {
          setPendingResolving(true)
          const res = await fetch("/api/payments/simulate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })
          const data = (await res.json()) as { status?: "success" | "failed" }
          if (data.status === "success") {
            setPaymentStatus("success")
            const ref = await saveOrderAndClearCart()
            if (ref) {
              setPaymentDialogOpen(false)
              router.replace(`/checkout/result?type=success&ref=${encodeURIComponent(ref)}`)
            }
          } else {
            setPaymentStatus("failed")
            const failRef = `PAYFAIL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
            setFailedPaymentReference(failRef)
            setPaymentDialogOpen(false)
            router.replace(`/checkout/result?type=failed&ref=${encodeURIComponent(failRef)}`)
          }
        } catch {
          setPaymentStatus("failed")
          const failRef = `PAYFAIL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
          setFailedPaymentReference(failRef)
          setPaymentDialogOpen(false)
          router.replace(`/checkout/result?type=failed&ref=${encodeURIComponent(failRef)}`)
        } finally {
          setPendingResolving(false)
        }
      })()
      return
    }
    const timeout = setTimeout(() => {
      setPendingSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [paymentDialogOpen, paymentStatus, pendingResolving, pendingSecondsLeft])

  if (status === "loading" || !hydrated) {
    return (
      <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm text-muted-foreground">
            {status === "loading" ? "Checking login..." : "Loading checkout…"}
          </p>
        </div>
      </main>
    )
  }

  if (status !== "authenticated") return null

  if (lines.length === 0) {
    return null
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {itemCount} item{itemCount !== 1 ? "s" : ""} — review details and pay
          online.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <div className="min-w-0 space-y-6">
            {savedAddresses.length > 0 ? (
              <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Saved addresses
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a saved address to auto-fill billing details.
                </p>
                <div className="mt-4">
                  <NativeSelect
                    className="w-full"
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  >
                    <NativeSelectOption value="">
                      Select saved address
                    </NativeSelectOption>
                    {savedAddresses.map((address) => (
                      <NativeSelectOption key={address.id} value={address.id}>
                        {address.label} - {address.firstName} {address.lastName},{" "}
                        {address.city}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              </section>
            ) : null}
            <CheckoutBillingForm
              value={billing}
              onChange={setBilling}
              lockedEmail={userEmail}
              errors={billingErrors}
            />
            <Link
              href="/cart"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex h-10 items-center justify-center px-4"
              )}
            >
              Back to cart
            </Link>
          </div>

          <CheckoutOrderSummary
            lines={lines}
            subtotal={subtotal}
            balanceDueLater={balanceDueLater}
            fullRetailTotal={fullRetailTotal}
            discount={discount}
            totalPayOnline={totalPayOnline}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            appliedCode={appliedCode}
            discountResult={discountResult}
            couponError={couponError}
            applyCoupon={applyCoupon}
            removeCoupon={removeCoupon}
            paymentChoice={paymentChoice}
            onPaymentChoiceChange={() => {}}
            codAgreement={codAgreement}
            onCodAgreementChange={(v) => {
              setCodAgreement(v)
              if (v) setCodAgreementError(false)
            }}
            codAgreementError={codAgreementError}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Cart and coupon are stored in your browser until you place an order.
        </p>
      </div>
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Payment simulation</DialogTitle>
            <DialogDescription>
              Choose payment result manually.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              Current status:{" "}
              <span className="font-medium capitalize">{paymentStatus}</span>
            </p>
            {paymentStatus === "success" ? (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
                <HugeIcon icon={Tick01Icon} size={16} />
                Payment success.
              </div>
            ) : null}
            {paymentStatus === "failed" ? (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2 text-sm text-destructive">
                <HugeIcon icon={Cancel01Icon} size={16} />
                <div>
                  <p>Payment failed.</p>
                  {failedPaymentReference ? (
                    <p className="text-xs font-medium">
                      Failure ID: {failedPaymentReference}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
            {paymentStatus === "pending" ? (
              <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  {pendingResolving ? <Spinner className="size-4" /> : null}
                  Pending selected. Auto resolving in {pendingSecondsLeft}s via
                  backend.
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col sm:justify-start">
            <Button
              type="button"
              variant="default"
              className="w-full"
              disabled={(paymentStatus === "pending" && pendingSecondsLeft > 0) || placingOrder}
              onClick={() => void resolvePayment("success")}
            >
              Payment success
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={(paymentStatus === "pending" && pendingSecondsLeft > 0) || placingOrder}
              onClick={() => void resolvePayment("pending")}
            >
              Payment pending
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={(paymentStatus === "pending" && pendingSecondsLeft > 0) || placingOrder}
              onClick={() => void resolvePayment("failed")}
            >
              Payment fail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
