import { useState, useEffect } from 'react';
import { Card, Button, Alert, Loading } from '../components/ui';
import { ProductCard } from '../components/features';
import { productAPI } from '../services/api';

const INITIAL_FORM_STATE = { p_name: '', price: '', description: '', quantity: '' };

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingId, setEditingId] = useState(null); 
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data.results || res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePanel = () => {
    setShowForm(false);
    setViewingProduct(null);
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleViewClick = (product) => {
    setEditingId(null);
    setShowForm(false);
    setViewingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = (product) => {
    setViewingProduct(null);
    setEditingId(product.product_id);
    setFormData({
      p_name: product.p_name,
      price: product.price.toString(),
      description: product.description,
      quantity: product.quantity.toString(),
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
        price: parseFloat(formData.price), 
        quantity: parseInt(formData.quantity) 
      };

      if (editingId) {
        await productAPI.update(editingId, payload);
        setSuccess('Product updated successfully!');
      } else {
        await productAPI.create(payload);
        setSuccess('Product added successfully!');
      }

      handleClosePanel();
      await fetchProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts(prev => prev.filter(p => p.product_id !== id));
      setSuccess('Product removed');
      if (viewingProduct?.product_id === id) handleClosePanel();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Could not delete product');
    }
  };

  if (loading) return <Loading />;

  const isSidebarOpen = !!(showForm || viewingProduct);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section - Restored to your original consistent style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Product Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your {products.length} stock items</p>
        </div>
        <Button 
          variant={isSidebarOpen ? 'secondary' : 'primary'} 
          onClick={isSidebarOpen ? handleClosePanel : () => setShowForm(true)}
        >
          {isSidebarOpen ? 'Close Panel' : '＋ New Product'}
        </Button>
      </div>

      {error && <Alert type="danger" message={error} className="mb-6" onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} className="mb-6" onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Functional Sidebar */}
        {isSidebarOpen && (
          <div className="lg:col-span-4 transition-all duration-300">
            <Card className="sticky top-8 border-2 border-blue-100 shadow-xl p-0 overflow-hidden bg-white">
              
              {/* --- PRACTICAL VIEW MODE --- */}
              {viewingProduct && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                    <button onClick={handleClosePanel} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Name</label>
                      <p className="text-xl font-extrabold text-gray-900 leading-tight">{viewingProduct.p_name}</p>
                    </div>

                    {/* High-density grid for stats */}
                    <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-white p-4">
                        <label className="text-[10px] font-bold text-blue-500 uppercase block mb-1">Price</label>
                        <span className="text-lg font-black text-blue-700">₱{parseFloat(viewingProduct.price).toLocaleString()}</span>
                      </div>
                      <div className="bg-white p-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Stock</label>
                        <span className={`text-lg font-black ${viewingProduct.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {viewingProduct.quantity} <small className="text-xs font-normal">units</small>
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                      <div className="mt-2 bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-100 leading-relaxed min-h-[100px]">
                        {viewingProduct.description || "No description provided."}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button variant="primary" className="w-full py-3 shadow-md" onClick={() => handleEditClick(viewingProduct)}>
                        Edit Product Data
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PRACTICAL FORM MODE --- */}
              {showForm && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingId ? '📝 Update Item' : '📦 New Entry'}
                    </h2>
                    <button onClick={handleClosePanel} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700">Product Name</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.p_name} onChange={(e) => setFormData({...formData, p_name: e.target.value})} required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Price (₱)</label>
                        <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                          value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Quantity</label>
                        <input type="number" className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                          value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700">Description</label>
                      <textarea rows="4" className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all" 
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="secondary" className="flex-1" onClick={handleClosePanel}>Cancel</Button>
                      <Button type="submit" variant="primary" className="flex-[2]" loading={formLoading}>
                        {editingId ? 'Save Changes' : 'Publish Product'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Product List Grid */}
        <div className={isSidebarOpen ? "lg:col-span-8" : "lg:col-span-12"}>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No items found in inventory.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${isSidebarOpen ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onView={() => handleViewClick(product)}
                  onEdit={() => handleEditClick(product)}
                  onDelete={() => handleDelete(product.product_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}