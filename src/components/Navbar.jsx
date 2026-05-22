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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }
    getUser()
  }, [])

  const totalItems = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <nav className="navbar">

      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "yellow" }}>
          HahoMarket
        </Link>

        {/* MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            fontSize: "25px",
            background: "none",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          ☰
        </button>
      </div>

      {/* DESKTOP LINKS */}
      <div className="desktop-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link onClick={() => setMenuOpen(false)} to="/">Home</Link>
          <Link onClick={() => setMenuOpen(false)} to="/products">Products</Link>
          <Link onClick={() => setMenuOpen(false)} to="/orders">Orders</Link>
          <Link onClick={() => setMenuOpen(false)} to="/wishlist">Wishlist</Link>
          <Link onClick={() => setMenuOpen(false)} to="/cart">Cart</Link>
        </div>
      )}

    </nav>
  )
}

export default Navbar