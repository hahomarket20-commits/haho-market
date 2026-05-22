import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import toast from "react-hot-toast"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function AdminDashboard() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // 📦 GET ORDERS
  const fetchOrders = async () => {

    setLoading(true)

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

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

  // 💰 TOTAL SALES
  const totalSales = orders.reduce(
    (sum, order) =>
      sum + Number(order.total_price || 0),
    0
  )

  // 📦 TOTAL ORDERS
  const totalOrders = orders.length

  // 📊 AVERAGE ORDER
  const avgOrder =
    totalOrders > 0
      ? totalSales / totalOrders
      : 0

  // 📈 CHART DATA
  const chartData = orders.map(order => ({
    date: new Date(order.created_at).toLocaleDateString(),
    sales: Number(order.total_price || 0)
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HEADER */}
        <h1 className="text-4xl font-black mb-8">
          Admin Dashboard
        </h1>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400">Total Sales</p>
            <h2 className="text-3xl font-black text-yellow-400">
              ${totalSales.toFixed(2)}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400">Total Orders</p>
            <h2 className="text-3xl font-black">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400">Average Order</p>
            <h2 className="text-3xl font-black text-green-400">
              ${avgOrder.toFixed(2)}
            </h2>
          </div>

        </div>

        {/* 📈 CHART */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-black mb-5">
            Sales Overview
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#facc15"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard