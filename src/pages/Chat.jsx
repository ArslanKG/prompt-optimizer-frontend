import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fade,
  Chip,
  Button,
  Popover,
  MenuItem,
  MenuList,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  ContentCopy as CopyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useOptimizationStore from '../store/optimizationStore';
import toast from 'react-hot-toast';
import { MarkdownContent } from '../utils/markdownRenderer';
import { useTranslation } from '../hooks/useTranslation';
import Logo from '../components/Common/Logo';
import strategiesData from '../data/strategies.json';
import optimizationTypesData from '../data/optimizationTypes.json';

// Color Palette inspired by homepage/header
const colors = {
  background: '#0f1419',
  surface: '#1a1f2e',
  textPrimary: '#f0f6fc',
  textSecondary: '#8b949e',
  accent: '#667eea',
  accentHover: '#5a67d8',
  border: '#21262d',
  userMessage: '#667eea',
  strategyBg: 'rgba(102, 126, 234, 0.1)',
  strategyBorder: 'rgba(102, 126, 234, 0.2)',
};

// Message Component
const MessageItem = ({ message, onCopy }) => {
  const [showCopy, setShowCopy] = useState(false);
  const isUser = message.isUser;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.();
  };

  if (isUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Box
          sx={{
            maxWidth: '70%',
            backgroundColor: colors.userMessage,
            color: 'white',
            borderRadius: '18px',
            padding: '12px 16px',
            fontSize: '15px',
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 4,
        '&:hover .copy-button': {
          opacity: 1,
        }
      }}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <Avatar
        sx={{
          width: 28,
          height: 28,
          backgroundColor: colors.accent,
          fontSize: '14px',
        }}
      >
        <AIIcon sx={{ fontSize: 16 }} />
      </Avatar>
      
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Box
          sx={{
            color: colors.textPrimary,
            fontSize: '15px',
            lineHeight: 1.6,
            '& h1, & h2, & h3': {
              color: colors.textPrimary,
              margin: '12px 0 8px 0',
              fontWeight: 600,
            },
            '& h1': { fontSize: '18px' },
            '& h2': { fontSize: '16px' },
            '& h3': { fontSize: '15px' },
            '& strong': {
              fontWeight: 600,
              color: colors.textPrimary,
            },
            '& em': {
              fontStyle: 'italic',
              color: colors.textSecondary,
            },
            '& code': {
              backgroundColor: colors.border,
              color: colors.accent,
              padding: '2px 4px',
              borderRadius: '3px',
              fontSize: '13px',
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: colors.border,
              color: colors.textPrimary,
              padding: '12px',
              borderRadius: '6px',
              overflow: 'auto',
              margin: '8px 0',
            },
            '& pre code': {
              backgroundColor: 'transparent',
              padding: 0,
              fontSize: '13px',
              fontFamily: 'monospace',
            },
            '& ul, & ol': {
              margin: '8px 0',
              paddingLeft: '20px',
            },
            '& li': {
              margin: '4px 0',
              color: colors.textPrimary,
            },
          }}
        >
          <MarkdownContent content={message.content} />
        </Box>
        
        <Fade in={showCopy}>
          <IconButton
            className="copy-button"
            size="small"
            onClick={handleCopy}
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              opacity: 0,
              backgroundColor: colors.surface,
              color: colors.textSecondary,
              width: 24,
              height: 24,
              '&:hover': {
                backgroundColor: colors.border,
                color: colors.textPrimary,
              },
              transition: 'all 150ms ease',
            }}
          >
            <CopyIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Fade>
      </Box>
    </Box>
  );
};

