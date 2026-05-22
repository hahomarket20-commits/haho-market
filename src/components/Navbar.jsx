import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"

function Navbar() {

  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }

    getUser()
  }, [])

  const totalItems = cart?.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* 🟡 LOGO + HOME */}
        <div className="flex items-center gap-6">

          <Link to="/" className="text-2xl font-black">
            <span className="text-yellow-400">Haho</span>
            <span className="text-white">Market</span>
          </Link>

          {/* HOME LINK (اللي كان ناقص) */}
          <Link
            to="/"
            className="text-zinc-300 hover:text-white transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-zinc-300 hover:text-white transition"
          >
            Products
          </Link>

          <Link
            to="/orders"
            className="text-zinc-300 hover:text-white transition"
          >
            Orders
          </Link>

        </div>

        {/* 🛒 RIGHT SIDE */}
        <div className="flex items-center gap-5 text-sm font-medium">

          <Link to="/wishlist" className="relative text-zinc-300 hover:text-white">
            Wishlist
            {wishlist.length > 0 && (
              <span className="ml-2 text-xs bg-red-500 px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-zinc-300 hover:text-white">
            Cart
            {totalItems > 0 && (
              <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {user ? (
            <>
              <span className="text-xs text-zinc-400 hidden md:block">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            >
              Login
            </Link>
          )}

        </div>

      </div>

    </nav>
  )
}

export default Navbar