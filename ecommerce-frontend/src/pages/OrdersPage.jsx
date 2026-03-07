import { useState, useEffect } from 'react';
import { Card, Button, Alert, Loading } from '../components/ui';
import { OrderCard } from '../components/features';
import { orderAPI, customerAPI } from '../services/api';

const INITIAL_FORM_STATE = { customer: '', total_amount: '', status: 'Pending' };

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes] = await Promise.all([
        orderAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setOrders(ordersRes.data.results || ordersRes.data);
      setCustomers(customersRes.data.results || customersRes.data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to fetch directory data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order) => {
    setEditingId(order.order_id);
    setFormData({
      customer: order.customer_id || order.customer, 
      total_amount: order.total_amount.toString(),
      status: order.status,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const payload = { 
        customer: parseInt(formData.customer),
        total_amount: parseFloat(formData.total_amount),
        status: formData.status
      };

      if (editingId) {
        await orderAPI.update(editingId, payload);
        setSuccess('Order updated successfully!');
      } else {
        await orderAPI.create(payload);
        setSuccess('Order placed successfully!');
      }

      setFormData(INITIAL_FORM_STATE);
      setShowForm(false);
      setEditingId(null);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Operation failed. Check order details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderAPI.delete(id);
      setOrders(prev => prev.filter(o => o.order_id !== id));
      setSuccess('Order removed');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Could not delete order');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Tracking {orders.length} active transactions</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          onClick={() => {
            setShowForm(!showForm);
            if(showForm) { setEditingId(null); setFormData(INITIAL_FORM_STATE); }
          }}
        >
          {showForm ? 'Close Panel' : '＋ Create Order'}
        </Button>
      </div>

      {error && <Alert type="danger" message={error} className="mb-6" onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} className="mb-6" onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Sidebar */}
        {showForm && (
          <div className="lg:col-span-4">
            <Card className="sticky top-8 border-2 border-blue-100 shadow-xl">
              <h2 className="text-xl font-bold mb-4">{editingId ? '📝 Edit Order' : '📦 New Order'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <select 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.customer} 
                    onChange={(e) => setFormData({...formData, customer: e.target.value})} 
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>
                        {c.first_name} {c.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      value={formData.total_amount} 
                      onChange={(e) => setFormData({...formData, total_amount: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary" className="w-full" loading={formLoading}>
                    {editingId ? 'Update Order' : 'Place Order'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Adaptive Display Grid */}
        <div className={showForm ? "lg:col-span-8" : "lg:col-span-12"}>
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No orders found.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              showForm 
                ? "grid-cols-1 md:grid-cols-2" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            }`}>
              {orders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onEdit={() => handleEditClick(order)}
                  onDelete={() => handleDelete(order.order_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}