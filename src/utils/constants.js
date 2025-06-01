export const STRATEGIES = {
    QUALITY: 'quality',
    SPEED: 'speed',
    CONSENSUS: 'consensus',
    COST_EFFECTIVE: 'cost_effective',
  };
  
  export const OPTIMIZATION_TYPES = {
    CLARITY: 'clarity',
    TECHNICAL: 'technical',
    CREATIVE: 'creative',
    ANALYTICAL: 'analytical',
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
      icon: '🎯',
    },
    [OPTIMIZATION_TYPES.TECHNICAL]: {
      icon: '💻',
    },
    [OPTIMIZATION_TYPES.CREATIVE]: {
      icon: '🎨',
    },
    [OPTIMIZATION_TYPES.ANALYTICAL]: {
      icon: '📊',
    },
  };
  
  export const MODEL_TYPE_COLORS = {
    fast: '#4caf50',
    balanced: '#ff9800',
    advanced: '#2196f3',
    reasoning: '#9c27b0',
  };
