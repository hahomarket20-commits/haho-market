import Navbar from "../components/Navbar"

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE WRAPPER */}
      <div className="flex-1">
        
        {/* CONTENT CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* 🟢 CARD LAYOUT CONTROL (important for product grids) */}
          <div className="space-y-10">
            {children}
          </div>

        </main>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} Haho Market — All rights reserved
        </div>
      </footer>

    </div>
  )
}

export default MainLayout