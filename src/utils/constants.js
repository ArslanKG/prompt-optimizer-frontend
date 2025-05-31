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
      name: 'En İyi Kalite',
      description: 'En kaliteli cevaplar',
      icon: '🏆',
      estimatedTime: '10-15 saniye',
      color: '#1976d2',
    },
    [STRATEGIES.SPEED]: {
      name: 'Hızlı',
      description: 'Hızlı modeller ile quick response',
      icon: '⚡',
      estimatedTime: '3-5 saniye',
      color: '#2e7d32',
    },
    [STRATEGIES.CONSENSUS]: {
      name: 'Konsensüs',
      description: 'Birden fazla model görüşü',
      icon: '🤝',
      estimatedTime: '20-30 saniye',
      color: '#9c27b0',
    },
    [STRATEGIES.COST_EFFECTIVE]: {
      name: 'Maliyet Odaklı',
      description: 'Uygun maliyetli çözüm',
      icon: '💰',
      estimatedTime: '5-10 saniye',
      color: '#ed6c02',
    },
  };
  
  export const OPTIMIZATION_TYPE_CONFIGS = {
    [OPTIMIZATION_TYPES.CLARITY]: {
      name: 'Netlik',
      description: 'Belirsizlikleri giderir ve daha net hale getirir',
      icon: '🎯',
    },
    [OPTIMIZATION_TYPES.TECHNICAL]: {
      name: 'Teknik',
      description: 'Teknik ve yazılım odaklı optimize eder',
      icon: '💻',
    },
    [OPTIMIZATION_TYPES.CREATIVE]: {
      name: 'Yaratıcı',
      description: 'Yaratıcı içerik için optimize eder',
      icon: '🎨',
    },
    [OPTIMIZATION_TYPES.ANALYTICAL]: {
      name: 'Analitik',
      description: 'Analitik ve veri odaklı optimize eder',
      icon: '📊',
    },
  };
  
  export const MODEL_TYPE_COLORS = {
    fast: '#4caf50',
    balanced: '#ff9800',
    advanced: '#2196f3',
    reasoning: '#9c27b0',
  };
  
  export const EXAMPLE_PROMPTS = [
    {
      category: 'Teknik',
      prompts: [
        'React hooks nedir ve nasıl kullanılır?',
        'Docker container ve Kubernetes farkı nedir?',
        'REST API best practices nelerdir?',
        'Microservices architecture avantajları',
      ],
    },
    {
      category: 'Genel',
      prompts: [
        'Yapay zeka nedir ve nasıl çalışır?',
        'Machine Learning temel kavramları',
        'Cloud computing avantajları nelerdir?',
        'Blockchain teknolojisi nasıl çalışır?',
      ],
    },
    {
      category: 'Yaratıcı',
      prompts: [
        'Gelecekte teknolojinin eğitime etkisi',
        'Sürdürülebilir yaşam için 10 öneri',
        'Uzaktan çalışmanın artıları ve eksileri',
        'Yapay zeka etiği üzerine bir deneme',
      ],
    },
  ];