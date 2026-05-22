import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import toast from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom"

function MyOrders() {

  const [orders, setOrders] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const navigate = useNavigate()

  // 👤 GET USER
  const getUser = async () => {

    const { data } =
      await supabase.auth.getUser()

    return data?.user
  }

  // 📦 FETCH ORDERS
  const fetchOrders = async () => {

    setLoading(true)

    const user = await getUser()

    if (!user) {

      toast.error(
        "Please login first"
      )

      navigate("/login")

      return
    }

    const { data, error } =
      await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })

    if (error) {

      console.log(error)

      toast.error(
        "Failed to load orders"
      )

      setLoading(false)

      return
    }

    setOrders(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 🗑 DELETE ORDER
  const deleteOrder = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this order?"
      )

    if (!confirmDelete) return

    const user =
      await getUser()

    if (!user) {

      toast.error(
        "Unauthorized"
      )

      return
    }

    const { error } =
      await supabase
        .from("orders")
        .delete()
        .eq("id", id)
        .eq(
          "user_id",
          user.id
        )

    if (error) {

      console.log(error)

      toast.error(
        "Delete failed"
      )

      return
    }

    toast.success(
      "Order deleted 🗑️"
    )

    setOrders((prev) =>
      prev.filter(
        (o) => o.id !== id
      )
    )
  }

  // 🎨 STATUS STYLE
  const getStatusStyle = (
    status
  ) => {

    switch (status) {

      case "pending":
        return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30"

      case "processing":
        return "bg-orange-400/20 text-orange-400 border-orange-400/30"

      case "shipped":
        return "bg-blue-400/20 text-blue-400 border-blue-400/30"

      case "delivered":
        return "bg-green-400/20 text-green-400 border-green-400/30"

      default:
        return "bg-zinc-700 text-white border-zinc-600"
    }
  }

  // ⏳ LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-zinc-400 animate-pulse text-lg">

          Loading your orders...

        </div>

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl md:text-4xl font-black">

              My Orders

            </h1>

            <p className="text-zinc-500 mt-2 text-sm">

              Track and manage your purchases

            </p>

          </div>

          <button
            onClick={fetchOrders}
            className="bg-zinc-900 border border-zinc-800 hover:border-yellow-400 px-5 py-3 rounded-2xl transition font-bold"
          >

            Refresh

          </button>

        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-24">

            <div className="text-7xl mb-4">

              📦

            </div>

            <h2 className="text-3xl font-black mb-2">

              No orders yet

            </h2>

            <p className="text-zinc-500 mb-8 text-center">

              Start shopping and your orders will appear here

            </p>

            <Link
              to="/"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-2xl font-black transition"
            >

              Explore Products

            </Link>

          </div>

        ) : (

          <div className="space-y-5">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-400 transition"
              >

                {/* TOP */}
                <div className="p-4 border-b border-zinc-800">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* LEFT */}
                    <div>

                      <div className="flex items-center gap-3 flex-wrap">

                        {/* 👤 NAME */}
                        <h2 className="text-lg md:text-xl font-black text-yellow-400">

                          {order.full_name ||
                            "Customer"}

                        </h2>

                        {/* STATUS */}
                        <span
                          className={`px-3 py-1 rounded-2xl border text-xs font-bold capitalize ${getStatusStyle(
                            order.status
                          )}`}
                        >

                          {order.status ||
                            "pending"}

                        </span>

                      </div>

                      {/* DATE */}
                      <p className="text-zinc-500 mt-2 text-xs md:text-sm">

                        {new Date(
                          order.created_at
                        ).toLocaleString()}

                      </p>

                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">

                      {/* TOTAL */}
                      <div className="text-right">

                        <p className="text-zinc-500 text-xs">

                          Total

                        </p>

                        <p className="text-yellow-400 text-xl font-black">

                          $
                          {Number(
                            order.total_price || 0
                          ).toFixed(2)}

                        </p>

                      </div>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          deleteOrder(
                            order.id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-xl text-sm font-bold transition"
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

                {/* INFO */}
                <div className="p-4 grid md:grid-cols-2 gap-3">

                  {/* PHONE */}
                  <div className="bg-zinc-800 rounded-xl p-3">

                    <p className="text-zinc-500 text-xs mb-1">

                      Phone

                    </p>

                    <p className="font-bold text-sm">

                      {order.phone}

                    </p>

                  </div>

                  {/* PAYMENT */}
                  <div className="bg-zinc-800 rounded-xl p-3">

                    <p className="text-zinc-500 text-xs mb-1">

                      Payment

                    </p>

                    <p className="font-bold text-sm capitalize">

                      {order.payment_method ||
                        "cash"}

                    </p>

                    {/* 🏦 BANK */}
                    {order.bank_name && (

                      <p className="text-zinc-400 text-xs mt-2">

                        Bank:
                        {" "}
                        {order.bank_name}

                      </p>

                    )}

                  </div>

                  {/* ADDRESS */}
                  <div className="bg-zinc-800 rounded-xl p-3 md:col-span-2">

                    <p className="text-zinc-500 text-xs mb-1">

                      Address

                    </p>

                    <p className="font-bold text-sm">

                      {order.address}

                    </p>

                  </div>

                </div>

                {/* ITEMS */}
                <div className="px-4 pb-4">

                  <h3 className="text-base font-black mb-3">

                    Order Items

                  </h3>

                  <div className="space-y-3">

                    {order.items?.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="bg-zinc-800 rounded-xl p-3 flex items-center gap-3"
                        >

                          {/* IMAGE */}
                          <img
                            src={
                              item.images?.[0] ||
                              item.image
                            }
                            alt={
                              item.title
                            }
                            className="w-14 h-14 rounded-lg object-cover"
                          />

                          {/* INFO */}
                          <div className="flex-1">

                            <h4 className="font-bold text-sm line-clamp-1">

                              {
                                item.title
                              }

                            </h4>

                            <p className="text-zinc-500 text-xs mt-1">

                              Qty:
                              {" "}
                              {item.quantity ||
                                1}

                            </p>

                          </div>

                          {/* PRICE */}
                          <div className="text-yellow-400 font-black text-sm">

                            $
                            {(
                              item.price *
                              (
                                item.quantity ||
                                1
                              )
                            ).toFixed(2)}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* VIEW DETAILS */}
                  <Link
                    to={`/orders/${order.id}`}
                    className="block mt-4 bg-yellow-400 hover:bg-yellow-300 text-black text-center py-3 rounded-xl font-black transition"
                  >

                    View Details

                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default MyOrders