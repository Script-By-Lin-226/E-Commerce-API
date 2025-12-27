import axios from 'axios';

// Normalize API URL - replace 0.0.0.0 with localhost
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000';
  const normalized = envUrl.replace('0.0.0.0', 'localhost');
  // Log for debugging (remove in production if needed)
  console.log('API Base URL:', normalized);
  return normalized;
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
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
      // Update cookie for cross-origin (HTTPS required)
      // Note: Cookies set by server should already be handled, this is just a fallback
      const isHttps = window.location.protocol === 'https:';
      document.cookie = `access_token=${newAccessToken}; path=/; max-age=1800; SameSite=none; Secure=${isHttps}`;
    }
    return response;
  },
  async (error) => {
    // Handle 403 Forbidden (role/permission issues)
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response?.data?.detail || 'You do not have permission');
      // Don't logout on 403, just show error
      return Promise.reject(error);
    }
    
    // Don't redirect on 401 for login/register/payment pages
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && !currentPath.startsWith('/pay')) {
        window.location.href = '/login';
      }
    }
    
    // Log network errors with more details
    if (!error.response) {
      console.error('Network error:', error.message);
      console.error('Request URL:', error.config?.url);
      console.error('Base URL:', API_BASE_URL);
      console.error('Full URL:', error.config?.baseURL + error.config?.url);
      console.error('Error code:', error.code);
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

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteImage: async (filename) => {
    const response = await api.delete(`/upload/image/${filename}`);
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

