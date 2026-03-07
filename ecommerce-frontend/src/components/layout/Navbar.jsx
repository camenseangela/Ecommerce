import { useState } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white text-blue-600 rounded-lg p-2 font-bold text-lg">EC</div>
            <div>
              <div className="font-bold text-lg leading-tight">Ecommerce</div>
              <div className="text-xs text-blue-100 opacity-80">Dashboard</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 lg:gap-8">
            <a href="/" className="hover:text-blue-200 transition font-medium text-sm lg:text-base">Home</a>
            <a href="/products" className="hover:text-blue-200 transition font-medium text-sm lg:text-base">Products</a>
            <a href="/customers" className="hover:text-blue-200 transition font-medium text-sm lg:text-base">Customers</a>
            <a href="/orders" className="hover:text-blue-200 transition font-medium text-sm lg:text-base">Orders</a>
            <a href="/order-items" className="hover:text-blue-200 transition font-medium text-sm lg:text-base">Order Items</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white hover:bg-blue-700 p-2 rounded-lg transition"
          >
            {mobileOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700 pb-4 pt-2">
            <a href="/" className="block px-4 py-3 hover:bg-blue-700 transition">Home</a>
            <a href="/products" className="block px-4 py-3 hover:bg-blue-700 transition">Products</a>
            <a href="/customers" className="block px-4 py-3 hover:bg-blue-700 transition">Customers</a>
            <a href="/orders" className="block px-4 py-3 hover:bg-blue-700 transition">Orders</a>
            <a href="/order-items" className="block px-4 py-3 hover:bg-blue-700 transition">Order Items</a>
          </div>
        )}
      </div>
    </nav>
  );
}