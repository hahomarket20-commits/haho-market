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
  const [rememberMe, setRememberMe] = useState(true)

  // ⭐ NEW: mobile menu state
  const [menuOpen, setMenuOpen] = useState(false)

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

  const isAdmin = user?.user_metadata?.role === "admin"

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate("/")
  }

  const linkStyle =
    "px-3 py-1 rounded-xl font-semibold transition hover:bg-yellow-400 hover:text-black active:scale-95"

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800">

        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6">

            <Link to="/" className="text-2xl font-black">
              <span className="text-yellow-400">Haho</span>
              <span className="text-white">Market</span>
            </Link>

            {/* ⭐ MENU BUTTON (MOBILE) */}
            <button
              className="text-white text-3xl md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex gap-4">
              <Link to="/" className={`${linkStyle} text-yellow-400`}>Home</Link>
              <Link to="/products" className={`${linkStyle} text-yellow-400`}>Products</Link>
              <Link to="/orders" className={`${linkStyle} text-yellow-400`}>Orders</Link>
            </div>

          </div>

          {/* RIGHT (DESKTOP ONLY) */}
          <div className="hidden md:flex items-center gap-4 text-sm">

            <Link className={linkStyle + " text-yellow-400"} to="/wishlist">
              Wishlist {wishlist.length > 0 && (
                <span className="ml-2 text-xs bg-red-500 px-2 py-0.5 rounded-full text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link className={linkStyle + " text-yellow-400"} to="/cart">
              Cart {totalItems > 0 && (
                <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">

                <span className="text-yellow-400 font-semibold text-sm">
                  {user.email?.split("@")[0]}
                </span>

                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black shadow-lg hover:scale-105 transition"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-3 py-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  Logout
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
              >
                Login
              </Link>
            )}

          </div>

        </div>

        {/* 📱 MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-zinc-800 px-6 py-4 flex flex-col gap-3">

            <Link onClick={() => setMenuOpen(false)} to="/" className={linkStyle + " text-yellow-400"}>Home</Link>
            <Link onClick={() => setMenuOpen(false)} to="/products" className={linkStyle + " text-yellow-400"}>Products</Link>
            <Link onClick={() => setMenuOpen(false)} to="/orders" className={linkStyle + " text-yellow-400"}>Orders</Link>

            <Link onClick={() => setMenuOpen(false)} to="/wishlist" className={linkStyle + " text-yellow-400"}>Wishlist</Link>
            <Link onClick={() => setMenuOpen(false)} to="/cart" className={linkStyle + " text-yellow-400"}>Cart</Link>

          </div>
        )}

      </nav>

      {/* 🚨 LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 text-center">

            <h2 className="text-white text-lg font-bold mb-3">
              Confirm Logout
            </h2>

            <p className="text-zinc-400 text-sm mb-4">
              Are you sure you want to logout?
            </p>

            <label className="flex items-center justify-center gap-2 text-sm text-yellow-400 mb-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Keep me signed in
            </label>

            <div className="flex gap-3">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-bold"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  )
}

export default Navbar
