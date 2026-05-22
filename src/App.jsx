import { Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import Checkout from "./pages/Checkout"
import MyOrders from "./pages/MyOrders"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import AdminProducts from "./pages/AdminProducts"

import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"

import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

import { NotificationProvider } from "./context/NotificationContext"
import { CouponProvider } from "./context/CouponContext"

function App() {

  return (

    <CouponProvider>

      <NotificationProvider>

        <Routes>

          {/* 🏠 HOME */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          {/* 🛍 PRODUCTS */}
          <Route
            path="/products"
            element={
              <MainLayout>
                <Products />
              </MainLayout>
            }
          />

          {/* 📦 PRODUCT DETAILS */}
          <Route
            path="/product/:id"
            element={
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            }
          />

          {/* 🛒 CART */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Cart />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* 💳 CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Checkout />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* 📦 MY ORDERS */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MyOrders />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ❤️ WISHLIST */}
          <Route
            path="/wishlist"
            element={
              <MainLayout>
                <Wishlist />
              </MainLayout>
            }
          />

          {/* 🔐 LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* 🔐 REGISTER */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* 🔐 FORGOT PASSWORD */}
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* ⚙️ ADMIN DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </AdminRoute>
            }
          />

          {/* 🧠 ADMIN ANALYTICS */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </AdminRoute>
            }
          />

          {/* 🛠 ADMIN PRODUCTS */}
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminProducts />
                </MainLayout>
              </AdminRoute>
            }
          />

          {/* ❌ 404 PAGE */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-5">

                <h1 className="text-8xl font-black text-yellow-400 mb-4">
                  404
                </h1>

                <p className="text-zinc-400 text-lg mb-6 text-center">
                  The page you are looking for does not exist
                </p>

                <a
                  href="/"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3 rounded-2xl transition"
                >
                  Back Home
                </a>

              </div>
            }
          />

        </Routes>

      </NotificationProvider>

    </CouponProvider>
  )
}

export default App