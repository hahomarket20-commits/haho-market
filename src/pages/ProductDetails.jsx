import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../supabase/client"
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

function ProductDetails() {

  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])

  const [loading, setLoading] = useState(true)

  // ✅ الصورة الحالية
  const [selectedImage, setSelectedImage] = useState("")

  // ✅ حالة زر السلة
  const [added, setAdded] = useState(false)

  // ✅ Review Form
  const [username, setUsername] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  // ✅ Scroll To Reviews
  const reviewsRef = useRef(null)

  const { addToCart } = useCart()

  // ✅ Fetch Product
  useEffect(() => {

    const fetchProduct = async () => {

      // المنتج الحالي
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.log(error.message)
      }

      setProduct(data)

      // الصورة الرئيسية
      if (data?.images?.length > 0) {
        setSelectedImage(data.images[0])
      } else {
        setSelectedImage(data?.image)
      }

      // منتجات مشابهة
      const { data: related } = await supabase
        .from("products")
        .select("*")
        .neq("id", id)
        .limit(4)

      setRelatedProducts(related || [])

      // Reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false })

      setReviews(reviewsData || [])

      setLoading(false)
    }

    fetchProduct()

  }, [id])

  // ⭐ Average Rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0

  // ✅ Add Review
  const handleAddReview = async () => {

    if (!username || !comment) {
      toast.error("Please fill all fields")
      return
    }

    const newReview = {
      product_id: id,
      username,
      rating,
      comment,
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert(newReview)
      .select()

    if (error) {
      toast.error("Failed to add review")
      return
    }

    setReviews([data[0], ...reviews])

    setUsername("")
    setComment("")
    setRating(5)

    toast.success("Review added ⭐")
  }

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading product...
        </div>
      </div>
    )
  }

  // ❌ Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Product not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div>

          {/* MAIN IMAGE */}
          <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">

            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-[500px] object-cover"
            />

          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">

            {(product.images || [product.image]).map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`border-2 rounded-2xl overflow-hidden min-w-[90px] h-[90px] transition ${
                  selectedImage === img
                    ? "border-yellow-400"
                    : "border-zinc-800"
                }`}
              >

                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />

              </button>
            ))}

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-fit sticky top-6">

          {/* BADGE */}
          <div className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full inline-block mb-4">
            BEST SELLER
          </div>

          {/* TITLE */}
          <h1 className="text-4xl font-black leading-tight">
            {product.title}
          </h1>

          {/* ⭐ RATING */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">

            <div className="text-yellow-400 text-lg font-bold">
              ⭐ {averageRating}
            </div>

            <div className="text-zinc-500">
              ({reviews.length} reviews)
            </div>

            {/* READ REVIEWS */}
            <button
              onClick={() =>
                reviewsRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="bg-zinc-800 hover:bg-yellow-400 hover:text-black transition px-4 py-2 rounded-xl text-sm font-bold"
            >
              Read Reviews
            </button>

          </div>

          {/* PRICE */}
          <div className="mt-6 flex items-center gap-4">

            <span className="text-5xl font-black text-yellow-400">
              ${product.price}
            </span>

            <span className="text-zinc-500 line-through text-xl">
              ${(product.price * 1.3).toFixed(0)}
            </span>

          </div>

          {/* DESCRIPTION */}
          <p className="text-zinc-400 mt-6 leading-8">
            {product.description}
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="bg-zinc-800 p-4 rounded-2xl">
              🚚 Free Shipping
            </div>

            <div className="bg-zinc-800 p-4 rounded-2xl">
              🔒 Secure Payment
            </div>

            <div className="bg-zinc-800 p-4 rounded-2xl">
              ⚡ Fast Delivery
            </div>

            <div className="bg-zinc-800 p-4 rounded-2xl">
              💎 Premium Quality
            </div>

          </div>

          {/* ADD TO CART */}
          <button
            onClick={() => {

              setAdded(true)

              addToCart(product)

              toast.success("Added to cart 🛒")

              setTimeout(() => {
                setAdded(false)
              }, 1000)

            }}
            className={`w-full mt-8 py-4 rounded-2xl text-lg font-black transition active:scale-95 ${
              added
                ? "bg-green-500 text-white"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            {added ? "Added ✔" : "Add To Cart"}
          </button>

        </div>

      </div>

      {/* REVIEWS */}
      <div
        ref={reviewsRef}
        className="max-w-7xl mx-auto mt-24"
      >

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-black">
            Customer Reviews
          </h2>

          <div className="text-yellow-400 text-lg font-bold">
            ⭐ {averageRating} / 5
          </div>

        </div>

        {/* ADD REVIEW */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10">

          <h3 className="text-2xl font-bold mb-6">
            Write a Review
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none focus:border-yellow-400"
            />

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none focus:border-yellow-400"
            >
              <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
              <option value={3}>⭐⭐⭐ 3 Stars</option>
              <option value={2}>⭐⭐ 2 Stars</option>
              <option value={1}>⭐ 1 Star</option>
            </select>

          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full mt-4 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none focus:border-yellow-400 min-h-[140px]"
          />

          <button
            onClick={handleAddReview}
            className="mt-5 bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black hover:bg-yellow-300 transition"
          >
            Submit Review
          </button>

        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-5">

          {reviews.length === 0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center text-zinc-500">
              No reviews yet
            </div>

          ) : (

            reviews.map((review) => (

              <div
                key={review.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h4 className="font-bold text-lg">
                      {review.username}
                    </h4>

                    <div className="text-yellow-400 mt-1">
                      {"⭐".repeat(review.rating)}
                    </div>

                  </div>

                  <div className="text-zinc-500 text-sm">
                    {new Date(
                      review.created_at
                    ).toLocaleDateString()}
                  </div>

                </div>

                <p className="text-zinc-400 mt-5 leading-7">
                  {review.comment}
                </p>

              </div>

            ))

          )}

        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-7xl mx-auto mt-24">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-black">
            Related Products
          </h2>

          <Link
            to="/products"
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            View All →
          </Link>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {relatedProducts.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-yellow-400 transition duration-300 hover:-translate-y-2"
            >

              <div className="overflow-hidden">

                <img
                  src={item.images?.[0] || item.image}
                  alt={item.title}
                  className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
                />

              </div>

              <div className="p-5">

                <h3 className="font-bold line-clamp-1 group-hover:text-yellow-400 transition">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between mt-4">

                  <span className="text-yellow-400 text-2xl font-black">
                    ${item.price}
                  </span>

                  <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                    HOT
                  </div>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>

    </div>
  )
}

export default ProductDetails