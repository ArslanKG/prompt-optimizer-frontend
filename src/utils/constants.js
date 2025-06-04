export const STRATEGIES = {
    QUALITY: 'quality',
    SPEED: 'speed',
    CONSENSUS: 'consensus',
    COST_EFFECTIVE: 'cost_effective',
  };
  
  export const OPTIMIZATION_TYPES = {
    CLARITY: 'clarity',
    CREATIVITY: 'creativity',
    PERFORMANCE: 'performance',
    ACCURACY: 'accuracy',
  };
  
  export const STRATEGY_CONFIGS = {
    [STRATEGIES.QUALITY]: {
      icon: '🏆',
      estimatedTime: '10-15s',
      color: '#1976d2',
    },
    [STRATEGIES.SPEED]: {
      icon: '⚡',
      estimatedTime: '3-5s',
      color: '#2e7d32',
    },
    [STRATEGIES.CONSENSUS]: {
      icon: '🤝',
      estimatedTime: '20-30s',
      color: '#9c27b0',
    },
    [STRATEGIES.COST_EFFECTIVE]: {
      icon: '💰',
      estimatedTime: '5-10s',
      color: '#ed6c02',
    },
  };
  
  export const OPTIMIZATION_TYPE_CONFIGS = {
    [OPTIMIZATION_TYPES.CLARITY]: {
      icon: '💎',
      name: 'Netlik',
      description: 'Açık ve anlaşılır yanıtlar',
    },
    [OPTIMIZATION_TYPES.CREATIVITY]: {
      icon: '🎨',
      name: 'Yaratıcılık',
      description: 'Yaratıcı ve özgün çözümler',
    },
    [OPTIMIZATION_TYPES.PERFORMANCE]: {
      icon: '⚡',
      name: 'Performans',
      description: 'Hızlı işlem süresi',
    },
    [OPTIMIZATION_TYPES.ACCURACY]: {
      icon: '🎯',
      name: 'Doğruluk',
      description: 'Yüksek doğruluk oranı',
    },
  };
  
  export const MODEL_TYPE_COLORS = {
    fast: '#4caf50',
    balanced: '#ff9800',
    advanced: '#2196f3',
    reasoning: '#9c27b0',
  };
