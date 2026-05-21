"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export default function CheckoutResultPage() {
  const params = useSearchParams()
  const rawType = params.get("type")
  const type =
    rawType === "failed" || rawType === "pending" ? rawType : "success"
  const ref = params.get("ref") ?? ""

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {type === "success"
            ? "Thank you"
            : type === "pending"
              ? "Payment pending"
              : "Payment failed"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {type === "success"
            ? "Your order was received."
            : type === "pending"
              ? "Your payment is under processing."
              : "Your payment could not be completed."}
        </p>

        <div
          className={cn(
            "mt-8 rounded-xl p-6",
            type === "success"
              ? "border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/40"
              : type === "pending"
                ? "border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40"
                : "border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40"
          )}
        >
          <p
            className={cn(
              "font-semibold",
              type === "success"
                ? "text-green-900 dark:text-green-100"
                : type === "pending"
                  ? "text-amber-900 dark:text-amber-100"
                  : "text-red-900 dark:text-red-100"
            )}
          >
            {type === "success"
              ? "Payment successful"
              : type === "pending"
                ? "Payment pending"
                : "Payment failed"}
          </p>
          <p
            className={cn(
              "mt-2 text-sm",
              type === "success"
                ? "text-green-800 dark:text-green-200/90"
                : type === "pending"
                  ? "text-amber-800 dark:text-amber-200/90"
                  : "text-red-800 dark:text-red-200/90"
            )}
          >
            {type === "success"
              ? "Order confirmed."
              : type === "pending"
                ? "Please wait while payment gets confirmed."
                : "Please try payment again."}
          </p>
          {ref ? (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                type === "success"
                  ? "text-green-900 dark:text-green-100"
                  : type === "pending"
                    ? "text-amber-900 dark:text-amber-100"
                    : "text-red-900 dark:text-red-100"
              )}
            >
              {type === "success"
                ? "Order ID"
                : type === "pending"
                  ? "Pending ID"
                  : "Failure ID"}
              : {ref}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {type === "success" ? (
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "default" }),
                "inline-flex h-10 items-center justify-center px-6"
              )}
            >
              Continue shopping
            </Link>
          ) : type === "pending" ? (
            <Link
              href="/checkout"
              className={cn(
                buttonVariants({ variant: "default" }),
                "inline-flex h-10 items-center justify-center px-6"
              )}
            >
              Back to checkout
            </Link>
          ) : (
            <Link
              href="/checkout"
              className={cn(
                buttonVariants({ variant: "default" }),
                "inline-flex h-10 items-center justify-center px-6"
              )}
            >
              Retry checkout
            </Link>
          )}
          <Link
            href="/cart"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex h-10 items-center justify-center px-6"
            )}
          >
            Go to cart
          </Link>
        </div>
      </div>
    </main>
  )
}
