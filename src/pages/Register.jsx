import { useState } from "react"
import { supabase } from "../supabase/client"
import { useNavigate, Link } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Account created successfully ✔ Check your email")
      setTimeout(() => navigate("/login"), 1500)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        {/* Logo */}
        <h1 className="text-3xl font-black text-center mb-6">
          <span className="text-yellow-400">Haho</span> Market
        </h1>

        <h2 className="text-white text-xl font-bold text-center mb-6">
          Create Account ✨
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-xl mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

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

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition ${
              loading
                ? "bg-yellow-300 text-black"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        {/* Links */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register