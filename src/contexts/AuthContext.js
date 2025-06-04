import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [sessionHistory, setSessionHistory] = useState({}); // Cache for session histories

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          // Skip API verification since endpoint doesn't exist
          // Just assume token is valid if it exists in localStorage
          setIsAuthenticated(true);
          setUser({ username: 'User' }); // Fallback user data
        }
      } catch (error) {
        // Token invalid, clear storage
        localStorage.removeItem('jwt_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const response = await authApi.login(credentials);
      
      // Store token and expiration
      localStorage.setItem('jwt_token', response.token);
      if (response.expiresAt) {
        localStorage.setItem('jwt_expires_at', response.expiresAt);
      }
      
      // Use user data from response
      const userData = response.user || {
        username: response.username || 'User',
        email: response.email || '',
        isAdmin: response.isAdmin || false
      };
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Load user sessions after successful login
      await loadUserSessions();
      
      toast.success(`Welcome back, ${userData.username}!`);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadUserSessions = async () => {
    try {
      const { sessionApi } = await import('../services/api');
      const userSessions = await sessionApi.getSessions(10);
      
      // Handle new API response format
      if (Array.isArray(userSessions)) {
        setSessions(userSessions);
      } else if (userSessions && Array.isArray(userSessions.sessions)) {
        setSessions(userSessions.sessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Failed to load user sessions:', error);
      // Don't show error toast as this is background loading
      setSessions([]);
    }
  };

  const loadSessionHistory = async (sessionId) => {
    // Check if already cached
    if (sessionHistory[sessionId]) {
      return sessionHistory[sessionId];
    }
    
    try {
      const { sessionApi } = await import('../services/api');
      const history = await sessionApi.getConversationHistory(sessionId);
      
      // Handle new API response format
      const formattedHistory = {
        sessionId: history.sessionId || sessionId,
        messages: history.messages || [],
        totalMessages: history.totalMessages || history.messages?.length || 0,
        lastActivityAt: history.lastActivityAt || new Date().toISOString()
      };
      
      setSessionHistory(prev => ({
        ...prev,
        [sessionId]: formattedHistory
      }));
      return formattedHistory;
    } catch (error) {
      console.error('Failed to load session history:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const { sessionApi } = await import('../services/api');
      await sessionApi.deleteSession(sessionId);
      
      // Remove from sessions list
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      
      // Remove from history cache
      setSessionHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[sessionId];
        return newHistory;
      });
      
      toast.success('Session deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
      throw error;
    }
  };

  const refreshSessions = async () => {
    if (isAuthenticated) {
      await loadUserSessions();
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      
      // New API returns token immediately after registration
      if (response.token && response.user) {
        // Store token
        localStorage.setItem('jwt_token', response.token);
        
        // Update state with user data
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Load user sessions after successful registration
        await loadUserSessions();
        
        toast.success(`Welcome, ${response.user.username}! Registration successful.`);
      } else {
        toast.success('Registration successful! Please log in.');
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear state and storage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_expires_at');
      setUser(null);
      setIsAuthenticated(false);
      setSessions([]);
      setSessionHistory({});
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    sessions,
    sessionHistory,
    login,
    register,
    logout,
    loadSessionHistory,
    deleteSession,
    refreshSessions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;