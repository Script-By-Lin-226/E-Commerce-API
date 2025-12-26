import axios from 'axios';

// Normalize API URL - replace 0.0.0.0 with localhost
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return envUrl.replace('0.0.0.0', 'localhost');
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Bypass ngrok browser warning page
  },
});

// Request interceptor to add access token from cookie if available
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // Check for new access token in response header
    const newAccessToken = response.headers['x-new-access-token'];
    if (newAccessToken) {
      // Update cookie or store in localStorage if needed
      document.cookie = `access_token=${newAccessToken}; path=/; max-age=1800; SameSite=Lax; Secure=false`;
    }
    return response;
  },
  async (error) => {
    // Don't redirect on 401 for login/register/payment pages
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && !currentPath.startsWith('/payment')) {
        window.location.href = '/login';
      }
    }
    
    // Log network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Product API
export const productAPI = {
  getAll: async () => {
    const response = await api.get('/product/');
    return response.data;
  },
  
  search: async (params) => {
    const response = await api.get('/product/search', { params });
    return response.data;
  },
  
  create: async (productData) => {
    const response = await api.post('/product/', productData);
    return response.data;
  },
  
  update: async (productId, productData) => {
    const response = await api.patch(`/product/${productId}`, null, { params: productData });
    return response.data;
  },
  
  delete: async (productId) => {
    const response = await api.delete(`/product/${productId}`);
    return response.data;
  },
};

// Order API
export const orderAPI = {
  create: async (orderData) => {
    const response = await api.post('/order/', orderData);
    return response.data;
  },
  
  getById: async (orderId) => {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/order/');
    return response.data;
  },
  
  pay: async (paymentData) => {
    const response = await api.post('/order/pay', paymentData);
    return response.data;
  },
};

export default api;

