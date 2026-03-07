import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response:`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Server Error:', error.response.status, error.response.data);
      return Promise.reject(error);
    } else if (error.request) {
      console.error('❌ No Response from server');
      return Promise.reject({ 
        response: { 
          data: { detail: 'Server not responding. Is backend running on ' + API_URL + '?' } 
        } 
      });
    } else {
      console.error('❌ Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// ============ CUSTOMER API ============
export const customerAPI = {
  getAll: () => api.get('/customers/'),
  getOne: (id) => api.get(`/customers/${id}/`),
  create: (data) => api.post('/customers/', data),
  update: (id, data) => api.put(`/customers/${id}/`, data),
  delete: (id) => api.delete(`/customers/${id}/`),
};

// ============ PRODUCT API ============
export const productAPI = {
  getAll: () => api.get('/products/'),
  getOne: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
};

// ============ ORDER API ============
export const orderAPI = {
  getAll: () => api.get('/orders/'),
  getOne: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  update: (id, data) => api.put(`/orders/${id}/`, data),
  delete: (id) => api.delete(`/orders/${id}/`),
};

// ============ ORDER ITEM API ============
export const orderItemAPI = {
  getAll: () => api.get('/order-items/'),
  getOne: (id) => api.get(`/order-items/${id}/`),
  create: (data) => api.post('/order-items/', data),
  update: (id, data) => api.put(`/order-items/${id}/`, data),
  delete: (id) => api.delete(`/order-items/${id}/`),
};

export default api;