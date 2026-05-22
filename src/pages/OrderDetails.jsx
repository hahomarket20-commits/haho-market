import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase/client"

function OrderDetails() {

  const { id } = useParams()

  const [order, setOrder] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const fetchOrder = async () => {

    const { data, error } =
      await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single()

    if (!error) {
      setOrder(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchOrder()
  }, [])

  // ⏳ LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-xl font-bold animate-pulse">
          Loading order...
        </div>

      </div>
    )
  }

  // ❌ NOT FOUND
  if (!order) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-xl font-bold">
          Order not found
        </div>

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-black text-white p-4 md:p-6">

      <div className="max-w-xl mx-auto">

        {/* HEADER */}
        <h1 className="text-xl md:text-2xl font-black mb-5">

          {order.full_name || "Customer"}

        </h1>

        {/* INFO CARD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">

          <div className="space-y-3 text-sm md:text-base">

            <p>
              👤
              {" "}
              {order.full_name || "No Name"}
            </p>

            <p>
              📞
              {" "}
              {order.phone}
            </p>

            <p>
              📍
              {" "}
              {order.address}
            </p>

            {/* 💳 PAYMENT */}
            <p>
              💳
              {" "}
              Payment:
              {" "}
              <span className="capitalize font-bold">
                {order.payment_method || "cash"}
              </span>
            </p>

            {/* 🏦 BANK */}
            {order.bank_name && (

              <p>
                🏦
                {" "}
                Bank:
                {" "}
                <span className="font-bold">
                  {order.bank_name}
                </span>
              </p>

            )}

            {/* 💰 TOTAL */}
            <p className="text-yellow-400 font-bold pt-2">

              💰 Total:
              {" "}
              ${order.total_price}

            </p>

            {/* 📦 STATUS */}
            <p className="text-zinc-400 text-sm">

              Status:
              {" "}
              <span className="capitalize">
                {order.status || "pending"}
              </span>

            </p>

          </div>

        </div>

        {/* PRODUCTS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">

          <h2 className="font-black mb-4 text-lg">
            Products
          </h2>

          <div className="space-y-4">

            {order.items?.map(
              (item, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between border-b border-zinc-800 pb-3"
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3">

                    {/* IMAGE */}
                    <img
                      src={
                        item.images?.[0] ||
                        item.image
                      }
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />

                    {/* INFO */}
                    <div>

                      <p className="font-bold text-sm md:text-base line-clamp-1">
                        {item.title}
                      </p>

                      <p className="text-xs text-zinc-400">
                        Qty:
                        {" "}
                        {item.quantity || 1}
                      </p>

                    </div>

                  </div>

                  {/* PRICE */}
                  <p className="text-yellow-400 font-bold text-sm md:text-base">

                    ${item.price}

                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default OrderDetails