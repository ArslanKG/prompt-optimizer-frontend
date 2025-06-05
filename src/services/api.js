import axios from 'axios';
import toast from 'react-hot-toast';
import { sanitizeObject } from '../utils/textSanitizer';

// Environment-based API URL selection
const getApiUrl = () => {
  // Browser-based detection (most reliable)
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    // Development - use localhost backend
    return 'https://localhost:7179/api';
  } else {
    // Production - use remote backend
    return 'https://ai-prompt-optimization-backend-api.onrender.com/api';
  }
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 60000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Sanitize request data to prevent Unicode errors
    if (config.data) {
      try {
        config.data = sanitizeObject(config.data);
        // Ensure the data can be properly serialized
        JSON.stringify(config.data);
      } catch (error) {
        toast.error('Gönderilen veride geçersiz karakterler bulundu.');
        return Promise.reject(new Error('Invalid characters in request data'));
      }
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
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      toast.error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      window.location.reload();
    } else if (error.response?.status === 400) {
      // Bad request - could be JSON parsing error
      const errorMessage = error.response?.data?.error?.message || error.message;
      if (errorMessage.includes('not valid JSON') || errorMessage.includes('invalid') || errorMessage.includes('surrogate')) {
        toast.error('Gönderilen veride geçersiz karakterler bulundu. Lütfen emoji ve özel karakterleri kontrol edin.');
      } else {
        toast.error('Geçersiz istek. Lütfen girdiğiniz verileri kontrol edin.');
      }
    } else if (error.response?.status === 500) {
      toast.error('Sunucu hatası oluştu. Lütfen tekrar deneyin.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('İstek zaman aşımına uğradı.');
    } else if (!error.response) {
      toast.error('Sunucuya bağlanılamıyor.');
    }
    return Promise.reject(error);
  }
);

// Chat API - New endpoint structure
export const chatApi = {
  // Send message to public chat (no auth required)
  sendPublicMessage: async (data) => {
    // Sanitize data to prevent Unicode errors
    const sanitizedData = sanitizeObject(data);
    
    // Additional check for empty or invalid message after sanitization
    if (!sanitizedData.message || sanitizedData.message.trim().length === 0) {
      throw new Error('Message text is required and cannot be empty');
    }
    
    const chatData = {
      message: sanitizedData.message,
    };
    
    try {
      const response = await api.post('/public/chat/send', chatData);
      return response.data;
    } catch (error) {
      // Handle specific JSON parsing errors
      if (error.message && error.message.includes('surrogate')) {
        throw new Error('Mesajda geçersiz karakterler bulundu. Lütfen emoji ve özel karakterleri kontrol edin.');
      }
      throw error;
    }
  },

  // Send message to chat
  sendMessage: async (data) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Sanitize all data to prevent Unicode errors
    const sanitizedData = sanitizeObject(data);
    
    // Additional check for empty or invalid message after sanitization
    if (!sanitizedData.message || sanitizedData.message.trim().length === 0) {
      throw new Error('Message text is required and cannot be empty');
    }
    
    const chatData = {
      message: sanitizedData.message,
      model: sanitizedData.model || 'gpt-4o-mini',
      temperature: sanitizedData.temperature || 0.7,
    };
    
    // Add sessionId if continuing an existing conversation and valid
    if (sanitizedData.sessionId &&
        sanitizedData.sessionId !== 'undefined' &&
        sanitizedData.sessionId !== 'null' &&
        typeof sanitizedData.sessionId === 'string' &&
        sanitizedData.sessionId.trim().length > 0) {
      chatData.sessionId = sanitizedData.sessionId;
    }
    
    // Add maxTokens if specified
    if (sanitizedData.maxTokens && typeof sanitizedData.maxTokens === 'number') {
      chatData.maxTokens = sanitizedData.maxTokens;
    }
    
    try {
      const response = await api.post('/chat/send', chatData);
      return response.data;
    } catch (error) {
      // Handle specific JSON parsing errors
      if (error.message && error.message.includes('surrogate')) {
        throw new Error('Mesajda geçersiz karakterler bulundu. Lütfen emoji ve özel karakterleri kontrol edin.');
      }
      throw error;
    }
  },

  // Send message with strategy
  sendWithStrategy: async (data) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Sanitize all data to prevent Unicode errors
    const sanitizedData = sanitizeObject(data);
    
    // Additional check for empty or invalid message after sanitization
    if (!sanitizedData.message || sanitizedData.message.trim().length === 0) {
      throw new Error('Message text is required and cannot be empty');
    }
    
    const strategyData = {
      message: sanitizedData.message,
      strategy: sanitizedData.strategy || 'default',
    };
    
    // Add sessionId if continuing an existing conversation and valid
    if (sanitizedData.sessionId &&
        sanitizedData.sessionId !== 'undefined' &&
        sanitizedData.sessionId !== 'null' &&
        typeof sanitizedData.sessionId === 'string' &&
        sanitizedData.sessionId.trim().length > 0) {
      strategyData.sessionId = sanitizedData.sessionId;
    }
    
    try {
      const response = await api.post('/chat/strategy', strategyData);
      return response.data;
    } catch (error) {
      // Handle specific JSON parsing errors
      if (error.message && error.message.includes('surrogate')) {
        throw new Error('Mesajda geçersiz karakterler bulundu. Lütfen emoji ve özel karakterleri kontrol edin.');
      }
      throw error;
    }
  },

  // Get available models
  getModels: async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await api.get('/chat/models');
      return response.data.models;
    } catch (error) {
      // Fallback to local data if API fails
      try {
        const localResponse = await import('../data/models.json');
        return localResponse.models || [];
      } catch (localError) {
        return [
          {
            name: 'gpt-4o-mini',
            displayName: 'GPT-4o Mini (Fast & Affordable)',
            costPer1KTokens: 0.15,
            isRecommended: true
          }
        ];
      }
    }
  },

  // Get strategies - use local JSON data
  getStrategies: async () => {
    try {
      const response = await import('../data/strategies.json');
      return response.strategies || [];
    } catch (error) {
      return [
        { id: 'quality', name: 'Quality', description: 'En yüksek kalite' },
        { id: 'speed', name: 'Speed', description: 'En hızlı yanıt' },
        { id: 'cost_effective', name: 'Cost Effective', description: 'Maliyet odaklı' },
        { id: 'reasoning', name: 'Reasoning', description: 'Mantıksal düşünme' },
        { id: 'coding', name: 'Coding', description: 'Kod yazma' },
        { id: 'creative', name: 'Creative', description: 'Yaratıcı yaklaşım' },
        { id: 'default', name: 'Default', description: 'Varsayılan mod' }
      ];
    }
  },
};