// Input Component
const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 3,
        backgroundColor: colors.background,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 768,
          margin: '0 auto',
          position: 'relative',
          backgroundColor: colors.surface,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          '&:focus-within': {
            borderColor: colors.accent,
          },
          transition: 'border-color 150ms ease',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || "Optimize etmek istediğiniz prompt'u yazın..."}
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              padding: '12px 52px 12px 16px',
              fontSize: '15px',
              lineHeight: 1.5,
              color: colors.textPrimary,
              '&::placeholder': {
                color: colors.textSecondary,
                opacity: 1,
              },
            },
          }}
        />
        
        <IconButton
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            backgroundColor: message.trim() ? colors.accent : 'transparent',
            color: message.trim() ? 'white' : colors.textSecondary,
            '&:hover': {
              backgroundColor: message.trim() ? colors.accentHover : colors.border,
            },
            '&:disabled': {
              color: colors.textSecondary,
              backgroundColor: 'transparent',
            },
            transition: 'all 150ms ease',
          }}
        >
          {disabled ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 16 }} />
            </motion.div>
          ) : (
            <SendIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

// Minimal Header Component
const MinimalHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Fixed strategies - all disabled except cost_effective
  const strategies = strategiesData.strategies.map(strategy => ({
    id: strategy.id,
    name: strategy.description, // Using Turkish description
    icon: strategy.icon,
    active: strategy.id === 'costEffective', // Only costEffective is active
  }));

  const optimizationTypes = optimizationTypesData.optimizationTypes.map(type => ({
    id: type.id,
    name: type.description, // Using Turkish description
    active: type.id === 'clarity', // Only clarity is active
  }));

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.background,
        }}
      >
        {/* Logo Area */}
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
            transition: 'opacity 0.2s ease',
          }}
        >
          <Logo size={48} animate />
          <Typography
            variant="h6"
            sx={{
              color: colors.textPrimary,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Arkegu AI
          </Typography>
        </Box>

        {/* Settings */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleSettingsClick}
            sx={{
              color: colors.textSecondary,
              '&:hover': {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
              },
            }}
          >
            <TuneIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Settings Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            minWidth: 300,
            mt: 1,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 2, fontSize: '16px', fontWeight: 600 }}>
            Ayarlar
          </Typography>
          
          {/* Strategies */}
          <Typography variant="subtitle2" sx={{ color: colors.textSecondary, mb: 1, fontSize: '12px', textTransform: 'uppercase' }}>
            {t('chat.strategy')}
          </Typography>
          <MenuList dense sx={{ py: 0, mb: 2 }}>
            {strategies.map((strategy) => (
              <MenuItem
                key={strategy.id}
                disabled={!strategy.active}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  opacity: strategy.active ? 1 : 0.5,
                  backgroundColor: strategy.active ? colors.strategyBg : 'transparent',
                  '&:hover': {
                    backgroundColor: strategy.active ? colors.strategyBg : 'transparent',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Typography sx={{ fontSize: '16px' }}>{strategy.icon}</Typography>
                  <Typography variant="body2" sx={{ color: colors.textPrimary, flex: 1 }}>
                    {strategy.name}
                  </Typography>
                  {strategy.active && (
                    <Chip
                      label="Aktif"
                      size="small"
                      sx={{
                        background: colors.accent,
                        color: 'white',
                        fontSize: '10px',
                        height: 20,
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            ))}
          </MenuList>

          <Divider sx={{ borderColor: colors.border, my: 1 }} />

          {/* Optimization Types */}
          <Typography variant="subtitle2" sx={{ color: colors.textSecondary, mb: 1, fontSize: '12px', textTransform: 'uppercase' }}>
            {t('chat.optimizationType')}
          </Typography>
          <MenuList dense sx={{ py: 0 }}>
            {optimizationTypes.map((type) => (
              <MenuItem
                key={type.id}
                disabled={!type.active}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  opacity: type.active ? 1 : 0.5,
                  backgroundColor: type.active ? colors.strategyBg : 'transparent',
                  '&:hover': {
                    backgroundColor: type.active ? colors.strategyBg : 'transparent',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Typography variant="body2" sx={{ color: colors.textPrimary, flex: 1 }}>
                    {type.name}
                  </Typography>
                  {type.active && (
                    <Chip
                      label="Aktif"
                      size="small"
                      sx={{
                        background: colors.accent,
                        color: 'white',
                        fontSize: '10px',
                        height: 20,
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            ))}
          </MenuList>
        </Box>
      </Popover>
    </>
  );
};

// Main Chat Component
const Chat = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const {
    setPrompt,
    loading,
    history,
    createNewSession,
    setStrategy,
    setOptimizationType,
    optimize,
  } = useOptimizationStore();

  // Set fixed strategy and optimization type
  useEffect(() => {
    setStrategy('costEffective');
    setOptimizationType('clarity');
  }, [setStrategy, setOptimizationType]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Create initial session (no cache in normal chat)
  useEffect(() => {
    createNewSession();
  }, [createNewSession]);

  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim()) return;
    
    setIsTyping(true);
    
    try {
      setPrompt(content);
      await optimize(false); // Chat page doesn't require authentication
      setPrompt('');
    } catch (error) {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsTyping(false);
    }
  }, [setPrompt, optimize]);

  const handleCopyMessage = useCallback(() => {
    toast.success('Mesaj kopyalandı!', { duration: 2000 });
  }, []);

  const handleNewChat = useCallback(() => {
    createNewSession();
  }, [createNewSession]);

  // Transform history for message display
  const messages = history.map(item => ({
    id: item.id,
    isUser: item.isUser,
    content: item.content,
    timestamp: new Date(),
  }));

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Minimal Header */}
      <MinimalHeader />
      
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          paddingBottom: '120px', // Space for input
        }}
      >
        <Box sx={{ maxWidth: 768, margin: '0 auto' }}>
          {messages.length === 0 ? (
            // Empty State
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(102, 126, 234, 0.1))',
                      border: `2px solid rgba(102, 126, 234, 0.2)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 4,
                    }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: '3rem',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      💬
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: colors.textPrimary,
                    }}
                  >
                    {t('chat.emptyState.title')}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      color: colors.textSecondary,
                      maxWidth: 400,
                      mx: 'auto',
                    }}
                  >
                    {t('chat.emptyState.description')}
                  </Typography>
                  
                  {/* New Chat Button */}
                  <Button
                    onClick={handleNewChat}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      },
                    }}
                  >
                    {t('chat.buttons.newChat')}
                  </Button>
                </Box>
              </motion.div>
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageItem
                    message={message}
                    onCopy={handleCopyMessage}
                  />
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {(isTyping || loading) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: colors.accent,
                      fontSize: '14px',
                    }}
                  >
                    <AIIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[0, 0.2, 0.4].map((delay, index) => (
                      <motion.div
                        key={index}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: colors.textSecondary,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>
      </Box>
      
      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isTyping || loading}
        placeholder={messages.length > 0 ? t('chat.inputPlaceholder.continue') : t('chat.inputPlaceholder.initial')}
      />
    </Box>
  );
};

export default Chat;