import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import toast from "react-hot-toast"

function Dashboard() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // 📦 FETCH ORDERS
  const fetchOrders = async () => {

    setLoading(true)

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false
      })

    if (error) {

      console.log(error)

      toast.error("Failed to load orders")

      setLoading(false)

      return
    }

    setOrders(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 🔄 UPDATE STATUS
  const updateStatus = async (
    id,
    status
  ) => {

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)

    if (error) {

      console.log(error)

      toast.error(
        "Failed to update status"
      )

      return
    }

    toast.success(
      "Status updated"
    )

    setOrders(prev =>
      prev.map(order =>
        order.id === id
          ? { ...order, status }
          : order
      )
    )
  }

  // 🗑 DELETE ORDER
  const deleteOrder = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this order?"
      )

    if (!confirmDelete) return

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)

    if (error) {

      console.log(error)

      toast.error("Delete failed")

      return
    }

    toast.success(
      "Order deleted"
    )

    setOrders(prev =>
      prev.filter(
        order => order.id !== id
      )
    )
  }

  // 📊 STATS
  const totalSales = orders.reduce(
    (sum, o) =>
      sum +
      (Number(o.total_price) || 0),
    0
  )

  const pendingOrders =
    orders.filter(
      o => o.status === "pending"
    ).length

  const shippedOrders =
    orders.filter(
      o => o.status === "shipped"
    ).length

  const deliveredOrders =
    orders.filter(
      o => o.status === "delivered"
    ).length

  // ⏳ LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Loading dashboard...

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-black">
            🛒 Admin Dashboard
          </h1>

          <p className="text-zinc-500 mt-2">
            Manage all store orders
          </p>

        </div>

        <button
          onClick={fetchOrders}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-3 rounded-2xl font-black transition"
        >
          Refresh
        </button>

      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

        {/* TOTAL */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

          <p className="text-zinc-400">
            Total Orders
          </p>

          <h2 className="text-3xl font-black mt-2">
            {orders.length}
          </h2>

        </div>

        {/* PENDING */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

          <p className="text-zinc-400">
            Pending
          </p>

          <h2 className="text-3xl font-black text-yellow-400 mt-2">
            {pendingOrders}
          </h2>

        </div>

        {/* SHIPPED */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

          <p className="text-zinc-400">
            Shipped
          </p>

          <h2 className="text-3xl font-black text-blue-400 mt-2">
            {shippedOrders}
          </h2>

        </div>

        {/* DELIVERED */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

          <p className="text-zinc-400">
            Delivered
          </p>

          <h2 className="text-3xl font-black text-green-400 mt-2">
            {deliveredOrders}
          </h2>

        </div>

      </div>

      {/* SALES */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10">

        <p className="text-zinc-400 mb-2">
          Total Sales
        </p>

        <h2 className="text-5xl font-black text-yellow-400">
          ${totalSales.toFixed(2)}
        </h2>

      </div>

      {/* ORDERS */}
      <div className="space-y-6">

        {orders.map(order => (

          <div
            key={order.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-yellow-400 transition"
          >

            {/* TOP */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* LEFT */}
              <div>

                <h2 className="text-2xl font-black text-yellow-400">
                  👤 {order.full_name}
                </h2>

                <p className="text-zinc-400 mt-2">
                  📞 {order.phone}
                </p>

                <p className="text-zinc-400 mt-1">
                  📍 {order.address}
                </p>

                <p className="text-zinc-500 text-sm mt-3">
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>

              </div>

              {/* RIGHT */}
              <div className="text-right">

                <p className="text-zinc-500">
                  Total
                </p>

                <h2 className="text-4xl font-black text-green-400 mb-4">
                  $
                  {Number(
                    order.total_price || 0
                  ).toFixed(2)}
                </h2>

                {/* STATUS SELECT */}
                <select
                  value={
                    order.status ||
                    "pending"
                  }
                  onChange={(e) =>
                    updateStatus(
                      order.id,
                      e.target.value
                    )
                  }
                  className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-2xl font-bold outline-none"
                >

                  <option value="pending">
                    🟡 Pending
                  </option>

                  <option value="shipped">
                    🔵 Shipped
                  </option>

                  <option value="delivered">
                    🟢 Delivered
                  </option>

                </select>

              </div>

            </div>

            {/* ITEMS */}
            <div className="bg-zinc-800 rounded-2xl p-4 mt-6">

              <h3 className="font-black text-lg mb-4">
                🛍 Products
              </h3>

              <div className="space-y-3">

                {order.items?.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-zinc-700 pb-3"
                    >

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            item.images?.[0] ||
                            item.image
                          }
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />

                        <div>

                          <p className="font-bold">
                            {item.title}
                          </p>

                          <p className="text-sm text-zinc-400 mt-1">
                            Qty:
                            {" "}
                            {item.quantity || 1}
                          </p>

                        </div>

                      </div>

                      <p className="text-yellow-400 font-black">
                        $
                        {(
                          item.price *
                          (item.quantity || 1)
                        ).toFixed(2)}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end mt-5">

              <button
                onClick={() =>
                  deleteOrder(order.id)
                }
                className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-2xl font-bold transition"
              >
                Delete Order
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Dashboard