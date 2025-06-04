#!/usr/bin/env node
/**
 * Frontend Reference MCP Server for Prompt Optimizer
 *
 * Provides reference data, best practices, and guidance for frontend and AI assistant.
 * Optimization processing is handled by the backend API.
 *
 * Updates v2.0.1:
 * - Public chat endpoint support (/api/public/chat/send)
 * - Models page local data integration
 * - Enhanced frontend guidance
 *
 * @author Prompt Optimizer Team
 * @version 2.0.1
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const CONFIG = {
  serverName: "prompt-optimizer-frontend-reference",
  serverVersion: "2.0.1",
};

/**
 * Frontend reference data for prompt optimization
 */
const FRONTEND_DATA = {
  strategies: [
    {
      id: "quality",
      name: "Quality",
      description: "En yüksek kalite",
      color: "#f59e0b",
      icon: "🏆",
      estimatedTime: "10-15s",
      features: [
        "En kaliteli ve detaylı yanıtlar",
        "Çoklu model karşılaştırması",
        "Gelişmiş doğrulama",
        "Kapsamlı analiz"
      ]
    },
    {
      id: "speed",
      name: "Speed", 
      description: "En hızlı yanıt",
      color: "#10b981",
      icon: "⚡",
      estimatedTime: "2-5s",
      features: [
        "3 saniyeden kısa sürede yanıt",
        "Hızlı işlem",
        "Anlık sonuç",
        "Düşük gecikme"
      ]
    },
    {
      id: "consensus",
      name: "Consensus",
      description: "Çoklu model uzlaşısı",
      color: "#8b5cf6",
      icon: "🤝",
      estimatedTime: "15-30s",
      features: [
        "Birden fazla modelden yanıt",
        "Konsensüs tabanlı sonuç",
        "Yüksek güvenilirlik",
        "Karşılaştırmalı analiz"
      ]
    },
    {
      id: "costEffective",
      name: "Cost-Effective",
      description: "Maliyet odaklı",
      color: "#06b6d4", 
      icon: "💰",
      estimatedTime: "5-10s",
      features: [
        "Bütçe dostu çözümler",
        "Düşük maliyet",
        "Verimli kaynak kullanımı",
        "Ekonomik seçenek"
      ]
    }
  ],

  models: [
    {
      id: "gpt-4o",
      name: "GPT-4o", 
      description: "Most advanced model with multimodal capabilities",
      type: "advanced",
      cost: "high",
      pricing: {
        input: "$15.00 / 1M tokens",
        output: "$60.00 / 1M tokens",
        inputPerToken: 0.000015,
        outputPerToken: 0.00006,
        currency: "USD"
      },
      priority: 1,
      active: true,
      capabilities: ["text", "image", "code"],
      maxTokens: 128000,
      provider: "OpenAI"
    },
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      description: "Fast and efficient model for most tasks", 
      type: "balanced",
      cost: "low",
      pricing: {
        input: "$0.15 / 1M tokens",
        output: "$0.60 / 1M tokens", 
        inputPerToken: 0.00000015,
        outputPerToken: 0.0000006,
        currency: "USD"
      },
      priority: 2,
      active: true,
      capabilities: ["text", "code"],
      maxTokens: 128000,
      provider: "OpenAI"
    },
    {
      id: "deepseek-chat",
      name: "DeepSeek Chat",
      description: "Efficient model for general conversations",
      type: "balanced", 
      cost: "low",
      pricing: {
        input: "$0.14 / 1M tokens",
        output: "$0.28 / 1M tokens",
        inputPerToken: 0.00000014,
        outputPerToken: 0.00000028,
        currency: "USD"
      },
      priority: 4,
      active: true,
      capabilities: ["text"],
      maxTokens: 32000,
      provider: "DeepSeek"
    },
    {
      id: "claude-3-sonnet",
      name: "Claude 3 Sonnet",
      description: "Balanced model for complex reasoning",
      type: "reasoning",
      cost: "medium",
      pricing: {
        input: "$3.00 / 1M tokens",
        output: "$15.00 / 1M tokens",
        inputPerToken: 0.000003,
        outputPerToken: 0.000015,
        currency: "USD"
      },
      priority: 3,
      active: true,
      capabilities: ["text", "code", "analysis"],
      maxTokens: 200000,
      provider: "Anthropic"
    }
  ],

  optimizationTypes: [
    {
      id: "clarity",
      name: "Clarity",
      description: "Improve prompt clarity and understanding",
      icon: "💡",
      benefits: ["Better comprehension", "Reduced ambiguity", "Clear instructions"]
    },
    {
      id: "performance", 
      name: "Performance",
      description: "Optimize for better AI performance",
      icon: "⚡",
      benefits: ["Faster processing", "Higher accuracy", "Efficient token usage"]
    },
    {
      id: "creativity",
      name: "Creativity",
      description: "Enhance creative and innovative outputs",
      icon: "🎨", 
      benefits: ["More creative responses", "Diverse perspectives", "Original ideas"]
    },
    {
      id: "accuracy",
      name: "Accuracy",
      description: "Focus on factual accuracy and precision",
      icon: "🎯",
      benefits: ["Higher precision", "Fact-based responses", "Reduced errors"]
    }
  ],

  bestPractices: {
    title: "Prompt Writing Best Practices",
    description: "Guidelines for writing effective prompts",
    sections: [
      {
        title: "Clarity and Specificity",
        icon: "🎯",
        guidelines: [
          "Be specific about what you want",
          "Use clear, unambiguous language", 
          "Provide context when necessary",
          "Define technical terms if needed",
          "Avoid vague or generic instructions"
        ]
      },
      {
        title: "Structure and Format",
        icon: "📋",
        guidelines: [
          "Use consistent formatting",
          "Break complex requests into steps",
          "Use examples when helpful",
          "Specify desired output format",
          "Organize information hierarchically"
        ]
      },
      {
        title: "Context and Constraints",
        icon: "🔒",
        guidelines: [
          "Provide relevant background information",
          "Set clear boundaries and limitations", 
          "Specify target audience",
          "Include quality criteria",
          "Define success metrics"
        ]
      },
      {
        title: "Optimization Techniques",
        icon: "⚙️",
        guidelines: [
          "Use action verbs for clear instructions",
          "Include role-based prompting when relevant",
          "Leverage few-shot examples for complex tasks",
          "Balance detail with brevity",
          "Test and iterate prompt variations"
        ]
      }
    ]
  },

  templates: [
    {
      id: "analysis",
      name: "Analysis Template", 
      description: "Template for analytical prompts",
      category: "analysis",
      icon: "📊",
      template: "Analyze the following [TOPIC] with focus on [ASPECTS]. Consider [CRITERIA] and provide insights on [SPECIFIC_AREAS]. Format your response with clear headings and bullet points.",
      variables: ["TOPIC", "ASPECTS", "CRITERIA", "SPECIFIC_AREAS"],
      useCase: "Data analysis, research, evaluation"
    },
    {
      id: "creative-writing",
      name: "Creative Writing Template",
      description: "Template for creative content generation",
      category: "creative", 
      icon: "✍️",
      template: "Create a [TYPE] about [SUBJECT] in [STYLE] style. The tone should be [TONE] and target audience is [AUDIENCE]. Include [ELEMENTS] and keep it [LENGTH].",
      variables: ["TYPE", "SUBJECT", "STYLE", "TONE", "AUDIENCE", "ELEMENTS", "LENGTH"],
      useCase: "Stories, articles, marketing content"
    },
    {
      id: "code-generation",
      name: "Code Generation Template",
      description: "Template for programming tasks",
      category: "programming",
      icon: "💻", 
      template: "Write [LANGUAGE] code that [FUNCTIONALITY]. Use [FRAMEWORK/LIBRARY] if applicable. Follow [CODING_STANDARDS] and include [REQUIREMENTS]. Add comments explaining [COMPLEX_PARTS].",
      variables: ["LANGUAGE", "FUNCTIONALITY", "FRAMEWORK/LIBRARY", "CODING_STANDARDS", "REQUIREMENTS", "COMPLEX_PARTS"],
      useCase: "Software development, scripting, automation"
    },
    {
      id: "educational",
      name: "Educational Template",
      description: "Template for educational content",
      category: "education",
      icon: "🎓",
      template: "Explain [CONCEPT] to a [AUDIENCE_LEVEL] audience. Include [KEY_POINTS] and provide [EXAMPLES]. Structure the explanation with clear sections and conclude with [SUMMARY_TYPE].",
      variables: ["CONCEPT", "AUDIENCE_LEVEL", "KEY_POINTS", "EXAMPLES", "SUMMARY_TYPE"],
      useCase: "Tutorials, explanations, training materials"
    }
  ],

  frontendGuidance: {
    title: "Frontend Integration Guide",
    sections: [
      {
        title: "UI/UX Best Practices",
        guidelines: [
          "Provide real-time feedback during optimization",
          "Show progress indicators for long-running operations",
          "Use clear visual hierarchy for strategy selection",
          "Implement responsive design for mobile users",
          "Provide tooltips and help text for complex features",
          "Support both authenticated and public chat modes",
          "Display model information clearly with pricing and capabilities"
        ]
      },
      {
        title: "State Management",
        guidelines: [
          "Cache frequently accessed data (strategies, models)",
          "Implement optimistic updates for better UX",
          "Handle loading and error states gracefully",
          "Persist user preferences locally",
          "Manage session state for conversations",
          "Use local JSON data as fallback for API failures",
          "Implement proper auth state management for public vs private features"
        ]
      },
      {
        title: "Performance Optimization",
        guidelines: [
          "Lazy load components for better initial load time",
          "Debounce user input to reduce API calls",
          "Implement virtual scrolling for large lists",
          "Use React.memo for expensive components",
          "Optimize re-renders with proper dependencies",
          "Load models data from local JSON instead of API calls",
          "Use efficient fallback mechanisms for offline scenarios"
        ]
      },
      {
        title: "API Integration",
        guidelines: [
          "Support multiple endpoint types (public/private)",
          "Implement proper error handling for network failures",
          "Use local data when API is unavailable",
          "Handle authentication gracefully with fallbacks",
          "Sanitize user input to prevent Unicode errors",
          "Implement rate limiting awareness for public endpoints"
        ]
      }
    ]
  },

  /**
   * FRONTEND PROJECT STRUCTURE REFERENCE
   * Detailed mapping of all files and their purposes in the src/ directory
   * Updated: 2025-01-06
   */
  projectStructure: {
    title: "Frontend Project Structure Reference",
    description: "Complete mapping of all files and directories in the React frontend project",
    rootFiles: {
      "App.css": {
        purpose: "Temel uygulama stilleri ve animasyonlar",
        content: "CSS sınıfları, keyframe animasyonları, responsive tasarım",
        lastUpdated: "2025-01-06"
      },
      "App.js": {
        purpose: "Ana uygulama bileşeni - routing, tema, providers",
        content: "React Router kurulumu, Material-UI tema, Auth/Translation providers, route yapılandırması",
        lastUpdated: "2025-01-06"
      },
      "index.css": {
        purpose: "Global stiller, font tanımları, scrollbar özelleştirmeleri",
        content: "Inter font import, global reset, scrollbar stilleri, gradient tanımları, animasyonlar",
        lastUpdated: "2025-01-06"
      },
      "index.js": {
        purpose: "React uygulamasının giriş noktası",
        content: "ReactDOM render, error handling, ResizeObserver error suppression",
        lastUpdated: "2025-01-06"
      },
      "logo.svg": {
        purpose: "React varsayılan logosu (kullanılmıyor)",
        content: "SVG format React logosu",
        lastUpdated: "2025-01-06"
      },
      "reportWebVitals.js": {
        purpose: "Performans metrikleri (devre dışı)",
        content: "Web vitals performans ölçüm fonksiyonları - şu an kullanılmıyor",
        lastUpdated: "2025-01-06"
      }
    },
    directories: {
      "assets/": {
        purpose: "Statik dosyalar - resimler, logolar, ikonlar",
        files: {
          "arkegu-logo.png": "Arkegu şirket logosu",
          "en.png": "İngilizce bayrak ikonu",
          "tr.png": "Türkçe bayrak ikonu"
        }
      },
      "components/": {
        purpose: "Yeniden kullanılabilir React bileşenleri",
        subdirectories: {
          "Auth/": {
            "AuthModal.jsx": "Kimlik doğrulama modal bileşeni - giriş/kayıt formu",
            "ProtectedRoute.jsx": "Route koruma bileşeni - kimlik doğrulama kontrolü"
          },
          "Chat/": {
            "SessionSidebar.jsx": "Chat oturumları sidebar bileşeni - oturum listesi ve navigasyon"
          },
          "Common/": {
            "ErrorMessage.jsx": "Hata mesajı gösterimi bileşeni",
            "LoadingSpinner.jsx": "Yükleme animasyonu bileşeni",
            "Logo.jsx": "Uygulama logosu bileşeni",
            "StorageMonitor.jsx": "LocalStorage izleme bileşeni"
          },
          "Layout/": {
            "Footer.jsx": "Sayfa alt bilgi bileşeni",
            "Header.jsx": "Sayfa üst bilgi bileşeni - navigasyon, tema değiştirici",
            "Layout.jsx": "Ana layout wrapper bileşeni"
          },
          "PromptOptimizer/": {
            "ChatMessage.jsx": "Chat mesajı görüntüleme bileşeni - markdown render, kopyala",
            "OptimizationTypeSelector.jsx": "Optimizasyon türü seçici bileşeni",
            "PromptInput.jsx": "Prompt girişi bileşeni - textarea, karakter sayısı",
            "PromptOptimizer.jsx": "Ana prompt optimizasyon bileşeni",
            "StrategySelector.jsx": "Strateji seçici bileşeni - kalite/hız/konsensüs"
          }
        }
      },
      "contexts/": {
        purpose: "React Context API dosyaları - global state yönetimi",
        files: {
          "AuthContext.js": "Kimlik doğrulama context - login/logout state",
          "TranslationContext.js": "Çoklu dil desteği context - dil değiştirme"
        }
      },
      "data/": {
        purpose: "JSON veri dosyaları - statik konfigürasyon",
        files: {
          "models.json": "AI model tanımları - GPT-4, Claude, DeepSeek",
          "optimizationTypes.json": "Optimizasyon türleri - clarity, performance, creativity",
          "strategies.json": "Optimizasyon stratejileri - quality, speed, consensus"
        }
      },
      "hooks/": {
        purpose: "Özel React hook'ları - yeniden kullanılabilir logic",
        files: {
          "useApi.js": "API çağrıları için custom hook",
          "useLocalStorage.js": "LocalStorage yönetimi hook",
          "useTranslation.js": "Çeviri sistemi hook"
        }
      },
      "locales/": {
        purpose: "Çoklu dil desteği dosyaları",
        files: {
          "en.js": "İngilizce çeviri metinleri",
          "tr.js": "Türkçe çeviri metinleri",
          "index.js": "Dil dosyalarının ana export'u"
        }
      },
      "pages/": {
        purpose: "Sayfa bileşenleri - route'lara karşılık gelen ana sayfalar",
        files: {
          "About.jsx": "Hakkımızda sayfası",
          "Chat.jsx": "Genel chat sayfası (public)",
          "Home.jsx": "Ana sayfa - landing page",
          "Models.jsx": "AI modelleri tanıtım sayfası",
          "PremiumChat.jsx": "Premium chat sayfası - session yönetimi, gelişmiş özellikler"
        }
      },
      "services/": {
        purpose: "API servis dosyaları - backend iletişimi",
        files: {
          "api.js": "Ana API servis dosyası - axios konfigürasyonu, interceptors, public chat endpoint"
        }
      },
      "store/": {
        purpose: "Zustand state yönetimi - global state",
        files: {
          "optimizationStore.js": "Ana store - API calls, session yönetimi, cache"
        }
      },
      "styles/": {
        purpose: "Ek stil dosyaları (şu an boş)",
        files: {}
      },
      "utils/": {
        purpose: "Yardımcı fonksiyonlar ve utilities",
        files: {
          "constants.js": "Uygulama sabitleri ve konfigürasyon",
          "errorLogger.js": "Hata loglama utilities",
          "markdownRenderer.js": "Temel markdown renderer (legacy)",
          "enhancedMarkdownRenderer.js": "Gelişmiş markdown renderer - kod blokları, JSON, inline code, header kopyalama",
          "sessionCache.js": "Session cache yönetimi - localStorage optimizasyonu",
          "textSanitizer.js": "Metin temizleme ve sanitization"
        }
      }
    },
    keyArchitecturalDecisions: [
      "React 18+ with functional components and hooks only",
      "Material-UI v5+ for consistent design system",
      "Zustand for lightweight state management",
      "React Router v6 for client-side routing",
      "Axios for HTTP client with interceptors",
      "React Context for auth and translation state",
      "LocalStorage for session caching and user preferences"
    ],
    codeOrganizationPrinciples: [
      "Feature-based component organization",
      "Separation of concerns (UI, logic, data)",
      "Reusable hooks for shared logic",
      "Centralized API calls in store",
      "Type safety through PropTypes or TypeScript",
      "Performance optimization with React.memo and useMemo"
    ]
  }
};

