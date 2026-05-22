import { createContext, useContext, useEffect, useState, useMemo } from "react"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {

  const [wishlist, setWishlist] = useState([])

  // ✅ LOAD FROM LOCALSTORAGE
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist")
      if (saved) {
        setWishlist(JSON.parse(saved) || [])
      }
    } catch {
      setWishlist([])
    }
  }, [])

  // ✅ SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    )
  }, [wishlist])

  // ✅ ADD / REMOVE TOGGLE
  const toggleWishlist = (product) => {

    if (!product) return

    const exists = wishlist.find(
      (item) => item.id === product.id
    )

    if (exists) {
      // REMOVE
      setWishlist((prev) =>
        prev.filter(
          (item) => item.id !== product.id
        )
      )
    } else {
      // ADD (SAFE COPY)
      setWishlist((prev) => [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          images: product.images || [],
        },
      ])
    }
  }

  // ✅ CHECK IF EXISTS
  const isInWishlist = (id) => {
    return wishlist.some(
      (item) => item.id === id
    )
  }

  // ✅ CLEAR WISHLIST (optional but useful)
  const clearWishlist = () => {
    setWishlist([])
  }

  const value = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [wishlist]
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () =>
  useContext(WishlistContext)
