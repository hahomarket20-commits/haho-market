import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="bg-black text-white">

      {/* 🌟 HERO SECTION */}
      <div className="relative h-[80vh] flex items-center justify-center text-center px-6">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-black to-black"></div>

        <div className="relative z-10 max-w-3xl">

          {/* 🟡 LOGO */}
          <h1 className="text-6xl md:text-7xl font-black tracking-tight">
            <span className="text-yellow-400">Haho</span> Market
          </h1>

          <p className="text-zinc-400 mt-4 text-lg">
            Discover trending products at unbeatable prices
          </p>

          {/* Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">

            <Link
              to="/products"
              className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-bold hover:bg-yellow-300 transition"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="border border-zinc-700 px-8 py-3 rounded-2xl font-bold hover:border-yellow-400 transition"
            >
              Explore
            </Link>

          </div>

        </div>
      </div>

      {/* 🟢 FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-400 transition">
          <h3 className="text-xl font-bold mb-2">🚀 Fast Delivery</h3>
          <p className="text-zinc-400">
            Get your products delivered quickly anywhere.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-400 transition">
          <h3 className="text-xl font-bold mb-2">💰 Best Prices</h3>
          <p className="text-zinc-400">
            Competitive prices on all trending products.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-400 transition">
          <h3 className="text-xl font-bold mb-2">🔒 Secure Shopping</h3>
          <p className="text-zinc-400">
            Safe payments and trusted checkout system.
          </p>
        </div>

      </div>

      {/* 🔥 TRENDING CTA */}
      <div className="bg-zinc-900 py-16 text-center border-t border-zinc-800">

        <h2 className="text-3xl font-black">
          Trending Deals Are Waiting For You
        </h2>

        <p className="text-zinc-400 mt-2">
          Don’t miss today’s hottest products 🔥
        </p>

        <Link
          to="/products"
          className="inline-block mt-6 bg-yellow-400 text-black px-8 py-3 rounded-2xl font-bold hover:bg-yellow-300 transition"
        >
          Start Shopping
        </Link>

      </div>

    </div>
  )
}

export default Home