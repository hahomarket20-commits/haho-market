import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react"

import { supabase } from "../supabase/client"

import toast from "react-hot-toast"

const CouponContext =
  createContext()

export function CouponProvider({
  children,
}) {

  const [coupon, setCoupon] =
    useState(null)

  const [discount, setDiscount] =
    useState(0)

  const [loading, setLoading] =
    useState(false)

  // ✅ APPLY COUPON
  const applyCoupon =
    async (code, total) => {

      if (!code) {
        toast.error(
          "Enter coupon code"
        )
        return
      }

      try {

        setLoading(true)

        const { data, error } =
          await supabase
            .from("coupons")
            .select("*")
            .eq(
              "code",
              code.toUpperCase()
            )
            .eq("active", true)
            .single()

        if (error || !data) {

          toast.error(
            "Invalid coupon"
          )

          setLoading(false)

          return
        }

        // ❌ EXPIRED
        if (
          data.expires_at &&
          new Date(data.expires_at) <
            new Date()
        ) {

          toast.error(
            "Coupon expired"
          )

          setLoading(false)

          return
        }

        // ❌ MIN ORDER
        if (
          total <
          Number(data.min_order)
        ) {

          toast.error(
            `Minimum order is $${data.min_order}`
          )

          setLoading(false)

          return
        }

        let finalDiscount = 0

        // ✅ PERCENT
        if (
          data.type === "percent"
        ) {

          finalDiscount =
            (total * data.value) / 100
        }

        // ✅ FIXED
        if (
          data.type === "fixed"
        ) {

          finalDiscount =
            Number(data.value)
        }

        setCoupon(data)

        setDiscount(finalDiscount)

        toast.success(
          "Coupon applied 🎉"
        )

        setLoading(false)

      } catch (error) {

        console.log(error)

        setLoading(false)
      }
    }

  // ❌ REMOVE COUPON
  const removeCoupon =
    () => {

      setCoupon(null)

      setDiscount(0)

      toast.success(
        "Coupon removed"
      )
    }

  const value = useMemo(
    () => ({

      coupon,

      discount,

      loading,

      applyCoupon,

      removeCoupon,

    }),
    [
      coupon,
      discount,
      loading,
    ]
  )

  return (
    <CouponContext.Provider
      value={value}
    >
      {children}
    </CouponContext.Provider>
  )
}

export const useCoupon =
  () => useContext(CouponContext)