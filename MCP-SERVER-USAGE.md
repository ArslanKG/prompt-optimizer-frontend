# Prompt Optimizer MCP Server - Usage Guide

## 🎉 Setup Complete!

Your comprehensive MCP server for prompt optimization is now ready! All validation tests have passed successfully.

## 📁 What Was Created

```
prompt-optimizer-frontend/
├── mcp-server/
│   ├── package.json          # Node.js dependencies
│   ├── index.js              # Main MCP server (917 lines)
│   ├── .env                  # Environment configuration
│   ├── README.md             # Detailed documentation
│   └── test-setup.js         # Validation script
├── mcp.json                  # Project MCP configuration
└── .roo/mcp.json            # Updated MCP settings
```

## 🔧 Available Tools (6 Total)

### 1. `optimize_prompt`
Optimize prompts using various strategies and models
```javascript
use_mcp_tool("prompt-optimizer", "optimize_prompt", {
  "prompt": "Write a story about AI",
  "strategy": "quality",
  "model": "gpt-4o-mini",
  "optimizationType": "clarity"
});
```

### 2. `analyze_prompt_quality`
Analyze and score prompt quality with detailed feedback
```javascript
use_mcp_tool("prompt-optimizer", "analyze_prompt_quality", {
  "prompt": "Your prompt text here",
  "criteria": ["clarity", "specificity", "structure"]
});
```

### 3. `get_optimization_suggestions`
Get specific improvement suggestions for prompts
```javascript
use_mcp_tool("prompt-optimizer", "get_optimization_suggestions", {
  "prompt": "Analyze this data",
  "focusArea": "clarity",
  "targetModel": "gpt-4o"
});
```

### 4. `compare_models`
Compare AI models for different use cases
```javascript
use_mcp_tool("prompt-optimizer", "compare_models", {
  "criteria": ["cost", "speed", "quality"],
  "useCase": "general text generation"
});
```

### 5. `validate_prompt_structure`
Validate prompt structure and format
```javascript
use_mcp_tool("prompt-optimizer", "validate_prompt_structure", {
  "prompt": "Your prompt here",
  "rules": ["length", "clarity", "structure"],
  "format": "instruction"
});
```

### 6. `generate_prompt_variations`
Generate multiple variations of existing prompts
```javascript
use_mcp_tool("prompt-optimizer", "generate_prompt_variations", {
  "prompt": "Create a marketing plan",
  "variationType": "style",
  "count": 3
});
```

## 📚 Available Resources (4 Total)

### 1. `prompt://strategies`
Get optimization strategies (Quality, Speed, Consensus, Cost-Effective)
```javascript
access_mcp_resource("prompt-optimizer", "prompt://strategies");
```

### 2. `prompt://models`
Get available AI models with pricing and capabilities
```javascript
access_mcp_resource("prompt-optimizer", "prompt://models");
```

### 3. `prompt://best-practices`
Get comprehensive prompt writing guidelines
```javascript
access_mcp_resource("prompt-optimizer", "prompt://best-practices");
```

### 4. `prompt://templates`
Get ready-made prompt templates for common use cases
```javascript
access_mcp_resource("prompt-optimizer", "prompt://templates");
```

## 🚀 How to Use

### Option 1: With Backend API
1. **Start your backend API** at `https://localhost:7179/api`
2. **The MCP server will automatically connect** when you use any tool
3. **Authentication**: Add JWT token to `mcp-server/.env` if needed:
   ```env
   JWT_TOKEN=your_jwt_token_here
   ```

### Option 2: With Mock Data (Development)
1. **Enable mock data** in `mcp-server/.env`:
   ```env
   USE_MOCK_DATA=true
   ```
2. **Use tools immediately** - no backend required!

## 🔍 Test Your Setup

Run the validation script to ensure everything works:
```bash
cd mcp-server
node test-setup.js
```

All tests should show ✅ (they already do!).

## 💡 Quick Start Examples

### Optimize a Simple Prompt
```javascript
// Input: "Write a story"
// Output: Detailed optimization with strategy-specific improvements
use_mcp_tool("prompt-optimizer", "optimize_prompt", {
  "prompt": "Write a story",
  "strategy": "quality"
});
```

### Get Available Models
```javascript
// Returns: List of 7 AI models with pricing and capabilities
access_mcp_resource("prompt-optimizer", "prompt://models");
```

### Analyze Prompt Quality
```javascript
// Returns: Quality score, strengths, weaknesses, suggestions
use_mcp_tool("prompt-optimizer", "analyze_prompt_quality", {
  "prompt": "Create a detailed marketing strategy for a tech startup focusing on AI solutions, including target audience analysis, competitive landscape, and budget allocation for the next 6 months."
});
```

## 🛠️ Configuration Options

Edit `mcp-server/.env` to customize:

```env
# API Integration
API_BASE_URL=https://localhost:7179/api
JWT_TOKEN=your_token_here

# Development Mode
USE_MOCK_DATA=false
ENABLE_CACHE=true
LOG_LEVEL=info

# Performance
CACHE_TIMEOUT=300000
API_TIMEOUT=60000
```

## 📊 Features

- **✅ Backend Integration**: Seamless API connectivity with fallbacks
- **✅ Mock Data**: Comprehensive fallback data for development
- **✅ Caching**: Smart response caching for performance
- **✅ Authentication**: JWT token support for secured endpoints
- **✅ Error Handling**: Graceful error recovery and logging
- **✅ Validation**: Input validation with Zod schemas
- **✅ Documentation**: Extensive documentation and examples

## 🎯 Real-World Usage

### For Developers
```javascript
// Optimize code generation prompts
use_mcp_tool("prompt-optimizer", "optimize_prompt", {
  "prompt": "Write Python code",
  "strategy": "performance",
  "optimizationType": "accuracy"
});
```

### For Content Creators
```javascript
// Get creative writing variations
use_mcp_tool("prompt-optimizer", "generate_prompt_variations", {
  "prompt": "Write a blog post about AI trends",
  "variationType": "creativity",
  "count": 5
});
```

### For Business Users
```javascript
// Compare models for cost-effectiveness
use_mcp_tool("prompt-optimizer", "compare_models", {
  "criteria": ["cost", "quality"],
  "useCase": "business communications"
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Server not starting**: Check if Node.js 18+ is installed
2. **API connection failed**: Verify backend is running or enable mock data
3. **Authentication errors**: Check JWT token in .env file
4. **Tool not found**: Restart MCP client to reload server configuration

### Debug Mode
Enable detailed logging:
```env
LOG_LEVEL=debug
ENABLE_DEBUG_MODE=true
```

## 📈 Next Steps

1. **Try the tools** with your actual prompts
2. **Explore resources** to understand available options
3. **Customize configuration** for your specific needs
4. **Check the logs** for performance insights
5. **Read the full documentation** in `mcp-server/README.md`

## 🎊 You're Ready!

Your MCP server is fully functional and ready to supercharge your prompt optimization workflow. Start with simple examples and gradually explore all the advanced features!

---
*For detailed technical documentation, see `mcp-server/README.md`*
*For issues or questions, check the error logs and backend connectivity*