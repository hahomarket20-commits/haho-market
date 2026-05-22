import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

function ProductCard({ product }) {

  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300">

      {/* IMAGE */}
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">

          <img
            src={product.image}
            className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
          />

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4">

        {/* TITLE */}
        <h2 className="font-bold text-white line-clamp-1">
          {product.title}
        </h2>

        {/* PRICE */}
        <p className="text-yellow-400 font-black mt-1 text-lg">
          ${product.price}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">

          {/* ADD TO CART */}
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-bold hover:bg-yellow-300 active:scale-95 transition"
          >
            Add to Cart
          </button>

          {/* WISHLIST */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition active:scale-95 ${
              isInWishlist(product.id)
                ? "bg-red-500 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            ♥
          </button>

        </div>

      </div>

    </div>
  )
}

export default ProductCard