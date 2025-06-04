import React, { memo, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import { useTranslation } from '../../hooks/useTranslation';

// Memoize heavy rendering functions
const CodeBlock = memo(({ language, code, theme, onCopy }) => (
  <Box sx={{ position: 'relative', my: 2 }}>
    <Box sx={{ 
      mb: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <Typography variant="caption" sx={{ 
        color: theme.palette.text.secondary,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: 0.5
      }}>
        {language}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onCopy(code)}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
          },
        }}
      >
        <CopyIcon fontSize="small" />
      </IconButton>
    </Box>
    <SyntaxHighlighter
      language={language}
      style={theme.palette.mode === 'dark' ? vscDarkPlus : vs}
      customStyle={{
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        margin: 0,
      }}
    >
      {code}
    </SyntaxHighlighter>
  </Box>
));

CodeBlock.displayName = 'CodeBlock';

// Memoized text formatting component
const FormattedText = memo(({ text, theme }) => {
  const processTextWithFormatting = useCallback((text) => {
    if (!text) return text;

    // Combined regex for all formatting
    const formattingRegex = /(\*\*\*|___)(.*?)\1|(\*\*|__)(.*?)\3|(\*|_)(.*?)\5|(~~)(.*?)~~/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = formattingRegex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Process the match
      if (match[1]) {
        // Bold + Italic (*** or ___)
        parts.push(
          <Box component="span" key={match.index} sx={{ fontWeight: 700, fontStyle: 'italic' }}>
            {match[2]}
          </Box>
        );
      } else if (match[3]) {
        // Bold (** or __)
        parts.push(
          <Box component="span" key={match.index} sx={{ fontWeight: 600 }}>
            {match[4]}
          </Box>
        );
      } else if (match[5]) {
        // Italic (* or _)
        parts.push(
          <Box component="span" key={match.index} sx={{ fontStyle: 'italic' }}>
            {match[6]}
          </Box>
        );
      } else if (match[7]) {
        // Strikethrough (~~)
        parts.push(
          <Box component="span" key={match.index} sx={{ textDecoration: 'line-through' }}>
            {match[8]}
          </Box>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }, []);

  return <>{processTextWithFormatting(text)}</>;
});

FormattedText.displayName = 'FormattedText';

const ChatMessage = memo(({ message, isUser, result }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast.success(t('success.copied') || 'Copied!');
  }, [t]);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  // Minimal ChatGPT-style avatar
  const avatarSx = useMemo(() => ({
    width: 32,
    height: 32,
    bgcolor: isUser
      ? theme.palette.mode === 'dark' ? '#6E61CC' : '#6E61CC'
      : theme.palette.mode === 'dark' ? '#4a5568' : '#e2e8f0',
    color: isUser ? 'white' : theme.palette.text.primary,
    fontSize: '0.9rem',
    fontWeight: 500,
  }), [isUser, theme.palette.mode, theme.palette.text.primary]);

  // ChatGPT-style message container
  const messageContainerSx = useMemo(() => ({
    p: 3,
    borderRadius: 3,
    maxWidth: '100%',
    fontFamily: 'Inter, sans-serif',
    
    // User messages: transparent border like ChatGPT
    ...(isUser && {
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
      bgcolor: 'transparent',
    }),
    
    // Assistant messages: no border, just background color difference
    ...(!isUser && {
      bgcolor: 'transparent', // No background for assistant like ChatGPT
      border: 'none',
    }),
  }), [isUser, theme.palette.mode]);

  // Optimized content rendering with basic markdown support
  const renderContent = useMemo(() => {
    // Code block detection and rendering
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = message.split(codeBlockRegex);
    
    return parts.map((part, index) => {
      if (index % 3 === 2) {
        const language = parts[index - 1] || 'javascript';
        return (
          <CodeBlock
            key={index}
            language={language}
            code={part}
            theme={theme}
            onCopy={handleCopy}
          />
        );
      } else if (index % 3 === 0 && part) {
        // Process the text content for basic formatting
        const lines = part.split('\n');
        
        return (
          <Box key={index}>
            {lines.map((line, lineIndex) => {
              // Headers
              if (line.startsWith('### ')) {
                return (
                  <Typography key={lineIndex} variant="h6" sx={{ fontWeight: 600, mt: 2, mb: 1, color: theme.palette.primary.main }}>
                    {line.replace('### ', '')}
                  </Typography>
                );
              }
              else if (line.startsWith('## ')) {
                return (
                  <Typography key={lineIndex} variant="h5" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    {line.replace('## ', '')}
                  </Typography>
                );
              }
              else if (line.startsWith('# ')) {
                return (
                  <Typography key={lineIndex} variant="h4" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                    {line.replace('# ', '')}
                  </Typography>
                );
              }
              // List items
              else if (line.match(/^(\d+\.|[-*+])\s/)) {
                const isOrdered = line.match(/^\d+\.\s/);
                const processedLine = line.replace(/^(\d+\.|[-*+])\s/, '');
                
                return (
                  <Box key={lineIndex} sx={{ pl: 2, my: 0.5 }}>
                    <Typography variant="body1" component="li" sx={{ 
                      listStyleType: isOrdered ? 'decimal' : 'disc',
                      display: 'list-item',
                      ml: 3
                    }}>
                      <FormattedText text={processedLine} theme={theme} />
                    </Typography>
                  </Box>
                );
              }
              // Regular paragraph with text formatting
              else if (line.trim()) {
                return (
                  <Typography key={lineIndex} variant="body1" sx={{ my: 1, lineHeight: 1.7 }}>
                    <FormattedText text={line} theme={theme} />
                  </Typography>
                );
              }
              return null;
            }).filter(Boolean)}
          </Box>
        );
      }
      return null;
    });
  }, [message, theme, handleCopy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ChatGPT-style full width layout */}
      <Box
        sx={{
          width: '100%',
          mb: 6,
          px: { xs: 3, md: 6 },
          py: 4,
          // User messages get subtle background like ChatGPT
          ...(isUser && {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          }),
        }}
      >
        <Box
          sx={{
            maxWidth: '768px', // ChatGPT content width
            mx: 'auto',
            display: 'flex',
            gap: 3,
            alignItems: 'flex-start',
          }}
        >
          {/* Small Avatar */}
          <Avatar sx={avatarSx}>
            {isUser ? <PersonIcon /> : <BotIcon />}
          </Avatar>
          
          {/* Message Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Assistant metadata */}
            {!isUser && result && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip
                    icon={<SpeedIcon />}
                    label={`${t(`strategies.${result.strategy}.name`) || result.strategy} ${t('chat.strategy').toLowerCase()}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<TimerIcon />}
                    label={`${(result.processingTimeMs / 1000).toFixed(1)}s`}
                    size="small"
                    variant="outlined"
                  />
                  {result.modelsUsed?.length > 0 && (
                    <Chip
                      label={`${result.modelsUsed.length} model`}
                      size="small"
                      variant="outlined"
                      onClick={toggleExpanded}
                      onDelete={toggleExpanded}
                      deleteIcon={expanded ? <CollapseIcon /> : <ExpandIcon />}
                    />
                  )}
                </Box>
                
                <Collapse in={expanded}>
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('models.title')}: {result.modelsUsed?.join(', ')}
                    </Typography>
                    {result.optimizedPrompt && result.optimizedPrompt !== message && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {t('chat.optimizedPrompt') || 'Optimized prompt'}:
                        </Typography>
                        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                          "{result.optimizedPrompt}"
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            )}
            
            {/* Message Container */}
            <Box sx={messageContainerSx}>
              <Box sx={{ position: 'relative' }}>
                {renderContent}
                
                {!isUser && (
                  <Tooltip title={t('actions.copyResponse')}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(message)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        opacity: 0.7,
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
