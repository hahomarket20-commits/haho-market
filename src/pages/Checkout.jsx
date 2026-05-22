import { useCart } from "../context/CartContext"
import { useState } from "react"
import toast from "react-hot-toast"
import { supabase } from "../supabase/client"
import { useNavigate } from "react-router-dom"

function Checkout() {

  const navigate = useNavigate()

  const { cart, totalPrice, clearCart } = useCart()

  const [loading, setLoading] = useState(false)

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")

  // 🟢 PLACE ORDER
  const handlePlaceOrder = async () => {

    // ❌ prevent double click
    if (loading) return

    // ❌ validation
    if (!fullName || !phone || !city || !address) {
      toast.error("Fill all fields")
      return
    }

    if (!cart.length) {
      toast.error("Cart is empty")
      return
    }

    setLoading(true)

    try {

      // 👤 GET USER
      const { data: { user }, error: userError } =
        await supabase.auth.getUser()

      if (userError || !user) {
        toast.error("You must login first")
        navigate("/login")
        return
      }

      // 📦 INSERT ORDER
      const { error } = await supabase
        .from("orders")
        .insert([
          {
            full_name: fullName,
            phone,
            city,
            address,
            items: cart,
            total_price: Number(totalPrice),
            user_id: user.id
          }
        ])

      if (error) {
        console.log(error)
        toast.error("Order failed")
        return
      }

      toast.success("Order placed successfully 🎉")

      clearCart()
      navigate("/orders")

    } catch (err) {
      console.log(err)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2">

          <h1 className="text-3xl font-black mb-6">
            Checkout
          </h1>

          <div className="space-y-4">

            <input className="w-full p-3 bg-zinc-900 rounded-xl"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input className="w-full p-3 bg-zinc-900 rounded-xl"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input className="w-full p-3 bg-zinc-900 rounded-xl"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <textarea className="w-full p-3 bg-zinc-900 rounded-xl"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-zinc-900 p-6 rounded-2xl">

          <h2 className="text-xl font-bold mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto">

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p>{item.title}</p>
                  <p className="text-sm text-zinc-400">
                    x{item.quantity}
                  </p>
                </div>

                <p className="text-yellow-400">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))}

          </div>

          <div className="border-t border-zinc-700 mt-4 pt-4 flex justify-between">
            <p>Total</p>
            <p className="text-yellow-400 font-bold">
              ${totalPrice.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-6 bg-yellow-400 text-black py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </div>

      </div>

    </div>
  )
}

export default Checkout