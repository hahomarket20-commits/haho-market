import { useCart } from "../context/CartContext"
import { useCoupon } from "../context/CouponContext"

import { useState } from "react"

import toast from "react-hot-toast"

import { supabase } from "../supabase/client"

import { Link } from "react-router-dom"

function Cart() {

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  } = useCart()

  const {
    coupon,
    discount,
    loading: couponLoading,
    applyCoupon,
    removeCoupon,
  } = useCoupon()

  const [couponCode, setCouponCode] =
    useState("")

  const [showCheckout, setShowCheckout] =
    useState(false)

  const [orderLoading, setOrderLoading] =
    useState(false)

  // 💳 PAYMENT
  const [paymentMethod, setPaymentMethod] =
    useState("cash")

  const [bankTransfer, setBankTransfer] =
    useState(false)

  const [selectedBank, setSelectedBank] =
    useState("")

  // 👤 USER INFO
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  // 💰 SUBTOTAL
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        (item.quantity || 1),
    0
  )

  // 🚚 SHIPPING
  const shipping =
    subtotal >= 100 ? 0 : 12

  // 🧾 TAX
  const tax = subtotal * 0.05

  // 💵 FINAL TOTAL
  const finalTotal =
    subtotal +
    shipping +
    tax -
    discount

  // 🛒 OPEN CHECKOUT
  const handleOrder = () => {

    if (cart.length === 0) {

      toast.error("Cart is empty")

      return
    }

    setShowCheckout(true)
  }

  // ✅ CONFIRM ORDER
  const confirmOrder =
    async () => {

      if (
        !name.trim() ||
        !phone.trim() ||
        !address.trim()
      ) {

        toast.error(
          "Please fill all fields"
        )

        return
      }

      // 🏦 CHECK BANK
      if (
        paymentMethod === "bank" &&
        !selectedBank
      ) {

        toast.error(
          "Please select a bank"
        )

        return
      }

      try {

        setOrderLoading(true)

        // 👤 USER
        const {
          data,
          error: userError,
        } =
          await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        const user = data?.user

        if (!user) {

          toast.error(
            "Please login first"
          )

          setOrderLoading(false)

          return
        }

        // 📦 INSERT ORDER
        const { error } =
          await supabase
            .from("orders")
            .insert({

              full_name: name,

              phone,

              address,

              // 💳 PAYMENT
              payment_method:
                paymentMethod,

              bank_name:
                selectedBank || null,

              total_price:
                Number(
                  finalTotal.toFixed(2)
                ),

              coupon_code:
                coupon?.code || null,

              discount_amount:
                Number(
                  discount.toFixed(2)
                ),

              shipping_fee:
                Number(
                  shipping.toFixed(2)
                ),

              tax_amount:
                Number(
                  tax.toFixed(2)
                ),

              items: cart,

              user_id: user.id,

              status: "pending",
            })

        if (error) {
          throw error
        }

        toast.success(
          "Order placed successfully 🎉"
        )

        // 🧹 RESET
        clearCart()

        removeCoupon()

        setShowCheckout(false)

        setName("")
        setPhone("")
        setAddress("")
        setCouponCode("")

        setPaymentMethod("cash")

        setSelectedBank("")

      } catch (error) {

        console.log(error)

        toast.error(
          error.message ||
          "Failed to place order"
        )

      } finally {

        setOrderLoading(false)
      }
    }

  // 🛒 EMPTY CART
  if (cart.length === 0) {

    return (

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">

        <div className="text-8xl mb-6">
          🛒
        </div>

        <h1 className="text-4xl font-black mb-3">
          Your cart is empty
        </h1>

        <p className="text-zinc-500 text-center mb-8 max-w-md">
          Looks like you haven’t added any products yet.
        </p>

        <Link
          to="/products"
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-2xl font-black transition"
        >
          Continue Shopping
        </Link>

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-black">
            Shopping Cart
          </h1>

          <p className="text-zinc-500 mt-2">
            Review your selected products before checkout
          </p>

        </div>

        {/* 🚚 FREE SHIPPING */}
        {subtotal < 100 && (

          <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-5">

            <div className="flex justify-between text-sm mb-3">

              <span>
                🚚 Free shipping progress
              </span>

              <span>
                $
                {(100 - subtotal).toFixed(
                  2
                )} left
              </span>

            </div>

            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (subtotal / 100) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>
        )}

        {/* CONTENT */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">

            {cart.map((item) => (

              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex gap-4 hover:border-yellow-400 transition"
              >

                {/* IMAGE */}
                <Link
                  to={`/product/${item.id}`}
                  className="shrink-0"
                >

                  <img
                    src={
                      item.images?.[0] ||
                      item.image
                    }
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-2xl"
                  />

                </Link>

                {/* INFO */}
                <div className="flex-1">

                  <Link
                    to={`/product/${item.id}`}
                  >

                    <h2 className="font-black text-lg hover:text-yellow-400 transition line-clamp-2">
                      {item.title}
                    </h2>

                  </Link>

                  <p className="text-zinc-500 text-sm mt-1">
                    {item.category}
                  </p>

                  <div className="mt-3 flex items-center gap-3">

                    <span className="text-yellow-400 text-2xl font-black">
                      ${item.price}
                    </span>

                    <span className="text-zinc-500 line-through text-sm">
                      $
                      {(
                        item.price *
                        1.2
                      ).toFixed(0)}
                    </span>

                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center justify-between mt-5">

                    <div className="flex items-center gap-3 bg-zinc-800 rounded-2xl px-3 py-2">

                      <button
                        onClick={() =>
                          decreaseQty(
                            item.id
                          )
                        }
                        className="w-8 h-8 rounded-xl bg-zinc-700 hover:bg-yellow-400 hover:text-black transition font-black"
                      >
                        -
                      </button>

                      <span className="font-black text-lg min-w-[20px] text-center">
                        {item.quantity || 1}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item.id
                          )
                        }
                        className="w-8 h-8 rounded-xl bg-zinc-700 hover:bg-yellow-400 hover:text-black transition font-black"
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id
                        )
                      }
                      className="text-red-500 hover:text-red-400 transition font-bold"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* RIGHT */}
          <div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sticky top-24">

              <h2 className="text-3xl font-black mb-6">
                Order Summary
              </h2>

              {/* SUMMARY */}
              <div className="space-y-4">

                <div className="flex justify-between text-zinc-400">

                  <span>
                    Items
                  </span>

                  <span>
                    {cart.length}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Subtotal
                  </span>

                  <span className="font-bold">
                    $
                    {subtotal.toFixed(
                      2
                    )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Shipping
                  </span>

                  <span className="font-bold">

                    {shipping === 0
                      ? "FREE"
                      : `$${shipping.toFixed(
                          2
                        )}`}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Tax
                  </span>

                  <span className="font-bold">
                    ${tax.toFixed(2)}
                  </span>

                </div>

                {discount > 0 && (

                  <div className="flex justify-between text-green-400">

                    <span>
                      Discount
                    </span>

                    <span>
                      -
                      $
                      {discount.toFixed(
                        2
                      )}
                    </span>

                  </div>
                )}

              </div>

              {/* 🎟 COUPON */}
              <div className="mt-6">

                {!coupon ? (

                  <div className="flex gap-2">

                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(
                          e.target.value
                        )
                      }
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-400"
                    />

                    <button
                      onClick={() =>
                        applyCoupon(
                          couponCode,
                          subtotal
                        )
                      }
                      disabled={
                        couponLoading
                      }
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 rounded-xl transition"
                    >
                      Apply
                    </button>

                  </div>

                ) : (

                  <div className="bg-green-500/10 border border-green-500 rounded-2xl p-4">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-black text-green-400">
                          {
                            coupon.code
                          }
                        </p>

                        <p className="text-xs text-zinc-400">
                          Coupon applied
                        </p>

                      </div>

                      <button
                        onClick={
                          removeCoupon
                        }
                        className="text-red-400"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                )}

              </div>

              {/* TOTAL */}
              <div className="border-t border-zinc-800 mt-6 pt-6 flex items-center justify-between">

                <span className="text-xl font-bold">
                  Final Total
                </span>

                <span className="text-3xl font-black text-yellow-400">

                  $
                  {finalTotal.toFixed(
                    2
                  )}

                </span>

              </div>

              {/* CHECKOUT */}
              <button
                onClick={handleOrder}
                className="w-full mt-8 bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl font-black text-lg transition active:scale-95"
              >
                Proceed To Checkout
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 w-full max-w-sm">

            <h2 className="text-2xl font-black mb-5 text-center">
              Confirm Order
            </h2>

            {/* NAME */}
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full mb-3 p-3 bg-zinc-800 border border-zinc-700 rounded-2xl outline-none focus:border-yellow-400"
            />

            {/* PHONE */}
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full mb-3 p-3 bg-zinc-800 border border-zinc-700 rounded-2xl outline-none focus:border-yellow-400"
            />

            {/* ADDRESS */}
            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full mb-4 p-3 bg-zinc-800 border border-zinc-700 rounded-2xl outline-none focus:border-yellow-400 min-h-[90px]"
            />

            {/* PAYMENT METHOD */}
            <div className="mb-4">

              <p className="text-zinc-400 mb-2 font-bold">
                Payment Method
              </p>

              <div className="grid grid-cols-2 gap-2">

                <button
                  onClick={() => {
                    setPaymentMethod("cash")
                    setBankTransfer(false)
                  }}
                  className={`p-3 rounded-2xl font-black transition ${
                    paymentMethod === "cash"
                      ? "bg-yellow-400 text-black"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  Cash
                </button>

                <button
                  onClick={() => {
                    setPaymentMethod("bank")
                    setBankTransfer(true)
                  }}
                  className={`p-3 rounded-2xl font-black transition ${
                    paymentMethod === "bank"
                      ? "bg-yellow-400 text-black"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  Bank Transfer
                </button>

              </div>

            </div>

            {/* 🏦 BANK TRANSFER */}
            {paymentMethod === "bank" && (

              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-4">

                <h3 className="font-black mb-3">
                  🏦 Bank Transfer Details
                </h3>

                {/* SELECT BANK */}
                <select
                  value={selectedBank}
                  onChange={(e) =>
                    setSelectedBank(
                      e.target.value
                    )
                  }
                  className="w-full mb-4 bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none focus:border-yellow-400"
                >

                  <option value="">
                    Select Your Bank
                  </option>

                  <option value="CIH Bank">
                    CIH Bank
                  </option>

                  <option value="Attijariwafa Bank">
                    Attijariwafa Bank
                  </option>

                  <option value="Banque Populaire">
                    Banque Populaire
                  </option>

                  <option value="BMCE Bank">
                    BMCE Bank
                  </option>

                </select>

                {/* BANK INFO */}
                <div className="space-y-2 text-sm">

                  <p>
                    🏦 Bank:
                    {" "}
                    <span className="font-bold">
                      CIH Bank
                    </span>
                  </p>

                  <p>
                    👤 Name:
                    {" "}
                    <span className="font-bold">
                      Your Company Name
                    </span>
                  </p>

                  <p>
                    💳 RIB:
                    {" "}
                    <span className="font-bold">
                      12345678901234567890
                    </span>
                  </p>

                </div>

                <p className="text-yellow-400 mt-4 text-sm">

                  After payment, your order
                  will be confirmed manually.

                </p>

              </div>
            )}

            {/* TOTAL */}
            <div className="bg-zinc-800 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">

              <span className="font-bold">
                Total
              </span>

              <span className="text-yellow-400 text-2xl font-black">
                $
                {finalTotal.toFixed(
                  2
                )}
              </span>

            </div>

            {/* CONFIRM */}
            <button
              onClick={confirmOrder}
              disabled={orderLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black py-3 rounded-2xl font-black transition"
            >
              {orderLoading
                ? "Processing..."
                : "Confirm Order"}
            </button>

            {/* CANCEL */}
            <button
              onClick={() =>
                setShowCheckout(false)
              }
              className="w-full mt-3 text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default Cart