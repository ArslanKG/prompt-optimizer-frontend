import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';

// Modern Color Palette for Code Blocks
const codeColors = {
  background: '#0d1117',
  border: '#21262d',
  headerBg: '#161b22',
  text: '#f0f6fc',
  textSecondary: '#7d8590',
  success: '#238636',
  copyButton: '#636969',
};

// Enhanced language detection with more patterns
const detectLanguage = (code) => {
  const patterns = {
    javascript: /(?:function|const|let|var|=>|console\.log|require|import|export)/i,
    typescript: /(?:interface|type|enum|declare|as\s+\w+|Record<|Partial<)/i,
    python: /(?:def\s+\w+|import\s+\w+|from\s+\w+|print\(|if\s+__name__|class\s+\w+:)/i,
    java: /(?:public\s+class|public\s+static\s+void|import\s+java\.|System\.out\.println)/i,
    csharp: /(?:using\s+System|public\s+class|static\s+void\s+Main|Console\.WriteLine)/i,
    cpp: /(?:#include\s*<|std::|cout\s*<<|int\s+main\s*\()/i,
    c: /(?:#include\s*<stdio\.h>|printf\s*\(|int\s+main\s*\()/i,
    php: /(?:<\?php|\$\w+|echo\s+|function\s+\w+\s*\()/i,
    ruby: /(?:def\s+\w+|end\s*$|puts\s+|require\s+)/i,
    go: /(?:package\s+main|func\s+main|fmt\.Print|import\s+\()/i,
    rust: /(?:fn\s+main|let\s+mut|println!|use\s+std::)/i,
    swift: /(?:import\s+\w+|func\s+\w+|var\s+\w+:|let\s+\w+\s*=)/i,
    kotlin: /(?:fun\s+main|val\s+\w+|var\s+\w+|println\()/i,
    scala: /(?:object\s+\w+|def\s+main|val\s+\w+|println\()/i,
    html: /(?:<\/?[a-z][\s\S]*>|<!DOCTYPE|<html)/i,
    css: /(?:@media|@import|\.[a-zA-Z][\w-]*\s*\{|#[a-zA-Z][\w-]*\s*\{)/i,
    scss: /(?:\$[a-zA-Z][\w-]*\s*:|@mixin|@include|@extend)/i,
    sql: /(?:SELECT\s+|INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM|CREATE\s+TABLE)/i,
    json: /^\s*[{[]/,
    xml: /(?:<\?xml|<\/?\w+(?:\s+[^>]*)?>)/i,
    yaml: /(?:^[\s]*-\s+\w+:|^\s*\w+:\s*[\w[{])/m,
    dockerfile: /(?:FROM\s+\w+|RUN\s+|COPY\s+|ADD\s+|WORKDIR\s+)/i,
    bash: /(?:#!\/bin\/bash|echo\s+\\\$|export\s+\w+=|\\\$\\\{\w+\\\})/i,
    powershell: /(?:\\\$\w+\s*=|Get-\w+|Set-\w+|Write-Host)/i,
    markdown: /(?:^#\+ |^\\\* |^\d\+\. |```)/m,
  };

  // Clean code for better detection
  const cleanCode = code.trim();
  
  // Check for specific patterns
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleanCode)) {
      return lang;
    }
  }
  
  // Fallback based on common syntax
  if (cleanCode.includes('{') && cleanCode.includes('}')) {
    if (cleanCode.includes('function') || cleanCode.includes('=>')) return 'javascript';
    if (cleanCode.includes('class') && cleanCode.includes('public')) return 'java';
    return 'javascript'; // Default for brace languages
  }
  
  return 'text';
};

// Modern Code Block Component with Copy Functionality
const CodeBlock = ({ language, code, inline = false }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Auto-detect language if not provided
  const detectedLang = language || detectLanguage(code);
  
  if (inline) {
    return (
      <Box
        component="code"
        onClick={handleCopy}
        sx={{
          backgroundColor: codeColors.border,
          color: codeColors.success,
          padding: '1px 4px',
          borderRadius: '3px',
          fontSize: 'inherit',
          fontFamily: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
          border: `1px solid ${codeColors.border}`,
          display: 'inline',
          verticalAlign: 'baseline',
          lineHeight: 'inherit',
          wordBreak: 'break-word',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          margin: '0',
          '&:hover': {
            backgroundColor: codeColors.success,
            color: '#ffffff',
            borderColor: codeColors.success,
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
        title={copied ? 'Kopyalandı!' : 'Kopyalamak için tıklayın'}
      >
        {code}
        {copied && (
          <Box
            sx={{
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: codeColors.success,
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              pointerEvents: 'none',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: `4px solid ${codeColors.success}`,
              },
            }}
          >
            Kopyalandı!
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: codeColors.background,
        border: `1px solid ${codeColors.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '12px 0',
        maxWidth: 'min(100%, 650px)', // Chat container'a kesinlikle sığacak şekilde
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        '@media (max-width: 768px)': {
          maxWidth: 'calc(100vw - 100px)', // Mobile'da daha dar
        },
      }}
    >
      {/* Code Header with Language and Copy Button */}
      <Box
        sx={{
          backgroundColor: codeColors.headerBg,
          borderBottom: `1px solid ${codeColors.border}`,
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '40px',
        }}
      >
        <Typography
          sx={{
            color: codeColors.textSecondary,
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: '"Fira Code", monospace',
          }}
        >
          {detectedLang === 'text' ? 'CODE' : detectedLang}
        </Typography>
        
        <Tooltip title={copied ? 'Copied!' : 'Copy code'} arrow>
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              color: copied ? codeColors.success : codeColors.textSecondary,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: codeColors.border,
                color: codeColors.text,
              },
              padding: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? (
              <CheckIcon sx={{ fontSize: 16 }} />
            ) : (
              <CopyIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Code Content with Syntax Highlighting */}
      <Box
        sx={{
          overflow: 'auto',
          maxHeight: '400px',
          '& pre': {
            margin: '0 !important',
            background: 'transparent !important',
            padding: '16px !important',
            fontSize: '13px !important',
            lineHeight: '1.5 !important',
            fontFamily: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace !important',
          },
          '& code': {
            fontFamily: 'inherit !important',
            fontSize: 'inherit !important',
          },
          // Custom scrollbar
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: codeColors.background,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: codeColors.border,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: codeColors.textSecondary,
            },
          },
        }}
      >
        <SyntaxHighlighter
          language={detectedLang}
          style={vscDarkPlus}
          showLineNumbers={code.split('\n').length > 5}
          lineNumberStyle={{
            color: codeColors.textSecondary,
            fontSize: '11px',
            paddingRight: '12px',
            borderRight: `1px solid ${codeColors.border}`,
            marginRight: '12px',
          }}
          customStyle={{
            backgroundColor: 'transparent',
            margin: 0,
            padding: '16px',
            fontSize: '13px',
            lineHeight: '1.5',
            fontFamily: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
          }}
          wrapLongLines={true}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

/**
 * Enhanced markdown renderer with professional code formatting
 */
export const renderMarkdown = (text) => {
  if (typeof text !== 'string') return text;
  
  let html = text;
  
  // Handle headings FIRST - simple and robust regex
  html = html.replace(/^(#{1,4})\s+(.+)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    return `<h${level}>${title.trim()}</h${level}>`;
  });
  
  // Handle code blocks AFTER headings to protect them from other processing
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const trimmedCode = code.trim();
    return `<code-block language="${lang || ''}" code="${encodeURIComponent(trimmedCode)}"></code-block>`;
  });
  
  // Handle inline code (`code`) - protect from other processing
  html = html.replace(/`([^`\n]+)`/g, '<inline-code>$1</inline-code>');
  
  // Handle bold text (**bold**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic text (*italic*) - avoid list markers
  html = html.replace(/(?<!^[\s]*[-*+]\s.*)\*([^*\n]+)\*/g, '<em>$1</em>');
  
  // Handle unordered lists with better formatting
  html = html.replace(/^[\s]*[-*+]\s(.*)$/gm, '<li>$1</li>');
  
  // Handle ordered lists
  html = html.replace(/^[\s]*\d+\.\s(.*)$/gm, '<li-ordered>$1</li-ordered>');
  
  // Handle paragraph breaks and line breaks more carefully
  html = html.replace(/\n\s*\n/g, '<paragraph-break>');
  html = html.replace(/\n/g, '<line-break>');
  
  return html;
};

/**
 * React component for rendering enhanced markdown content
 */
export const MarkdownContent = ({ content, className = '', style = {} }) => {
  const processContent = (text) => {
    const rendered = renderMarkdown(text);
    
    // Split content ONLY by code blocks and headings (NOT inline code)
    const parts = rendered.split(/(<code-block[^>]*>.*?<\/code-block>|<h[1-4]>.*?<\/h[1-4]>)/);
    
    return parts.map((part, index) => {
      // Handle code blocks
      if (part.includes('<code-block')) {
        const match = part.match(/<code-block language="([^"]*)" code="([^"]*)"><\/code-block>/);
        if (match) {
          const [, language, encodedCode] = match;
          const code = decodeURIComponent(encodedCode);
          return <CodeBlock key={index} language={language} code={code} />;
        }
      }
      
      // Handle headings specifically
      if (part.match(/<h[1-4]>/)) {
        return (
          <Box
            key={index}
            sx={{
              '& h1, & h2, & h3, & h4': {
                color: codeColors.text,
                margin: '20px 0 12px 0',
                fontWeight: 600,
                maxWidth: '100%',
                overflowWrap: 'break-word',
              },
              '& h1': { fontSize: '24px' },
              '& h2': { fontSize: '20px' },
              '& h3': { fontSize: '18px' },
              '& h4': { fontSize: '16px' },
            }}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        );
      }
      
      // Handle regular content (including inline code)
      if (part.trim()) {
        // Process line breaks and paragraph breaks
        let processedPart = part
          .replace(/<paragraph-break>/g, '<br><br>')
          .replace(/<line-break>/g, '<br>');
        
        // Handle inline code within text content
        const hasInlineCode = processedPart.includes('<inline-code>');
        
        if (hasInlineCode) {
          // Split by inline code to create mixed content
          const inlineParts = processedPart.split(/(<inline-code>.*?<\/inline-code>)/);
          
          return (
            <Box
              key={index}
              component="span"
              sx={{
                maxWidth: '100%',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                display: 'inline',
                '& strong': {
                  fontWeight: 600,
                  color: codeColors.text,
                },
                '& em': {
                  fontStyle: 'italic',
                  color: codeColors.textSecondary,
                },
                '& li': {
                  margin: '4px 0',
                  color: codeColors.text,
                  paddingLeft: '8px',
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                },
                '& br': {
                  lineHeight: 1.6,
                },
                fontSize: 'inherit',
                lineHeight: 'inherit',
                color: 'inherit',
              }}
            >
              {inlineParts.map((inlinePart, inlineIndex) => {
                if (inlinePart.includes('<inline-code>')) {
                  const code = inlinePart.replace(/<\/?inline-code>/g, '');
                  return <CodeBlock key={inlineIndex} code={code} inline={true} />;
                } else if (inlinePart.trim()) {
                  return (
                    <span
                      key={inlineIndex}
                      dangerouslySetInnerHTML={{ __html: inlinePart }}
                    />
                  );
                }
                return null;
              })}
            </Box>
          );
        } else {
          return (
            <Box
              key={index}
              component="div"
              sx={{
                maxWidth: '100%',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                '& strong': {
                  fontWeight: 600,
                  color: codeColors.text,
                },
                '& em': {
                  fontStyle: 'italic',
                  color: codeColors.textSecondary,
                },
                '& li': {
                  margin: '4px 0',
                  color: codeColors.text,
                  paddingLeft: '8px',
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                },
                '& br': {
                  lineHeight: 1.6,
                },
                fontSize: 'inherit',
                lineHeight: 'inherit',
                color: 'inherit',
              }}
              dangerouslySetInnerHTML={{ __html: processedPart }}
            />
          );
        }
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <Box
      className={className}
      sx={{
        ...style,
        fontSize: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit',
        width: '100%',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      {processContent(content)}
    </Box>
  );
};

const markdownRenderer = {
  renderMarkdown,
  MarkdownContent,
  CodeBlock
};

export default markdownRenderer;