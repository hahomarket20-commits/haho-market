import { useState } from "react"
import { supabase } from "../supabase/client"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleReset = async () => {
    if (!email) {
      setError("المرجو إدخال البريد الإلكتروني")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    })

    if (error) {
      console.log("RESET ERROR:", error.message)
      setError(error.message)
    } else {
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور ✔")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          إعادة تعيين كلمة المرور
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
        />

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        {/* Success */}
        {message && (
          <p className="text-green-400 text-sm mb-3">{message}</p>
        )}

        {/* Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold transition ${
            loading
              ? "bg-yellow-300 text-black"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          {loading ? "جارٍ الإرسال..." : "إرسال الرابط"}
        </button>

      </div>

    </div>
  )
}

export default ForgotPassword