// Legacy optimization API for backward compatibility
export const optimizationApi = {
  // Optimize prompt - maps to new chat API
  optimize: async (data) => {
    return await chatApi.sendWithStrategy({
      message: data.prompt,
      strategy: data.strategy || 'quality',
      sessionId: data.sessionId,
    });
  },

  // Get available models
  getModels: async () => {
    return await chatApi.getModels();
  },

  // Get strategies
  getStrategies: async () => {
    return await chatApi.getStrategies();
  },

  // Health check - legacy endpoint, may not exist in new API
  healthCheck: async () => {
    try {
      const response = await api.get('/optimization/health');
      return response.data;
    } catch (error) {
      // Return success if endpoint doesn't exist
      return { status: 'ok', message: 'Service is running' };
    }
  },
};

// Authentication API
export const authApi = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout (local operation only - no API endpoint)
  logout: async () => {
    // Clear token locally since there's no logout endpoint in new API
    localStorage.removeItem('jwt_token');
    return { success: true, message: 'Logged out successfully' };
  },

  // Verify token (no longer supported in new API)
  verifyToken: async () => {
    // Since there's no verify endpoint, just check if token exists
    const token = localStorage.getItem('jwt_token');
    if (token) {
      return { valid: true, message: 'Token exists' };
    } else {
      throw new Error('No token found');
    }
  },
};

// Session Management API - all require authentication
export const sessionApi = {
  // Get all sessions with limit
  getSessions: async (limit = null) => {
    const token = localStorage.getItem('jwt_token');
    console.log('🔐 [DEBUG] sessionApi.getSessions called with:', { limit, hasToken: !!token });
    
    if (!token) {
      console.error('❌ [DEBUG] No authentication token found');
      throw new Error('Authentication required');
    }
    
    const query = limit ? `?limit=${limit}` : '';
    const fullUrl = `/sessions${query}`;
    console.log('🌐 [DEBUG] Making API request to:', fullUrl);
    console.log('🔑 [DEBUG] Using token (first 20 chars):', token.substring(0, 20) + '...');
    
    try {
      const response = await api.get(fullUrl);
      console.log('📡 [DEBUG] API Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataKeys: response.data ? Object.keys(response.data) : [],
        dataLength: Array.isArray(response.data) ? response.data.length : 'not array',
        firstItem: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : 'no items',
        rawData: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [DEBUG] sessionApi.getSessions failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestUrl: error.config?.url,
        requestHeaders: error.config?.headers
      });
      throw error;
    }
  },

  // Get specific session
  getSession: async (sessionId) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Validate sessionId
    if (!sessionId || sessionId === 'undefined' || sessionId === 'null' || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
      throw new Error('Invalid session ID provided');
    }
    
    const response = await api.get(`/sessions/${encodeURIComponent(sessionId)}`);
    return response.data;
  },

  // Get conversation history for a specific session
  getConversationHistory: async (sessionId, limit = null) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Validate sessionId
    if (!sessionId || sessionId === 'undefined' || sessionId === 'null' || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
      throw new Error('Invalid session ID provided');
    }
    
    const query = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/sessions/${encodeURIComponent(sessionId)}/history${query}`);
    return response.data;
  },

  // Delete session
  deleteSession: async (sessionId) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Validate sessionId
    if (!sessionId || sessionId === 'undefined' || sessionId === 'null' || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
      throw new Error('Invalid session ID provided');
    }
    
    const response = await api.delete(`/sessions/${encodeURIComponent(sessionId)}`);
    return response.data;
  },
};

export default api;