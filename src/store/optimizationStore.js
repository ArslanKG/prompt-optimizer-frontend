import { create } from 'zustand';
import { optimizationApi } from '../services/api';
import toast from 'react-hot-toast';

const useOptimizationStore = create((set, get) => ({
  // State
  prompt: '',
  strategy: 'quality',
  optimizationType: 'clarity',
  preferredModels: [],
  result: null,
  loading: false,
  error: null,
  history: [],
  
  // Available options
  models: {},
  strategies: [],
  optimizationTypes: [],
  
  // Actions
  setPrompt: (prompt) => set({ prompt }),
  setStrategy: (strategy) => set({ strategy }),
  setOptimizationType: (type) => set({ optimizationType: type }),
  setPreferredModels: (models) => set({ preferredModels: models }),
  
  // Load initial data
  loadInitialData: async () => {
    try {
      const [models, strategies, types] = await Promise.all([
        optimizationApi.getModels(),
        optimizationApi.getStrategies(),
        optimizationApi.getOptimizationTypes(),
      ]);
      
      set({ models, strategies, optimizationTypes: types });
    } catch (error) {
      toast.error('Başlangıç verileri yüklenemedi');
      console.error('Failed to load initial data:', error);
    }
  },
  
  // Optimize prompt
  optimize: async () => {
    const { prompt, strategy, optimizationType, preferredModels } = get();
    
    if (!prompt.trim()) {
      toast.error('Lütfen bir prompt girin');
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      const result = await optimizationApi.optimize({
        prompt,
        strategy,
        optimizationType,
        preferredModels,
      });
      
      set({ 
        result,
        history: [...get().history, { ...result, timestamp: new Date() }],
      });
      
      toast.success('Optimizasyon tamamlandı!');
    } catch (error) {
      set({ error: error.message });
      toast.error('Optimizasyon başarısız oldu');
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
    preferredModels: [],
    result: null,
    error: null,
  }),
}));

export default useOptimizationStore;