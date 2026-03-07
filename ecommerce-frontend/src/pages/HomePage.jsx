import { useState, useEffect } from 'react';
import { Card, CardHeader, Button, Alert, Loading } from '../components/ui';
import { StatCard } from '../components/features';
import { productAPI, customerAPI, orderAPI, orderItemAPI } from '../services/api';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [p, c, o, oi] = await Promise.all([
        productAPI.getAll(),
        customerAPI.getAll(),
        orderAPI.getAll(),
        orderItemAPI.getAll(),
      ]);

      setProducts(p.data.results || p.data);
      setCustomers(c.data.results || c.data);
      setOrders(o.data.results || o.data);
      setOrderItems(oi.data.results || oi.data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const totalItemsSold = orderItems.reduce((sum, item) => sum + (item.order_quantity || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time store performance and item movement.</p>
        </div>

        {error && <Alert type="danger" message={error} className="mb-8 shadow-sm" onClose={() => setError(null)} />}

        {/* Statistics Grid - Fluid Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
          <StatCard icon="🛍️" label="Products" value={products.length.toLocaleString()} color="blue" />
          <StatCard icon="👥" label="Customers" value={customers.length.toLocaleString()} color="green" />
          <StatCard icon="📋" label="Orders" value={orders.length.toLocaleString()} color="red" />
          <StatCard icon="📦" label="Items Sold" value={totalItemsSold.toLocaleString()} color="indigo" />
          <StatCard icon="💰" label="Revenue" value={`₱${totalRevenue.toLocaleString()}`} color="amber" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Efficiency Ratios - Now lg:col-span-4 for better balance */}
          <div className="xl:col-span-4">
            <Card className="h-full border-none shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
              <CardHeader
                title="📈 Efficiency"
                subtitle="Calculated metrics"
              />
              <div className="p-5 space-y-4">
                {/* Ratio Card 1 */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-shrink-0 h-12 w-12 bg-white shadow-sm text-blue-600 rounded-lg flex items-center justify-center text-xl">📊</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Order Value</p>
                    <p className="text-xl font-black text-slate-900 truncate">
                      ₱{orders.length > 0 ? (totalRevenue / orders.length).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}
                    </p>
                  </div>
                </div>

                {/* Ratio Card 2 */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-shrink-0 h-12 w-12 bg-white shadow-sm text-indigo-600 rounded-lg flex items-center justify-center text-xl">🛒</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Items Per Order</p>
                    <p className="text-xl font-black text-slate-900 truncate">
                      {orders.length > 0 ? (totalItemsSold / orders.length).toFixed(1) : '0'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Feed - xl:col-span-8 */}
          <div className="xl:col-span-8">
            <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
              <CardHeader
                title="🚀 Recent Activity"
                subtitle="Latest item movements from your orders"
              />
              <div className="px-2">
                <div className="divide-y divide-slate-100">
                  {orderItems.slice(-5).reverse().map((item) => (
                    <div key={item.orderitems_id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs">
                          #{item.order}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-slate-800 truncate text-sm">Product {item.product}</p>
                          <p className="text-[11px] text-slate-400 font-medium tracking-tight">ID: {item.orderitems_id}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold text-xs border border-indigo-100 ml-4">
                        Qty: {item.order_quantity}
                      </div>
                    </div>
                  ))}
                </div>
                
                {orderItems.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-slate-400 font-medium italic">No recent transactions found.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}