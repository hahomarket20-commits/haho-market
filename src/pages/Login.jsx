import { useState } from "react"
import { supabase } from "../supabase/client"
import { useNavigate, Link } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 🟡 Email login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      navigate("/")
    }

    setLoading(false)
  }

  // 🔵 Google login
  const handleGoogleLogin = async () => {
    setError("")

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        {/* Logo */}
        <h1 className="text-3xl font-black text-center mb-6">
          <span className="text-yellow-400">Haho</span> Market
        </h1>

        <h2 className="text-white text-xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:border-yellow-400 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:border-yellow-400 outline-none"
            required
          />

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition ${
              loading
                ? "bg-yellow-300 text-black"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* 🔵 Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-3 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="google"
          />
          Continue with Google
        </button>

        {/* Links */}
        <div className="text-center mt-6 text-sm text-zinc-400 space-y-2">

          <Link to="/forgot-password" className="hover:text-yellow-400 block">
            Forgot Password?
          </Link>

          <Link to="/register" className="hover:text-yellow-400 block">
            Create new account
          </Link>

        </div>

      </div>
    </div>
  )
}

export default Login