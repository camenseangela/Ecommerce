import { useState, useEffect } from 'react';
import { Card, Button, Alert, Loading } from '../components/ui';
import { OrderItemCard } from '../components/features';
import { orderAPI, productAPI, orderItemAPI } from '../services/api';

const INITIAL_FORM_STATE = { order: '', product: '', order_quantity: 1 };

export function OrderItemsPage() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching from:', 'http://localhost:8000/orderitems/');
      
      const [itemsRes, ordersRes, productsRes] = await Promise.all([
        orderItemAPI.getAll(),
        orderAPI.getAll(),
        productAPI.getAll()
      ]);
      
      console.log('✅ Items:', itemsRes.data);
      console.log('✅ Orders:', ordersRes.data);
      console.log('✅ Products:', productsRes.data);
      
      setItems(itemsRes.data.results || itemsRes.data);
      setOrders(ordersRes.data.results || ordersRes.data);
      setProducts(productsRes.data.results || productsRes.data);
    } catch (err) {
      console.error('❌ Full Error:', err);
      console.error('❌ Error Status:', err?.response?.status);
      console.error('❌ Error Data:', err?.response?.data);
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to fetch order items data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.orderitems_id);
    setFormData({
      order: item.order,
      product: item.product,
      order_quantity: item.order_quantity,
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
        ...formData,
        order: parseInt(formData.order),
        product: parseInt(formData.product),
        order_quantity: parseInt(formData.order_quantity)
      };

      if (editingId) {
        await orderItemAPI.update(editingId, payload);
        setSuccess('Item updated successfully!');
      } else {
        await orderItemAPI.create(payload);
        setSuccess('Item added to order!');
      }
      setFormData(INITIAL_FORM_STATE);
      setShowForm(false);
      setEditingId(null);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Operation failed. Check quantity/stock.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item from the order?')) return;
    try {
      await orderItemAPI.delete(id);
      setItems(prev => prev.filter(i => i.orderitems_id !== id));
      setSuccess('Item removed');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not delete item');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Contents</h1>
          <p className="text-gray-500 mt-1">Manage {items.length} items across all orders</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          onClick={() => {
            setShowForm(!showForm);
            if(showForm) { 
              setEditingId(null); 
              setFormData(INITIAL_FORM_STATE); 
            }
          }}
        >
          {showForm ? 'Close Panel' : '＋ Add Item to Order'}
        </Button>
      </div>

      {error && <Alert type="danger" message={error} className="mb-6" onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} className="mb-6" onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Sidebar */}
        {showForm && (
          <div className="lg:col-span-4">
            <Card className="sticky top-8 border-2 border-blue-100 shadow-xl">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? '📝 Edit Item' : '📦 Add Item to Order'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Order
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.order} 
                    onChange={(e) => setFormData({...formData, order: e.target.value})} 
                    required
                  >
                    <option value="">Choose Order ID</option>
                    {orders.map(o => (
                      <option key={o.order_id} value={o.order_id}>
                        Order #{o.order_id} - {o.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Product
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.product} 
                    onChange={(e) => setFormData({...formData, product: e.target.value})} 
                    required
                  >
                    <option value="">Choose Product</option>
                    {products.map(p => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.p_name} (${p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.order_quantity} 
                    onChange={(e) => setFormData({...formData, order_quantity: e.target.value})} 
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full" 
                  loading={formLoading}
                >
                  {editingId ? 'Update Item' : 'Add to Order'}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Items Grid */}
        <div className={showForm ? "lg:col-span-8" : "lg:col-span-12"}>
          {items.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No items added to orders yet.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              showForm 
                ? "grid-cols-1 md:grid-cols-2" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            }`}>
              {items.map((item) => (
                <OrderItemCard
                  key={item.orderitems_id}
                  item={item}
                  products={products}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() => handleDelete(item.orderitems_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}