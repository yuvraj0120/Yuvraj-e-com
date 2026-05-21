"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"

import { CART_COUPON_STORAGE_KEY } from "@/lib/cart-coupon-storage"
import { getCouponDiscount, parseCouponCode } from "@/lib/coupons"

type Args = {
  subtotal: number
  hydrated: boolean
  linesLength: number
}

export function usePersistedCartCoupon({
  subtotal,
  hydrated,
  linesLength,
}: Args) {
  const [couponInput, setCouponInputState] = useState("")
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  const discountResult = useMemo(() => {
    if (!appliedCode || subtotal <= 0) return null
    return getCouponDiscount(subtotal, appliedCode)
  }, [appliedCode, subtotal])

  const discount =
    discountResult && discountResult.ok ? discountResult.discount : 0

  useEffect(() => {
    if (!hydrated) return
    if (linesLength === 0) {
      setAppliedCode(null)
      setCouponError(null)
      try {
        sessionStorage.removeItem(CART_COUPON_STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return
    }
    try {
      const raw = sessionStorage.getItem(CART_COUPON_STORAGE_KEY)
      if (!raw) return
      const res = getCouponDiscount(subtotal, raw)
      if (res.ok) setAppliedCode(parseCouponCode(raw))
      else sessionStorage.removeItem(CART_COUPON_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [hydrated, linesLength, subtotal])

  useEffect(() => {
    if (!hydrated || !appliedCode) return
    try {
      sessionStorage.setItem(CART_COUPON_STORAGE_KEY, appliedCode)
    } catch {
      /* ignore */
    }
  }, [hydrated, appliedCode])

  useEffect(() => {
    if (!appliedCode) return
    const res = getCouponDiscount(subtotal, appliedCode)
    if (!res.ok) {
      setAppliedCode(null)
      setCouponError(res.message)
      try {
        sessionStorage.removeItem(CART_COUPON_STORAGE_KEY)
      } catch {
        /* ignore */
      }
    }
  }, [subtotal, appliedCode])

  const setCouponInput = useCallback((value: string) => {
    setCouponInputState(value)
    setCouponError(null)
  }, [])

  const applyCoupon = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      setCouponError(null)
      const code = parseCouponCode(couponInput)
      const res = getCouponDiscount(subtotal, code)
      if (!res.ok) {
        setCouponError(res.message)
        return
      }
      setAppliedCode(code)
      setCouponInputState("")
    },
    [couponInput, subtotal]
  )

  const removeCoupon = useCallback(() => {
    setAppliedCode(null)
    setCouponError(null)
    setCouponInput("")
    try {
      sessionStorage.removeItem(CART_COUPON_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return {
    couponInput,
    setCouponInput,
    appliedCode,
    couponError,
    discount,
    discountResult,
    applyCoupon,
    removeCoupon,
  }
}
