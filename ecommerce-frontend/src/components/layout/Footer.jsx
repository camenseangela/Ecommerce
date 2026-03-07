export function Footer() {
  return (
    <footer className="bg-dark text-white mt-16 py-8">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About</h3>
            <p className="text-gray-400 text-sm">Professional ecommerce management dashboard</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-white transition">Products</a></li>
              <li><a href="/customers" className="text-gray-400 hover:text-white transition">Customers</a></li>
              <li><a href="/orders" className="text-gray-400 hover:text-white transition">Orders</a></li>
              <li><a href="/order-items" className="text-gray-400 hover:text-white transition">Order Items</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">Backend: http://localhost:8000</p>
            <p className="text-gray-400 text-sm">Frontend: http://localhost:3000</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Ecommerce Dashboard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}