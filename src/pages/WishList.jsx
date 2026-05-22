import { Link } from "react-router-dom"

import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"

import toast from "react-hot-toast"

function Wishlist() {

  const {
    wishlist,
    toggleWishlist,
  } = useWishlist()

  const { addToCart } = useCart()

  // ✅ Empty State
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

        <div className="text-7xl mb-6">
          ❤️
        </div>

        <h1 className="text-4xl font-black mb-4">
          Your Wishlist Is Empty
        </h1>

        <p className="text-zinc-500 text-center max-w-md">
          Save your favorite products to buy them later.
        </p>

        <Link
          to="/products"
          className="mt-8 bg-yellow-400 text-black px-8 py-4 rounded-2xl font-bold hover:bg-yellow-300 transition"
        >
          Explore Products
        </Link>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-black">
              My Wishlist
            </h1>

            <p className="text-zinc-500 mt-2">
              Your favorite saved products
            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl text-zinc-300">
            {wishlist.length} Items
          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">

          {wishlist.map((product) => (

            <div
              key={product.id}
              className="group bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-[30px] overflow-hidden border border-zinc-800 hover:border-yellow-400 transition duration-300 hover:-translate-y-2"
            >

              {/* IMAGE */}
              <Link to={`/product/${product.id}`}>

                <div className="relative overflow-hidden">

                  <img
                    src={
                      product.images?.[0] ||
                      product.image
                    }
                    alt={product.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      toggleWishlist(product)

                      toast("Removed from wishlist")
                    }}
                    className="absolute top-4 right-4 w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center text-lg hover:scale-110 transition"
                  >
                    ❤️
                  </button>

                </div>

              </Link>

              {/* CONTENT */}
              <div className="p-5">

                <Link to={`/product/${product.id}`}>

                  <h2 className="text-lg font-bold line-clamp-1 hover:text-yellow-400 transition">
                    {product.title}
                  </h2>

                </Link>

                {/* PRICE */}
                <div className="flex items-center justify-between mt-5">

                  <span className="text-yellow-400 text-3xl font-black">
                    ${product.price}
                  </span>

                  <div className="bg-zinc-800 px-3 py-2 rounded-2xl text-xs text-zinc-300 border border-zinc-700">
                    Saved
                  </div>

                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {

                    addToCart(product)

                    toast.success("Added to cart 🛒")
                  }}
                  className="w-full mt-5 bg-yellow-400 text-black py-3 rounded-2xl font-bold hover:bg-yellow-300 transition active:scale-95"
                >
                  Add To Cart
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Wishlist