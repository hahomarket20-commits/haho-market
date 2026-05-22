import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import "./index.css"

import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"

import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      {/* AUTH LAYER */}
      <AuthProvider>

        {/* CART LAYER */}
        <CartProvider>

          {/* WISHLIST LAYER */}
          <WishlistProvider>

            <App />

            {/* TOAST SYSTEM */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2500,
                style: {
                  background: "#18181b",
                  color: "#fff",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  padding: "12px",
                  fontSize: "14px",
                },
              }}
            />

          </WishlistProvider>

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
)