/**
 * Initialize MCP Server
 */
const server = new McpServer({
  name: CONFIG.serverName,
  version: CONFIG.serverVersion
});

/**
 * Tool: get_frontend_guidance
 * Get guidance and best practices for frontend development
 */
server.tool(
  "get_frontend_guidance",
  {
    section: z.enum(["ui-ux", "state-management", "performance", "all"]).optional().describe("Specific guidance section")
  },
  async ({ section = "all" }) => {
    try {
      let guidance = FRONTEND_DATA.frontendGuidance;
      
      if (section !== "all") {
        const sectionMap = {
          "ui-ux": "UI/UX Best Practices",
          "state-management": "State Management", 
          "performance": "Performance Optimization"
        };
        
        const targetSection = guidance.sections.find(s => s.title === sectionMap[section]);
        if (targetSection) {
          guidance = {
            title: targetSection.title,
            sections: [targetSection]
          };
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              guidance,
              metadata: {
                section,
                generatedAt: new Date().toISOString(),
                version: CONFIG.serverVersion
              }
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text", 
            text: JSON.stringify({
              success: false,
              error: `Failed to get frontend guidance: ${error.message}`
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * Tool: compare_models
 * Compare different AI models for reference
 */
server.tool(
  "compare_models",
  {
    models: z.array(z.string()).optional().describe("Models to compare (if not specified, compares all available models)"),
    criteria: z.array(z.string()).optional().describe("Comparison criteria (cost, speed, quality, capabilities)"),
    useCase: z.string().optional().describe("Specific use case for comparison")
  },
  async ({ models, criteria = ["cost", "speed", "quality", "capabilities"], useCase = "general" }) => {
    try {
      const availableModels = FRONTEND_DATA.models;
      const modelsToCompare = models ? 
        availableModels.filter(m => models.includes(m.id)) : 
        availableModels;

      const comparison = {
        useCase,
        criteria,
        models: modelsToCompare.map(model => ({
          ...model,
          scores: {
            cost: model.cost === "low" ? 90 : model.cost === "medium" ? 70 : 50,
            speed: model.type === "balanced" ? 80 : model.type === "advanced" ? 70 : 85,
            quality: model.type === "advanced" ? 95 : model.type === "reasoning" ? 90 : 80,
            capabilities: model.capabilities.length * 25
          }
        })),
        summary: {}
      };

      // Find best models for each category
      comparison.summary.bestForCost = comparison.models.reduce((best, current) => 
        current.scores.cost > best.scores.cost ? current : best
      );
      
      comparison.summary.bestForSpeed = comparison.models.reduce((best, current) => 
        current.scores.speed > best.scores.speed ? current : best
      );
      
      comparison.summary.bestForQuality = comparison.models.reduce((best, current) => 
        current.scores.quality > best.scores.quality ? current : best
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              comparison,
              metadata: {
                comparedAt: new Date().toISOString(),
                totalModels: comparison.models.length,
                criteria
              }
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Model comparison failed: ${error.message}`
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * RESOURCE IMPLEMENTATIONS
 */

/**
 * Resource: prompt://strategies
 * Get available optimization strategies for frontend reference
 */
server.resource(
  "strategies", 
  { uri: "prompt://strategies", list: true },
  async () => {
    try {
      return {
        contents: [
          {
            uri: "prompt://strategies",
            mimeType: "application/json",
            text: JSON.stringify({
              strategies: FRONTEND_DATA.strategies,
              metadata: {
                total: FRONTEND_DATA.strategies.length,
                lastUpdated: new Date().toISOString(),
                source: "frontend-reference",
                version: CONFIG.serverVersion
              }
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch strategies: ${error.message}`);
    }
  }
);

/**
 * Resource: prompt://models
 * Get available AI models for frontend reference
 */
server.resource(
  "models",
  { uri: "prompt://models", list: true },
  async () => {
    try {
      return {
        contents: [
          {
            uri: "prompt://models",
            mimeType: "application/json",
            text: JSON.stringify({
              models: FRONTEND_DATA.models,
              metadata: {
                total: FRONTEND_DATA.models.length,
                active: FRONTEND_DATA.models.filter(m => m.active).length,
                lastUpdated: new Date().toISOString(),
                source: "frontend-reference",
                version: CONFIG.serverVersion
              }
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
  }
);

/**
 * Resource: prompt://optimization-types
 * Get available optimization types for frontend reference
 */
server.resource(
  "optimization_types",
  { uri: "prompt://optimization-types", list: true },
  async () => {
    try {
      return {
        contents: [
          {
            uri: "prompt://optimization-types", 
            mimeType: "application/json",
            text: JSON.stringify({
              optimizationTypes: FRONTEND_DATA.optimizationTypes,
              metadata: {
                total: FRONTEND_DATA.optimizationTypes.length,
                lastUpdated: new Date().toISOString(),
                source: "frontend-reference",
                version: CONFIG.serverVersion
              }
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch optimization types: ${error.message}`);
    }
  }
);

/**
 * Resource: prompt://best-practices
 * Get prompt writing best practices guide for AI assistant
 */
server.resource(
  "best_practices",
  { uri: "prompt://best-practices", list: true },
  async () => {
    try {
      return {
        contents: [
          {
            uri: "prompt://best-practices",
            mimeType: "application/json",
            text: JSON.stringify({
              bestPractices: FRONTEND_DATA.bestPractices,
              metadata: {
                lastUpdated: new Date().toISOString(),
                version: CONFIG.serverVersion,
                purpose: "AI assistant guidance"
              }
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch best practices: ${error.message}`);
    }
  }
);

/**
 * Resource: prompt://templates
 * Get ready-made prompt templates for AI assistant
 */
server.resource(
  "templates",
  { uri: "prompt://templates", list: true },
  async () => {
    try {
      return {
        contents: [
          {
            uri: "prompt://templates",
            mimeType: "application/json", 
            text: JSON.stringify({
              templates: FRONTEND_DATA.templates,
              categories: [...new Set(FRONTEND_DATA.templates.map(t => t.category))],
              metadata: {
                total: FRONTEND_DATA.templates.length,
                lastUpdated: new Date().toISOString(),
                version: CONFIG.serverVersion,
                purpose: "AI assistant reference"
              }
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }
  }
);

/**
 * Start the MCP server
 */
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error(`✅ Frontend Reference MCP Server v${CONFIG.serverVersion} running`);
    console.error(`📚 Purpose: Provide reference data and guidance for frontend and AI assistant`);
    console.error(`🔧 Note: Optimization processing handled by backend API`);
    console.error(`📊 Available Tools: 2`);
    console.error(`📚 Available Resources: 5`);
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\n🛑 Shutting down Frontend Reference MCP server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 Shutting down Frontend Reference MCP server...');
  process.exit(0);
});

// Start the server
startServer();