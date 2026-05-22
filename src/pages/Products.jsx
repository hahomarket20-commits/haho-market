import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import { Link } from "react-router-dom"

import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

import toast from "react-hot-toast"

function Products() {

  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [selectedCategory, setSelectedCategory] =
    useState("all")

  const [activeId, setActiveId] = useState(null)

  const { addToCart } = useCart()

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist()

  // ✅ FETCH
  useEffect(() => {

    const fetchProducts = async () => {

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.log(error.message)
        setProducts([])
      } else {
        setProducts(data || [])
      }

      // ⭐ REVIEWS
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")

      setReviews(reviewsData || [])

      setLoading(false)
    }

    fetchProducts()

  }, [])

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-white text-2xl font-black animate-pulse">
          Loading products...
        </div>

      </div>
    )
  }

  // ✅ CATEGORIES
  const categories = [
    "all",
    ...new Set(
      products.map((p) => p.category)
    ),
  ]

  // ✅ FILTER
  const filteredProducts = products.filter((p) => {

    const matchSearch = p.title
      ?.toLowerCase()
      .includes(search.toLowerCase())

    const matchPrice = maxPrice
      ? Number(p.price) <= Number(maxPrice)
      : true

    const matchCategory =
      selectedCategory === "all"
        ? true
        : p.category === selectedCategory

    return (
      matchSearch &&
      matchPrice &&
      matchCategory
    )
  })

  // ⭐ REVIEWS
  const getProductReviews = (productId) => {
    return reviews.filter(
      (r) => r.product_id === productId
    )
  }

  // ⭐ AVG
  const getAverageRating = (productId) => {

    const productReviews =
      getProductReviews(productId)

    if (productReviews.length === 0) {
      return 0
    }

    const avg =
      productReviews.reduce(
        (sum, r) => sum + r.rating,
        0
      ) / productReviews.length

    return avg.toFixed(1)
  }

  // 🛒 ADD TO CART
  const handleAddToCart = (e, product) => {

    e.preventDefault()
    e.stopPropagation()

    setActiveId(product.id)

    addToCart({
      ...product,
      quantity: 1,
    })

    toast.success("Added to cart 🛒")

    setTimeout(() => {
      setActiveId(null)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* TOP BAR */}
      <div className="bg-yellow-400 text-black text-center py-3 font-black tracking-wide text-sm">
        🔥 Free Shipping Today
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">

          <div>

            <h1 className="text-4xl md:text-5xl font-black">
              Trending Products
            </h1>

            <p className="text-zinc-500 mt-2">
              Premium shopping experience
            </p>

          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl outline-none focus:border-yellow-400 transition w-full sm:w-72"
            />

            {/* PRICE */}
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value)
              }
              className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl outline-none focus:border-yellow-400 transition w-full sm:w-40"
            />

          </div>

        </div>

        {/* CATEGORIES */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(cat)
              }
              className={`px-5 py-3 rounded-2xl whitespace-nowrap font-bold transition ${
                selectedCategory === cat
                  ? "bg-yellow-400 text-black"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-yellow-400"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">

          {filteredProducts.map((product) => (

            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group"
            >

              <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-yellow-400 transition duration-300 hover:-translate-y-1">

                {/* IMAGE */}
                <div className="relative overflow-hidden">

                  <img
                    src={
                      product.images?.[0] ||
                      product.image
                    }
                    alt={product.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* BADGE */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg">
                    HOT
                  </div>

                  {/* ❤️ */}
                  <button
                    onClick={(e) => {

                      e.preventDefault()
                      e.stopPropagation()

                      toggleWishlist(product)

                      if (
                        isInWishlist(product.id)
                      ) {
                        toast("Removed")
                      } else {
                        toast.success("Wishlist ❤️")
                      }

                    }}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                      isInWishlist(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-black/50 text-white hover:bg-yellow-400 hover:text-black"
                    }`}
                  >
                    ❤️
                  </button>

                </div>

                {/* CONTENT */}
                <div className="p-4">

                  {/* TITLE */}
                  <h2 className="font-bold text-sm line-clamp-2 min-h-[42px] hover:text-yellow-400 transition">
                    {product.title}
                  </h2>

                  {/* RATING */}
                  <div className="flex items-center gap-2 mt-2">

                    <div className="text-yellow-400 text-xs font-bold">
                      ⭐ {getAverageRating(product.id)}
                    </div>

                    <div className="text-zinc-500 text-xs">
                      ({getProductReviews(product.id).length})
                    </div>

                  </div>

                  {/* PRICE */}
                  <div className="flex items-center gap-2 mt-3">

                    <span className="text-yellow-400 text-2xl font-black">
                      ${product.price}
                    </span>

                    <span className="text-zinc-500 text-xs line-through">
                      ${(product.price * 1.2).toFixed(0)}
                    </span>

                  </div>

                  {/* CATEGORY */}
                  <p className="text-zinc-500 text-xs mt-1">
                    {product.category}
                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={(e) =>
                      handleAddToCart(e, product)
                    }
                    className={`w-full mt-4 py-3 rounded-2xl font-black transition active:scale-95 ${
                      activeId === product.id
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-black hover:bg-yellow-300"
                    }`}
                  >
                    {activeId === product.id
                      ? "Added ✔"
                      : "Add To Cart"}
                  </button>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Products