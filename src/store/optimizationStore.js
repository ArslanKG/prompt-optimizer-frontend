import { create } from 'zustand';
import { chatApi, sessionApi } from '../services/api';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  getSessionFromCache,
  saveSessionToCache,
  addMessageToSessionCache
} from '../utils/sessionCache';

const useOptimizationStore = create((set, get) => ({
  // State
  prompt: '',
  strategy: 'quality',
  optimizationType: 'clarity',
  selectedModel: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: null,
  useStrategy: true, // true = strategy mode, false = direct model mode
  preferredModels: [],
  result: null,
  loading: false,
  error: null,
  history: [],
  
  // Session Management
  currentSessionId: null,
  sessions: [],
  sessionsCache: new Map(), // Cache for session data
  cacheExpiry: null, // Timestamp when cache expires
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes cache duration
  enableMemory: true,
  contextWindowSize: 10,
  
  // Available options
  models: [],
  strategies: [],
  optimizationTypes: [],
  
  // Actions
  setPrompt: (prompt) => set({ prompt }),
  setStrategy: (strategy) => set({ strategy, useStrategy: true }),
  setOptimizationType: (type) => set({ optimizationType: type }),
  setSelectedModel: (model) => set({ selectedModel: model, useStrategy: false }),
  setTemperature: (temperature) => set({ temperature }),
  setMaxTokens: (maxTokens) => set({ maxTokens }),
  setUseStrategy: (useStrategy) => set({ useStrategy }),
  setPreferredModels: (models) => set({ preferredModels: models }),
  setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),
  setEnableMemory: (enable) => set({ enableMemory: enable }),
  setContextWindowSize: (size) => set({ contextWindowSize: size }),
  setHistory: (history) => set({ history }),
  
  // Cache Management Functions
  isCacheValid: () => {
    const { cacheExpiry } = get();
    return cacheExpiry && Date.now() < cacheExpiry;
  },
  
  clearSessionsCache: () => {
    set({
      sessionsCache: new Map(),
      cacheExpiry: null
    });
  },
  
  updateSessionCache: (sessionId, sessionData) => {
    const { sessionsCache, CACHE_DURATION } = get();
    const newCache = new Map(sessionsCache);
    newCache.set(sessionId, sessionData);
    set({
      sessionsCache: newCache,
      cacheExpiry: Date.now() + CACHE_DURATION
    });
  },
  
  // Load initial data - with fallback for missing endpoints
  loadInitialData: async () => {
    // Always set default values first - Updated strategies from backend
    const defaultStrategies = [
      { id: 'quality', name: 'Kalite', description: 'En yüksek kalite', icon: '🏆', features: ['En kaliteli yanıtlar', 'GPT-4o model'] },
      { id: 'speed', name: 'Hız', description: 'En hızlı yanıt', icon: '⚡', features: ['Hızlı işlem', 'GPT-4o Mini model'] },
      { id: 'cost_effective', name: 'Maliyet Odaklı', description: 'Maliyet odaklı', icon: '💰', features: ['Bütçe dostu', 'Gemini Lite model'] },
      { id: 'reasoning', name: 'Muhakeme', description: 'Muhakeme odaklı', icon: '🧠', features: ['Detaylı analiz', 'DeepSeek R1 model'] },
      { id: 'creative', name: 'Yaratıcı', description: 'Yaratıcı çözümler', icon: '🎨', features: ['Yaratıcı yanıtlar', 'Grok-2 model'] }
    ];
    
    const defaultOptimizationTypes = [
      { id: 'clarity', name: 'Clarity', description: 'Netlik' },
      { id: 'creativity', name: 'Creativity', description: 'Yaratıcılık' },
      { id: 'performance', name: 'Performance', description: 'Performans' },
      { id: 'accuracy', name: 'Accuracy', description: 'İstatistiksel' }
    ];

    const defaultModels = [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Most advanced model with multimodal capabilities' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient model for most tasks' },
      { id: 'gemini-lite', name: 'Gemini Lite', description: 'Cost-effective model for everyday tasks' },
      { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Advanced reasoning capabilities' },
      { id: 'grok-2', name: 'Grok-2', description: 'Creative model with humor and personality' }
    ];
    
    set({
      models: defaultModels,
      strategies: defaultStrategies,
      optimizationTypes: defaultOptimizationTypes
    });

    // Only try to fetch from API if authenticated
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return;
    }
    
    // Try to load from API with individual error handling
    try {
      // Try models endpoint using new chat API
      let models = defaultModels;
      try {
        const apiModels = await chatApi.getModels();
        if (Array.isArray(apiModels)) {
          models = apiModels;
        }
      } catch (error) {
        console.warn('Failed to load models from API, using defaults:', error);
      }
      
      // Try strategies endpoint
      let strategies = defaultStrategies;
      try {
        const apiStrategies = await chatApi.getStrategies();
        if (apiStrategies && apiStrategies.length > 0) {
          strategies = apiStrategies;
        }
      } catch (error) {
        console.warn('Failed to load strategies from API, using defaults:', error);
      }
      
      set({
        models,
        strategies,
        optimizationTypes: defaultOptimizationTypes
      });
    } catch (error) {
      console.warn('Failed to load initial data:', error);
    }
  },
  
  // Session Management
  createNewSession: () => {
    const newSessionId = uuidv4();
    set({
      currentSessionId: newSessionId,
      history: [],
      result: null,
      error: null,
    });
    return newSessionId;
  },

  loadSession: async (sessionId) => {
    try {
      // Validate sessionId
      if (!sessionId || sessionId === 'undefined' || sessionId === 'null') {
        set({ loading: false });
        return;
      }
      
      set({ loading: true });
      
      const cachedSessionData = getSessionFromCache(sessionId);

      if (cachedSessionData && cachedSessionData.messages) {
        
        // Transform cached messages to match component expectations
        const transformedMessages = cachedSessionData.messages.map((message, index) => {
          if (message.id && message.content) {
            // Already in correct format
            return message;
          }
          
          // Legacy format transformation
          const uniqueId = message.id || `${message.role || 'unknown'}-${message.timestamp || Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
          return {
            id: uniqueId,
            content: message.content,
            isUser: message.isUser !== undefined ? message.isUser : message.role === 'user',
            result: message.result || (message.role === 'assistant' ? {
              finalResponse: message.content,
              model: message.model || 'unknown',
              strategy: 'quality',
              processingTimeMs: 0
            } : undefined),
          };
        });
        
        set({
          currentSessionId: sessionId,
          history: transformedMessages,
          loading: false,
        });
        return;
      }
      
      
      try {
        const conversationHistory = await sessionApi.getConversationHistory(sessionId);
        
        // Transform API messages to match component expectations
        const transformedMessages = (conversationHistory.messages || []).map((message, index) => {
          const uniqueId = `${message.role}-${message.timestamp || Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
          return {
            id: uniqueId,
            content: message.content,
            isUser: message.role === 'user',
            result: message.role === 'assistant' ? {
              finalResponse: message.content,
              model: message.model,
              strategy: 'quality',
              processingTimeMs: 0
            } : undefined,
          };
        });
        
        // Save to localStorage cache for future fast access
        const sessionDataToCache = {
          id: sessionId,
          title: conversationHistory.title || 'Chat Session',
          messages: transformedMessages,
          timestamp: new Date(),
          messageCount: transformedMessages.length
        };
        
        saveSessionToCache(sessionId, sessionDataToCache);
        
        set({
          currentSessionId: sessionId,
          history: transformedMessages,
          loading: false,
        });
        
      } catch (apiError) {
        console.error('API fetch failed:', apiError);
        
        // If API fails, still show any partial cache data we might have
        if (cachedSessionData) {
          console.log('🔄 API failed, using partial cache data');
          set({
            currentSessionId: sessionId,
            history: cachedSessionData.messages || [],
            loading: false,
          });
        } else {
          throw apiError;
        }
      }
      
    } catch (error) {
      console.error('Failed to load session:', error);
      toast.error('Session yüklenemedi');
      set({
        loading: false,
        currentSessionId: sessionId, // Still set the session ID
        history: [] // Empty history if all fails
      });
    }
  },

  deleteSession: async (sessionId) => {
    try {
      // Validate sessionId before deletion
      if (!sessionId || sessionId === 'undefined' || sessionId === 'null') {
        return;
      }
      
      await sessionApi.deleteSession(sessionId);
      
      // If the deleted session was current, create new one
      if (get().currentSessionId === sessionId) {
        get().createNewSession();
      }
      
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
    }
  },

  // Send chat message with new API
  optimize: async (requireAuth = true) => {
    const {
      prompt,
      strategy,
      selectedModel,
      temperature,
      maxTokens,
      currentSessionId,
      enableMemory,
      useStrategy,
    } = get();
    
    if (!prompt.trim()) {
      toast.error('Lütfen bir mesaj girin');
      return;
    }

    // Check authentication only if required
    const token = localStorage.getItem('jwt_token');
    if (requireAuth && !token) {
      toast.error('Lütfen önce giriş yapın');
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      let result;
      
      // Use strategy-based chat if useStrategy is true
      if (useStrategy) {
        const strategyData = {
          message: prompt,
          strategy,
        };

        // Add session ID if continuing an existing conversation
        if (currentSessionId && enableMemory) {
          strategyData.sessionId = currentSessionId;
        }

        result = await chatApi.sendWithStrategy(strategyData);
      } else {
        // Use direct model chat API
        const chatData = {
          message: prompt,
          model: selectedModel,
          temperature,
        };

        // Add session ID if continuing an existing conversation
        if (currentSessionId && enableMemory) {
          chatData.sessionId = currentSessionId;
        }

        // Add maxTokens if specified
        if (maxTokens) {
          chatData.maxTokens = maxTokens;
        }

        result = await chatApi.sendMessage(chatData);
      }
      
      // Update session ID from response
      const finalSessionId = result.sessionId;
      if (finalSessionId && finalSessionId !== currentSessionId) {
        set({ currentSessionId: finalSessionId });
      }
      
      // Add messages to history
      const newHistory = [...get().history];
      
      // Parse timestamp from response or use current time
      const responseTimestamp = result.timestamp ? new Date(result.timestamp) : new Date();
      const userTimestamp = new Date(responseTimestamp.getTime() - 1000); // 1 second before assistant
      
      const userMessage = {
        id: `user-${userTimestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
        content: prompt,
        isUser: true,
        timestamp: userTimestamp
      };
      
      // Transform result to match expected format
      const transformedResult = {
        finalResponse: result.message,
        model: result.model,
        strategy: strategy,
        processingTimeMs: 0,
        usage: result.usage || {},
        sessionId: result.sessionId,
        isNewSession: result.isNewSession || false,
        sessionTitle: result.sessionTitle
      };
      
      const assistantMessage = {
        id: `assistant-${responseTimestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
        content: result.message,
        isUser: false,
        result: transformedResult,
        timestamp: responseTimestamp
      };
      
      newHistory.push(userMessage, assistantMessage);
      
      set({
        result: transformedResult,
        history: newHistory,
      });
      
      // Show session title for new sessions
      if (result.isNewSession && result.sessionTitle) {
        toast.success(`New session: ${result.sessionTitle}`);
      }
      
      // 🚀 INSTANT CACHE UPDATE for lightning-fast session switching
      if (finalSessionId) {
        
        // Get existing cached session or create new one
        const existingCachedSession = getSessionFromCache(finalSessionId) || {
          id: finalSessionId,
          title: result.sessionTitle || `Chat ${new Date().toLocaleDateString()}`,
          messages: [],
          timestamp: new Date(),
          messageCount: 0
        };
        
        // Update with new messages and title if provided
        const updatedSessionData = {
          ...existingCachedSession,
          title: result.sessionTitle || existingCachedSession.title,
          messages: newHistory,
          messageCount: newHistory.length,
          timestamp: new Date()
        };
        
        // Save to localStorage cache immediately
        saveSessionToCache(finalSessionId, updatedSessionData);
        
        // Also add individual messages for fine-grained caching
        addMessageToSessionCache(finalSessionId, userMessage);
        addMessageToSessionCache(finalSessionId, assistantMessage);
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage });
      
      if (errorMessage.includes('Authentication required')) {
        toast.error('Lütfen önce giriş yapın');
      } else {
        toast.error('Mesaj gönderilemedi');
      }
    } finally {
      set({ loading: false });
    }
  },
  
  // Clear result
  clearResult: () => set({ result: null, error: null }),
  
  // Clear all
  reset: () => set({
    prompt: '',
    strategy: 'quality',
    optimizationType: 'clarity',
    selectedModel: 'gpt-4o-mini',
    preferredModels: [],
    result: null,
    error: null,
  }),
}));

export default useOptimizationStore;