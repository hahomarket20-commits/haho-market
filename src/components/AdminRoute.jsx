import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../supabase/client"

function AdminRoute({ children }) {

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {

    const check = async () => {

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("email", user.email)
        .single()

      if (data) setIsAdmin(true)

      setLoading(false)
    }

    check()

  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking admin...
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/" replace />

  return children
}

export default AdminRoute