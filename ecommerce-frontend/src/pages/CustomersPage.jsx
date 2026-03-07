import { useState, useEffect } from 'react';
import { Card, Button, Alert, Loading } from '../components/ui';
import { CustomerCard } from '../components/features';
import { customerAPI } from '../services/api';

const INITIAL_FORM_STATE = { first_name: '', last_name: '', phone_no: '', address: '' };

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // UI State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerAPI.getAll();
      setCustomers(res.data.results || res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (customer) => {
    setEditingId(customer.customer_id);
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_no: customer.phone_no.toString(),
      address: customer.address,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const payload = { ...formData, phone_no: parseInt(formData.phone_no) };
      
      if (editingId) {
        await customerAPI.update(editingId, payload);
        setSuccess('Customer updated successfully!');
      } else {
        await customerAPI.create(payload);
        setSuccess('Customer added successfully!');
      }

      setFormData(INITIAL_FORM_STATE);
      setShowForm(false);
      setEditingId(null);
      await fetchCustomers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Operation failed. Check your data.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerAPI.delete(id);
      setCustomers(prev => prev.filter(c => c.customer_id !== id));
      setSuccess('Customer removed');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Could not delete customer');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Customer Directory</h1>
          <p className="text-gray-500 mt-1">Manage {customers.length} clients</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          onClick={() => {
            setShowForm(!showForm);
            if(showForm) { setEditingId(null); setFormData(INITIAL_FORM_STATE); }
          }}
        >
          {showForm ? 'Close Form' : '＋ New Customer'}
        </Button>
      </div>

      {error && <Alert type="danger" message={error} className="mb-6" onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} className="mb-6" onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Sidebar */}
        {showForm && (
          <div className="lg:col-span-4">
            <Card className="sticky top-8 border-2 border-blue-100 shadow-xl">
              <h2 className="text-xl font-bold mb-4">{editingId ? '📝 Edit Customer' : '👤 Add Customer'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    value={formData.phone_no} onChange={(e) => setFormData({...formData, phone_no: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                </div>
                <Button type="submit" variant="primary" className="w-full" loading={formLoading}>
                  {editingId ? 'Update Customer' : 'Save Customer'}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Display Grid - Adaptive Columns */}
        <div className={showForm ? "lg:col-span-8" : "lg:col-span-12"}>
          {customers.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No customers found.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              showForm 
                ? "grid-cols-1 md:grid-cols-2" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            }`}>
              {customers.map((customer) => (
                <CustomerCard
                  key={customer.customer_id}
                  customer={customer}
                  onEdit={() => handleEditClick(customer)}
                  onDelete={() => handleDelete(customer.customer_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}