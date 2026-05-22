import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import toast from "react-hot-toast"

function AdminOrders() {

  const [orders, setOrders] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  // 📦 FETCH ORDERS
  const fetchOrders = async () => {

    setLoading(true)

    const { data, error } =
      await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        })

    if (error) {

      toast.error(
        "Error loading orders"
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

  // 🔁 UPDATE STATUS
  const updateStatus = async (
    id,
    status
  ) => {

    const { error } =
      await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)

    if (error) {

      toast.error(
        "Update failed"
      )

      return
    }

    toast.success(
      "Status updated"
    )

    fetchOrders()
  }

  // 🗑 DELETE ORDER
  const deleteOrder = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this order?"
      )

    if (!confirmDelete) return

    const { error } =
      await supabase
        .from("orders")
        .delete()
        .eq("id", id)

    if (error) {

      toast.error(
        "Delete failed"
      )

      return
    }

    toast.success(
      "Order deleted"
    )

    fetchOrders()
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

        <div className="text-lg animate-pulse">

          Loading orders...

        </div>

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-black text-white p-4 md:p-8">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl md:text-4xl font-black">

            Admin Orders

          </h1>

          <p className="text-zinc-500 mt-2">

            Manage customer orders

          </p>

        </div>

        <button
          onClick={fetchOrders}
          className="bg-zinc-900 border border-zinc-800 hover:border-yellow-400 px-5 py-3 rounded-2xl transition font-bold"
        >

          Refresh Orders

        </button>

      </div>

      {/* ORDERS */}
      <div className="max-w-6xl mx-auto space-y-5">

        {orders.map((order) => (

          <div
            key={order.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400 transition"
          >

            {/* TOP */}
            <div className="p-5 border-b border-zinc-800">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                {/* LEFT */}
                <div>

                  <div className="flex items-center gap-3 flex-wrap">

                    {/* 👤 NAME */}
                    <h2 className="text-xl font-black text-yellow-400">

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
                  <p className="text-zinc-500 text-sm mt-2">

                    {new Date(
                      order.created_at
                    ).toLocaleString()}

                  </p>

                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <p className="text-zinc-500 text-sm">

                    Total

                  </p>

                  <p className="text-3xl font-black text-yellow-400">

                    $
                    {Number(
                      order.total_price || 0
                    ).toFixed(2)}

                  </p>

                </div>

              </div>

            </div>

            {/* INFO */}
            <div className="p-5 grid md:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* PHONE */}
              <div className="bg-zinc-800 rounded-2xl p-4">

                <p className="text-zinc-500 text-sm mb-1">

                  Phone

                </p>

                <p className="font-bold">

                  {order.phone}

                </p>

              </div>

              {/* ADDRESS */}
              <div className="bg-zinc-800 rounded-2xl p-4">

                <p className="text-zinc-500 text-sm mb-1">

                  Address

                </p>

                <p className="font-bold line-clamp-2">

                  {order.address}

                </p>

              </div>

              {/* PAYMENT */}
              <div className="bg-zinc-800 rounded-2xl p-4">

                <p className="text-zinc-500 text-sm mb-1">

                  Payment

                </p>

                <p className="font-bold capitalize">

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

              {/* ITEMS */}
              <div className="bg-zinc-800 rounded-2xl p-4">

                <p className="text-zinc-500 text-sm mb-1">

                  Items

                </p>

                <p className="font-bold">

                  {order.items?.length ||
                    0}
                  {" "}
                  Products

                </p>

              </div>

            </div>

            {/* PRODUCTS */}
            <div className="px-5 pb-5">

              <h3 className="text-lg font-black mb-4">

                Products

              </h3>

              <div className="space-y-3">

                {order.items?.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="bg-zinc-800 rounded-2xl p-3 flex items-center gap-4"
                    >

                      {/* IMAGE */}
                      <img
                        src={
                          item.images?.[0] ||
                          item.image
                        }
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded-xl"
                      />

                      {/* INFO */}
                      <div className="flex-1">

                        <h4 className="font-bold line-clamp-1">

                          {item.title}

                        </h4>

                        <p className="text-zinc-500 text-sm mt-1">

                          Qty:
                          {" "}
                          {item.quantity ||
                            1}

                        </p>

                      </div>

                      {/* PRICE */}
                      <div className="text-yellow-400 font-black">

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

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 mt-5">

                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "pending"
                    )
                  }
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold transition"
                >

                  Pending

                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "processing"
                    )
                  }
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold transition"
                >

                  Processing

                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "shipped"
                    )
                  }
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold transition"
                >

                  Shipped

                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "delivered"
                    )
                  }
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold transition"
                >

                  Delivered

                </button>

                <button
                  onClick={() =>
                    deleteOrder(
                      order.id
                    )
                  }
                  className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold transition"
                >

                  Delete

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AdminOrders