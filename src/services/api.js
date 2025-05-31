import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7179/api';

// Axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for consensus strategy
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists (for future use)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      toast.error('Sunucu hatası oluştu. Lütfen tekrar deneyin.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('İstek zaman aşımına uğradı.');
    } else if (!error.response) {
      toast.error('Sunucuya bağlanılamıyor.');
    }
    return Promise.reject(error);
  }
);

// API Methods
export const optimizationApi = {
  // Optimize prompt
  optimize: async (data) => {
    const response = await api.post('/optimization/optimize', data);
    return response.data;
  },

  // Get available models
  getModels: async () => {
    const response = await api.get('/optimization/models');
    return response.data;
  },

  // Get strategies
  getStrategies: async () => {
    const response = await api.get('/optimization/strategies');
    return response.data;
  },

  // Get optimization types
  getOptimizationTypes: async () => {
    const response = await api.get('/optimization/optimization-types');
    return response.data;
  },

  // Test specific model
  testModel: async (data) => {
    const response = await api.post('/optimization/test-model', data);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/optimization/health');
    return response.data;
  },
};

export default api;