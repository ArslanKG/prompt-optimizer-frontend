# Frontend Reference MCP Server

A lightweight Model Context Protocol (MCP) server that provides reference data and guidance for the prompt-optimizer-frontend project. This server focuses on supporting the frontend and AI assistant with static data and best practices, while optimization processing is handled by the backend API.

## Purpose

This MCP server is designed to:
- Provide reference data about optimization strategies and models
- Offer best practices and guidance for prompt writing
- Supply template examples for common use cases
- Support frontend development with UI/UX guidelines
- Assist AI assistants with contextual information

**Note**: This server does NOT perform prompt optimization. All optimization processing is handled by the backend API.

## Features

### 🔧 Tools
- **get_frontend_guidance** - Get development guidance for UI/UX, state management, and performance
- **compare_models** - Compare AI models for reference purposes

### 📚 Resources
- **prompt://strategies** - Available optimization strategies with features and timing
- **prompt://models** - Supported AI models with pricing and capabilities
- **prompt://optimization-types** - Types of optimization available (clarity, performance, creativity, accuracy)
- **prompt://best-practices** - Comprehensive prompt writing guidelines for AI assistants
- **prompt://templates** - Ready-made prompt templates for common use cases

## Installation

1. **Dependencies**: Node.js 18+ and npm
2. **Install packages**:
   ```bash
   cd mcp-server
   npm install
   ```

3. **Configuration**: The server uses minimal configuration:
   ```env
   SERVER_NAME=prompt-optimizer-frontend-reference
   SERVER_VERSION=2.0.0
   LOG_LEVEL=info
   ```

## Usage Examples

### Using Tools

```javascript
// Get frontend development guidance
await use_mcp_tool("prompt-optimizer", "get_frontend_guidance", {
  "section": "ui-ux"  // or "state-management", "performance", "all"
});

// Compare models for reference
await use_mcp_tool("prompt-optimizer", "compare_models", {
  "criteria": ["cost", "speed", "quality"],
  "useCase": "general text generation"
});
```

### Using Resources

```javascript
// Get optimization strategies
await access_mcp_resource("prompt-optimizer", "prompt://strategies");

// Get available models
await access_mcp_resource("prompt-optimizer", "prompt://models");

// Get optimization types
await access_mcp_resource("prompt-optimizer", "prompt://optimization-types");

// Get best practices guide
await access_mcp_resource("prompt-optimizer", "prompt://best-practices");

// Get prompt templates
await access_mcp_resource("prompt-optimizer", "prompt://templates");
```

## Data Structure

### Strategies
Each strategy includes:
- `id`, `name`, `description`
- `color`, `icon` for UI display
- `estimatedTime` for user expectations
- `features` array describing capabilities

### Models
Each model includes:
- Basic info (`id`, `name`, `description`, `provider`)
- Performance metrics (`type`, `cost`, `priority`)
- Technical specs (`capabilities`, `maxTokens`)
- Pricing information (`input`/`output` costs)

### Best Practices
Organized in sections:
- Clarity and Specificity
- Structure and Format
- Context and Constraints
- Optimization Techniques

### Templates
Include:
- Template text with variable placeholders
- Use case descriptions
- Category classification
- Variable definitions

## Architecture

### Core Components
- **McpServer**: Main server using `@modelcontextprotocol/sdk`
- **StdioServerTransport**: Standard I/O transport for MCP communication
- **Static Data**: No external API dependencies, all data is static

### Key Differences from v1.0
- **Removed**: API client, caching, authentication
- **Removed**: Optimization processing tools
- **Added**: Frontend-specific guidance
- **Added**: Optimization types resource
- **Simplified**: Focus on reference data only

## Development

### Running the Server

```bash
# Start with file watching
npm run dev

# Start normally
npm start
```

### Integration

Add to your MCP settings:

```json
{
  "mcpServers": {
    "prompt-optimizer": {
      "command": "node",
      "args": ["./mcp-server/index.js"],
      "disabled": false
    }
  }
}
```

## Frontend Integration

The server provides data that matches frontend expectations:

- **Same data models** as used in the React components
- **UI-friendly formats** with colors, icons, and display text
- **Development guidance** for frontend best practices
- **Template structure** that can be directly used in UI
- **Local data fallback** - Models page uses local `models.json` data when API unavailable
- **Public chat support** - Frontend supports `/api/public/chat/send` endpoint for non-authenticated users

### Recent Updates (v2.0.1)
- ✅ **Public Chat Integration**: Frontend now supports public chat endpoint without authentication
- ✅ **Models Page Fix**: Resolved display issues by using local JSON data as primary source
- ✅ **Enhanced API Service**: Added `sendPublicMessage` method for unauthenticated requests
- ✅ **Improved Error Handling**: Better fallback mechanisms for API failures

## Security & Performance

- **No external dependencies**: All data is static, no API calls
- **Input validation**: All inputs validated with Zod schemas
- **Minimal resource usage**: Lightweight server with no caching overhead
- **No sensitive data**: All information is reference material

## Migration from v1.0

If upgrading from the previous version:

1. **Remove dependencies**: No longer need `axios`
2. **Update configuration**: Simplified `.env` file
3. **Update integrations**: Tools have changed, some removed
4. **Backend integration**: Ensure your backend handles optimization

## Contributing

1. Focus on reference data accuracy and completeness
2. Maintain consistency with frontend data structures
3. Update documentation for any data changes
4. Ensure all data is static and doesn't require external APIs

## License

MIT License - see LICENSE file for details.

## Support

This server provides reference data only. For optimization functionality:
- Check backend API connectivity
- Verify frontend integration with backend
- Review frontend error handling for optimization requests