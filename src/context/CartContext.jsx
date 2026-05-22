import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const CartContext = createContext()

export function CartProvider({ children }) {

  const [cart, setCart] = useState([])

  // 📥 LOAD CART
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart")
      if (saved) {
        setCart(JSON.parse(saved) || [])
      }
    } catch (err) {
      setCart([])
    }
  }, [])

  // 💾 SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // ➕ ADD TO CART
  const addToCart = (product) => {
    if (!product) return

    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id)

      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: Number(p.quantity || 1) + 1,
              }
            : p
        )
      }

      return [
        ...prev,
        {
          ...product,
          price: Number(product.price) || 0, // 🔥 FIX
          quantity: 1,
        },
      ]
    })
  }

  // ➕ INCREASE
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: Number(p.quantity || 1) + 1,
            }
          : p
      )
    )
  }

  // ➖ DECREASE
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id
            ? {
                ...p,
                quantity: Number(p.quantity || 1) - 1,
              }
            : p
        )
        .filter((p) => (p.quantity || 0) > 0)
    )
  }

  // ❌ REMOVE ITEM
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  // 🧹 CLEAR CART
  const clearCart = () => {
    setCart([])
  }

  // 💰 TOTAL PRICE (FIXED 100%)
  const totalPrice = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0
    const qty = Number(item.quantity) || 1

    return sum + price * qty
  }, 0)

  // 📦 TOTAL ITEMS
  const totalItems = cart.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 1)
  }, 0)

  const value = useMemo(
    () => ({
      cart,
      cartItems: cart,

      addToCart,
      increaseQty,
      decreaseQty,
      removeFromCart,
      clearCart,

      totalPrice,
      totalItems,
    }),
    [cart, totalPrice, totalItems]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)