import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"

function Dashboard() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // 📦 FETCH ORDERS
  const fetchOrders = async () => {

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setOrders(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 🔄 UPDATE STATUS
  const updateStatus = async (id, status) => {

    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)

    fetchOrders()
  }

  // 📊 STATS (FIXED)
  const totalSales = orders.reduce((sum, o) => {
    return sum + (Number(o.total_price) || 0)
  }, 0)

  const pendingOrders = orders.filter(o => o.status === "pending").length
  const shippedOrders = orders.filter(o => o.status === "shipped").length
  const deliveredOrders = orders.filter(o => o.status === "delivered").length

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
      <h1 className="text-4xl font-black mb-8">
        🛒 Admin Dashboard
      </h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400">Total Orders</p>
          <h2 className="text-2xl font-black">{orders.length}</h2>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400">Pending</p>
          <h2 className="text-2xl font-black text-yellow-400">
            {pendingOrders}
          </h2>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400">Shipped</p>
          <h2 className="text-2xl font-black text-blue-400">
            {shippedOrders}
          </h2>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400">Total Sales</p>
          <h2 className="text-2xl font-black text-green-400">
            ${totalSales.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">

        {orders.map(order => (

          <div
            key={order.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400 transition"
          >

            {/* TOP */}
            <div className="flex justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  👤 {order.full_name}
                </h2>

                <p className="text-zinc-400 text-sm">
                  📞 {order.phone}
                </p>

                <p className="text-zinc-400 text-sm">
                  📍 {order.address}
                </p>

              </div>

              <div className="text-right">

                <p className="text-yellow-400 font-black text-xl">
                  ${order.total_price}
                </p>

                <p className="text-xs text-zinc-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>

              </div>

            </div>

            {/* STATUS */}
            <div className="mt-4 mb-4">

              {order.status === "pending" && (
                <span className="text-yellow-400 font-bold">
                  🟡 Pending
                </span>
              )}

              {order.status === "shipped" && (
                <span className="text-blue-400 font-bold">
                  🔵 Shipped
                </span>
              )}

              {order.status === "delivered" && (
                <span className="text-green-400 font-bold">
                  🟢 Delivered
                </span>
              )}

              {!order.status && (
                <span className="text-yellow-400 font-bold">
                  🟡 Pending
                </span>
              )}

            </div>

            {/* ITEMS */}
            <div className="bg-zinc-800 rounded-xl p-4 mb-5">

              <h3 className="font-bold mb-3">
                🛍 Products
              </h3>

              {order.items?.map((item, index) => (

                <div
                  key={index}
                  className="flex justify-between border-b border-zinc-700 py-2"
                >

                  <div>
                    <p className="font-medium">
                      {item.title}
                    </p>

                    <p className="text-sm text-zinc-400">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="text-yellow-400">
                    ${item.price}
                  </p>

                </div>

              ))}

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">

              <button
                onClick={() => updateStatus(order.id, "pending")}
                className="px-3 py-1 bg-yellow-500 text-black rounded-lg"
              >
                Pending
              </button>

              <button
                onClick={() => updateStatus(order.id, "shipped")}
                className="px-3 py-1 bg-blue-500 rounded-lg"
              >
                Shipped
              </button>

              <button
                onClick={() => updateStatus(order.id, "delivered")}
                className="px-3 py-1 bg-green-500 rounded-lg"
              >
                Delivered
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Dashboard