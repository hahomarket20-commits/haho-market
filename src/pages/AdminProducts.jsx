import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import toast from "react-hot-toast"

function AdminProducts() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // ✏️ FORM STATE
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("")

  const [editingId, setEditingId] = useState(null)

  // 📦 GET PRODUCTS
  const fetchProducts = async () => {

    setLoading(true)

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Failed to load products")
      return
    }

    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ➕ ADD PRODUCT
  const addProduct = async () => {

    if (!title || !price) {
      toast.error("Fill required fields")
      return
    }

    const { error } = await supabase
      .from("products")
      .insert({
        title,
        price: Number(price),
        image,
        category
      })

    if (error) {
      toast.error("Error adding product")
      return
    }

    toast.success("Product added")
    resetForm()
    fetchProducts()
  }

  // ✏️ UPDATE PRODUCT
  const updateProduct = async () => {

    const { error } = await supabase
      .from("products")
      .update({
        title,
        price: Number(price),
        image,
        category
      })
      .eq("id", editingId)

    if (error) {
      toast.error("Update failed")
      return
    }

    toast.success("Product updated")
    resetForm()
    fetchProducts()
  }

  // 🗑 DELETE PRODUCT
  const deleteProduct = async (id) => {

    const confirm = window.confirm("Delete this product?")
    if (!confirm) return

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Delete failed")
      return
    }

    toast.success("Product deleted")
    fetchProducts()
  }

  // ✏️ EDIT MODE
  const startEdit = (product) => {
    setTitle(product.title)
    setPrice(product.price)
    setImage(product.image)
    setCategory(product.category)
    setEditingId(product.id)
  }

  // 🔄 RESET FORM
  const resetForm = () => {
    setTitle("")
    setPrice("")
    setImage("")
    setCategory("")
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading products...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-black mb-6">
        Admin Products Panel
      </h1>

      {/* ➕ FORM */}
      <div className="bg-zinc-900 p-6 rounded-2xl mb-8">

        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <div className="grid md:grid-cols-4 gap-3">

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 bg-zinc-800 rounded-xl"
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-3 bg-zinc-800 rounded-xl"
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="p-3 bg-zinc-800 rounded-xl"
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 bg-zinc-800 rounded-xl"
          />

        </div>

        <div className="flex gap-3 mt-4">

          {editingId ? (
            <button
              onClick={updateProduct}
              className="bg-blue-500 px-5 py-2 rounded-xl font-bold"
            >
              Update
            </button>
          ) : (
            <button
              onClick={addProduct}
              className="bg-yellow-400 text-black px-5 py-2 rounded-xl font-bold"
            >
              Add Product
            </button>
          )}

          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-600 px-5 py-2 rounded-xl"
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* 📦 PRODUCTS LIST */}
      <div className="grid md:grid-cols-3 gap-4">

        {products.map((p) => (
          <div
            key={p.id}
            className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800"
          >

            <img
              src={p.image}
              className="h-40 w-full object-cover rounded-xl mb-3"
            />

            <h3 className="font-black">{p.title}</h3>
            <p className="text-zinc-400">${p.price}</p>
            <p className="text-zinc-500 text-sm">{p.category}</p>

            <div className="flex gap-2 mt-3">

              <button
                onClick={() => startEdit(p)}
                className="bg-blue-500 px-3 py-1 rounded-xl text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 px-3 py-1 rounded-xl text-sm"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default AdminProducts