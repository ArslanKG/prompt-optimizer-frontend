import React from 'react';
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
  Divider,
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

const ChatMessage = ({ message, isUser, result }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Kopyalandı!');
  };

  const renderContent = (content) => {
    // Code block detection and rendering
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);
    
    return parts.map((part, index) => {
      if (index % 3 === 2) {
        const language = parts[index - 1] || 'javascript';
        return (
          <Box key={index} sx={{ position: 'relative', my: 2 }}>
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
                onClick={() => handleCopy(part)}
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
              {part}
            </SyntaxHighlighter>
          </Box>
        );
      } else if (index % 3 === 0) {
        // Process the text content for better formatting
        const processedText = part
          .split('\n')
          .map((line, lineIndex) => {
            // Check for headers (# to ######)
            if (line.startsWith('# ')) {
              return (
                <Box key={lineIndex} sx={{ my: 3 }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, fontSize: '2.5rem' }}>
                    {line.replace('# ', '')}
                  </Typography>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              );
            }
            else if (line.startsWith('## ')) {
              return (
                <Box key={lineIndex} sx={{ my: 2.5 }}>
                  <Typography variant="h3" sx={{ fontWeight: 600, fontSize: '2rem' }}>
                    {line.replace('## ', '')}
                  </Typography>
                  <Divider sx={{ mt: 1.5 }} />
                </Box>
              );
            }
            else if (line.startsWith('### ')) {
              return (
                <Box key={lineIndex} sx={{ my: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, fontSize: '1.5rem', color: theme.palette.primary.main }}>
                    {line.replace('### ', '')}
                  </Typography>
                </Box>
              );
            }
            else if (line.startsWith('#### ')) {
              return (
                <Typography key={lineIndex} variant="h5" sx={{ fontWeight: 600, fontSize: '1.25rem', mt: 2, mb: 1 }}>
                  {line.replace('#### ', '')}
                </Typography>
              );
            }
            else if (line.startsWith('##### ')) {
              return (
                <Typography key={lineIndex} variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', mt: 1.5, mb: 0.5 }}>
                  {line.replace('##### ', '')}
                </Typography>
              );
            }
            else if (line.startsWith('###### ')) {
              return (
                <Typography key={lineIndex} variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mt: 1, mb: 0.5, color: theme.palette.text.secondary }}>
                  {line.replace('###### ', '')}
                </Typography>
              );
            }
            // Check if line is just divider (*** or --- or ___)
            else if (line.trim().match(/^(\*{3,}|-{3,}|_{3,})$/)) {
              return (
                <Divider key={lineIndex} sx={{ my: 2 }} />
              );
            }
            // Check for blockquote (starts with >)
            else if (line.startsWith('> ')) {
              const processedQuote = processTextWithFormatting(line.replace('> ', ''));
              return (
                <Box key={lineIndex} sx={{ 
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  pl: 2,
                  py: 1,
                  my: 1,
                  bgcolor: theme.palette.action.hover,
                  borderRadius: '0 8px 8px 0'
                }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {processedQuote}
                  </Typography>
                </Box>
              );
            }
            // Check for table
            else if (line.includes('|') && line.trim().startsWith('|')) {
              const cells = line.split('|').filter(cell => cell.trim());
              return (
                <Box key={lineIndex} sx={{ overflowX: 'auto' }}>
                  <Box sx={{ display: 'flex', minWidth: 'fit-content' }}>
                    {cells.map((cell, cellIndex) => (
                      <Box key={cellIndex} sx={{ 
                        p: 1, 
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        minWidth: '100px',
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2">
                          {processTextWithFormatting(cell.trim())}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            }
            // Check for code inline (text between `)
            else if (line.includes('`') && !line.startsWith('```')) {
              const codeProcessed = line.split(/`([^`]+)`/g);
              return (
                <Typography key={lineIndex} variant="body1" sx={{ my: 1, lineHeight: 1.7 }}>
                  {codeProcessed.map((part, partIndex) => 
                    partIndex % 2 === 1 ? (
                      <Box component="code" key={partIndex} sx={{ 
                        backgroundColor: theme.palette.action.hover,
                        px: 0.5,
                        py: 0.25,
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                        color: theme.palette.error.main
                      }}>
                        {part}
                      </Box>
                    ) : (
                      processTextWithFormatting(part)
                    )
                  )}
                </Typography>
              );
            }
            // Check if line is a list item
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
                    {processTextWithFormatting(processedLine)}
                  </Typography>
                </Box>
              );
            }
            // Check for task list (- [ ] or - [x])
            else if (line.match(/^[-*+]\s\[([ x])\]/)) {
              const isChecked = line.includes('[x]');
              const taskText = line.replace(/^[-*+]\s\[([ x])\]\s*/, '');
              
              return (
                <Box key={lineIndex} sx={{ display: 'flex', alignItems: 'center', my: 0.5, ml: 2 }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: '3px',
                    mr: 1,
                    backgroundColor: isChecked ? theme.palette.primary.main : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isChecked && (
                      <Typography sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</Typography>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ 
                    textDecoration: isChecked ? 'line-through' : 'none',
                    color: isChecked ? theme.palette.text.secondary : 'inherit'
                  }}>
                    {processTextWithFormatting(taskText)}
                  </Typography>
                </Box>
              );
            }
            // Regular paragraph with text formatting
            else if (line.trim()) {
              return (
                <Typography key={lineIndex} variant="body1" sx={{ my: 1, lineHeight: 1.7 }}>
                  {processTextWithFormatting(line)}
                </Typography>
              );
            }
            return null;
          })
          .filter(Boolean);
  
        return <Box key={index}>{processedText}</Box>;
      }
      return null;
    });
  
    // Helper function to process text formatting (bold, italic, strikethrough, links)
    function processTextWithFormatting(text) {
      if (!text) return text;
  
      // Process links first [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let processedText = text.split(linkRegex);
      
      if (processedText.length > 1) {
        return processedText.map((part, i) => {
          if (i % 3 === 1) {
            return (
              <Box
                key={i}
                component="a"
                href={processedText[i + 1]}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                {part}
              </Box>
            );
          } else if (i % 3 === 0) {
            return processFormattingInText(part);
          }
          return null;
        });
      }
      
      return processFormattingInText(text);
    }
  
    // Helper to process bold, italic, strikethrough
    function processFormattingInText(text) {
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
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: 2,
            maxWidth: '85%',
          }}
        >
          <Avatar
            sx={{
              bgcolor: isUser
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : theme.palette.grey[700],
              width: 40,
              height: 40,
            }}
          >
            {isUser ? <PersonIcon /> : <BotIcon />}
          </Avatar>
          
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: isUser
                ? theme.palette.mode === 'dark'
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(99, 102, 241, 0.1)'
                : theme.palette.mode === 'dark'
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(248, 250, 252, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              minWidth: '300px',
            }}
          >
            {!isUser && result && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip
                    icon={<SpeedIcon />}
                    label={`${result.strategy} stratejisi`}
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
                      label={`${result.modelsUsed.length} model kullanıldı`}
                      size="small"
                      variant="outlined"
                      onClick={() => setExpanded(!expanded)}
                      onDelete={() => setExpanded(!expanded)}
                      deleteIcon={expanded ? <CollapseIcon /> : <ExpandIcon />}
                    />
                  )}
                </Box>
                
                <Collapse in={expanded}>
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Kullanılan modeller: {result.modelsUsed?.join(', ')}
                    </Typography>
                    {result.optimizedPrompt && result.optimizedPrompt !== message && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Optimize edilmiş prompt:
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
            
            <Box sx={{ position: 'relative' }}>
              {renderContent(message)}
              
              {!isUser && (
                <Tooltip title="Yanıtı kopyala">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(message)}
                    sx={{
                      position: 'absolute',
                      top: -40,
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
          </Paper>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ChatMessage;