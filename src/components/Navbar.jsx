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
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }
    getUser()
  }, [])

  const totalItems = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const isAdmin = user?.user_metadata?.role === "admin"

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate("/")
  }

  const linkStyle =
    "block px-3 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black"

  return (
    <nav className="bg-black text-white border-b border-zinc-800">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold">
          <span className="text-yellow-400">Haho</span>
          <span>Market</span>
        </Link>

        {/* MENU BUTTON (MOBILE ONLY) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-3xl md:hidden"
        >
          ☰
        </button>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-4 items-center">

          <Link to="/" className="hover:text-yellow-400">Home</Link>
          <Link to="/products" className="hover:text-yellow-400">Products</Link>
          <Link to="/orders" className="hover:text-yellow-400">Orders</Link>

          <Link to="/wishlist" className="hover:text-yellow-400">
            Wishlist ({wishlist.length})
          </Link>

          <Link to="/cart" className="hover:text-yellow-400">
            Cart ({totalItems})
          </Link>

        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 px-4 py-3 space-y-2">

          <Link onClick={() => setMenuOpen(false)} to="/" className={linkStyle}>Home</Link>
          <Link onClick={() => setMenuOpen(false)} to="/products" className={linkStyle}>Products</Link>
          <Link onClick={() => setMenuOpen(false)} to="/orders" className={linkStyle}>Orders</Link>
          <Link onClick={() => setMenuOpen(false)} to="/wishlist" className={linkStyle}>Wishlist</Link>
          <Link onClick={() => setMenuOpen(false)} to="/cart" className={linkStyle}>Cart</Link>

        </div>
      )}

      {/* LOGOUT MODAL (unchanged) */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-80 text-center">

            <h2 className="text-lg font-bold mb-3">Confirm Logout</h2>

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 py-2 rounded"
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      )}

    </nav>
  )
}

export default Navbar