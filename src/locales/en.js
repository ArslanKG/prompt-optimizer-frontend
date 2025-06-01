export const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    details: 'Details',
    showDetails: 'Show Details',
    hideDetails: 'Hide Details',
    language: 'Language',
  },

  // Navigation
  navigation: {
    home: 'Home',
    chat: 'Chat',
    models: 'Models',
    about: 'About',
  },

  // Home Page
  home: {
    title: 'Arkegu AI',
    subtitle: 'Prompt Optimization Platform',
    description: 'Get maximum efficiency from AI models. Achieve more effective results with intelligent prompt optimization.',
    startButton: 'Get Started',
    exploreFeatures: 'Explore Features',
    stats: {
      models: 'AI Models',
      strategies: 'Strategies',
      responseTime: 'Fastest Response',
    },
    features: {
      title: 'Features',
      subtitle: 'Discover the power of prompt optimization with Arkegu AI',
      smartOptimization: {
        title: 'Smart Optimization',
        description: 'Automatically optimize your prompts with artificial intelligence.',
        details: [
          'Context analysis and automatic improvement',
          'Grammar and semantic corrections',
          'Goal-oriented prompt structuring',
          'Multiple optimization options'
        ],
      },
      multiModel: {
        title: 'Multi-Model Support',
        description: 'Work with 7+ different AI models with Arkegu AI, get the best results.',
        details: [
          'GPT-4, GPT-4o and GPT-4o-mini',
          'DeepSeek Chat and Reasoning models',
          'Grok-2 and Grok-3 beta versions',
          'O3-mini next generation model support'
        ],
      },
      strategies: {
        title: '4 Different Strategies',
        description: 'Choose speed, quality, cost or consensus strategy according to your needs.',
        details: [
          'Quality: Highest quality and detailed responses',
          'Speed: Response in less than 3 seconds',
          'Consensus: Multiple model comparison',
          'Cost-Effective: Budget-friendly solutions'
        ],
      },
      analytics: {
        title: 'Advanced Analytics',
        description: 'Track used models, processing time and token usage.',
        details: [
          'Real-time performance metrics',
          'Model comparison and cost analysis',
          'Response quality assessment',
          'Usage statistics and reporting'
        ],
      },
    },
    cta: {
      title: 'Get Started Now',
      description: 'Start your free trial and discover the power of AI',
      button: 'Try Free',
    },
  },

  // Models Page
  models: {
    title: 'AI Models',
    subtitle: 'Explore all available AI models',
    types: {
      fast: {
        name: 'Fast',
        description: 'Fastest response times',
      },
      balanced: {
        name: 'Balanced',
        description: 'Balance of speed and quality',
      },
      advanced: {
        name: 'Advanced',
        description: 'Highest quality',
      },
      reasoning: {
        name: 'Reasoning',
        description: 'For complex problems',
      },
    },
    labels: {
      active: 'Active',
      cost: 'Cost',
      priority: 'Priority Level',
    },
  },

  // About Page
  about: {
    title: 'About',
    subtitle: 'An innovative platform that provides prompt optimization using artificial intelligence technologies and offers multi-model support.',
    mission: {
      title: 'Our Mission',
      description1: 'Arkegu AI is a platform developed to enable users to benefit from AI models most efficiently.',
      description2: 'Our goal is to make complex AI technologies accessible and easy to use for everyone.',
    },
    features: [
      'Get the best results with multi-model AI support',
      'More effective queries with prompt optimization',
      'Solutions suitable for your needs with 4 different strategies',
      'Real-time response and transaction tracking',
      'Modern and user-friendly interface',
      'Secure and fast API integration',
    ],
    technologies: {
      title: 'Our Technologies',
      stack: {
        backend: {
          title: 'Backend',
          tech: '.NET 8, C#, RESTful API',
        },
        ai: {
          title: 'AI Models',
          tech: 'GPT-4, Gemini, DeepSeek, Grok',
        },
        frontend: {
          title: 'Frontend',
          tech: 'React, Material-UI, Framer Motion',
        },
        security: {
          title: 'Security',
          tech: 'HTTPS, Bearer Auth, CORS',
        },
      },
    },
    contact: {
      title: 'Contact',
      description: 'Contact us for your questions or suggestions',
      email: 'info@arkegu.ai',
    },
  },

  // Chat Page
  chat: {
    optimizationType: 'Optimization Type',
    strategy: 'Strategy',
    inputPlaceholder: {
      initial: 'Write the prompt you want to optimize...',
      continue: 'Write your message or enter a new prompt...',
    },
    buttons: {
      optimize: 'Optimize',
      send: 'Send',
      newChat: 'New Chat',
    },
    emptyState: {
      title: 'Welcome to Arkegu AI',
      description: 'To optimize your prompts, type in the field below and click the send button.',
    },
    messages: {
      user: 'You',
      assistant: 'Arkegu AI',
      thinking: 'Thinking...',
      error: 'An error occurred. Please try again.',
    },
  },

  // Optimization Types
  optimizationTypes: {
    clarity: {
      name: 'Clarity',
      description: 'Clearer and more understandable',
    },
    creativity: {
      name: 'Creativity',
      description: 'More creative and original',
    },
    conciseness: {
      name: 'Conciseness',
      description: 'Shorter and more concise',
    },
    detail: {
      name: 'Detail',
      description: 'More detailed and comprehensive',
    },
  },

  // Strategies
  strategies: {
    quality: {
      name: 'Quality',
      description: 'Highest quality',
    },
    speed: {
      name: 'Speed',
      description: 'Fastest response',
    },
    consensus: {
      name: 'Consensus',
      description: 'Multi-model consensus',
    },
    costEffective: {
      name: 'Cost-Effective',
      description: 'Cost-focused',
    },
  },

  // Footer
  footer: {
    copyright: '© 2024 Arkegu AI. All rights reserved.',
    builtWith: 'Built with',
    and: 'and',
  },

  // Error Messages
  errors: {
    general: 'An error occurred',
    network: 'Network connection error',
    server: 'Server error',
    validation: 'Validation error',
    notFound: 'Not found',
    unauthorized: 'Unauthorized access',
    forbidden: 'Access denied',
    timeout: 'Request timed out',
  },

  // Success Messages
  success: {
    saved: 'Successfully saved',
    updated: 'Successfully updated',
    deleted: 'Successfully deleted',
    sent: 'Successfully sent',
  },
};
