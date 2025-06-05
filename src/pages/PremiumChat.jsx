import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  useMediaQuery,
  Fade,
  Popover,
  FormControl,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Send as SendIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  SmartToy as AIIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import useOptimizationStore from '../store/optimizationStore';
import { sessionApi } from '../services/api';
import toast from 'react-hot-toast';
import { MarkdownContent } from '../utils/markdownRenderer';
import { useTranslation } from '../hooks/useTranslation';
import optimizationTypesData from '../data/optimizationTypes.json';
import logPremiumChatError, { ERROR_TYPES } from '../utils/errorLogger';
import {
  getSessionsFromCache,
  saveSessionsToCache,
  addSessionToCache,
  updateSessionInCache,
  getSessionFromCache,
  saveSessionToCache,
  isCacheValid
} from '../utils/sessionCache';
import StorageMonitor from '../components/Common/StorageMonitor';

// Minimal Color Palette
const colors = {
  background: '#0d1117',
  sidebar: '#161b22', 
  textPrimary: '#f0f6fc',
  textSecondary: '#7d8590',
  accent: '#238636',
  border: '#21262d',
  userMessage: '#636969',
};

// Ultra Clean Message Component
const MessageItem = ({ message, onCopy }) => {
  const [showCopy, setShowCopy] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.();
  };

  if (isUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
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
            maxWidth: '100%',
            overflow: 'hidden',
            // Remove all custom code/pre styles to let the new markdown renderer handle them
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
              backgroundColor: colors.sidebar,
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

// Minimal Chat History Item
const ChatHistoryItem = ({ chat, isActive, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      padding: '8px 16px',
      cursor: 'pointer',
      borderRadius: '6px',
      borderLeft: isActive ? `2px solid ${colors.accent}` : '2px solid transparent',
      backgroundColor: isActive ? 'rgba(35, 134, 54, 0.1)' : 'transparent',
      '&:hover': {
        backgroundColor: colors.border,
      },
      transition: 'all 150ms ease',
    }}
  >
    <Typography
      sx={{
        color: isActive ? colors.textPrimary : colors.textSecondary,
        fontSize: '14px',
        fontWeight: isActive ? 500 : 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {chat.title}
    </Typography>
  </Box>
);

// Clean Sidebar Component
const MinimalSidebar = ({
  open,
  onClose,
  sessions,
  onNewChat,
  onSelectSession,
  currentSession,
  user,
  onLogout,
  isMobile
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const groupedSessions = {
    today: sessions.filter(s => isToday(s.timestamp)),
    yesterday: sessions.filter(s => isYesterday(s.timestamp)),
    previous: sessions.filter(s => !isToday(s.timestamp) && !isYesterday(s.timestamp)),
  };

  const filteredSessions = searchTerm
    ? sessions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : null;

  const sidebarContent = (
    <Box
      sx={{
        width: isMobile ? '100vw' : 260,
        height: '100vh',
        backgroundColor: colors.sidebar,
        borderRight: isMobile ? 'none' : `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: colors.textPrimary,
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            Arkegu AI
          </Typography>
          {isMobile && (
            <IconButton onClick={onClose} sx={{ color: colors.textSecondary }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <Box
          onClick={onNewChat}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '8px 12px',
            backgroundColor: colors.background,
            borderRadius: '6px',
            cursor: 'pointer',
            border: `1px solid ${colors.border}`,
            '&:hover': {
              backgroundColor: colors.border,
            },
            transition: 'all 150ms ease',
          }}
        >
          <AddIcon sx={{ fontSize: 16, color: colors.textSecondary }} />
          <Typography sx={{ color: colors.textSecondary, fontSize: '14px' }}>
            {t('sessions.newChat')}
          </Typography>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            position: 'relative',
            backgroundColor: colors.border,
            borderRadius: '6px',
            border: `1px solid ${colors.border}`,
          }}
        >
          <SearchIcon
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16,
              color: colors.textSecondary,
            }}
          />
          <TextField
            fullWidth
            placeholder={t('sessions.searchConversations')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                pl: 4,
                pr: 1,
                py: 0.5,
                fontSize: '14px',
                color: colors.textPrimary,
                '&::placeholder': {
                  color: colors.textSecondary,
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Chat History */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        {filteredSessions ? (
          <Box>
            {filteredSessions.map((session) => (
              <ChatHistoryItem
                key={session.id || `filtered-${Math.random()}`}
                chat={session}
                isActive={currentSession?.id === session.id}
                onClick={() => onSelectSession(session)}
              />
            ))}
          </Box>
        ) : (
          <>
            {Object.entries(groupedSessions).map(([period, sessionList]) =>
              sessionList.length > 0 ? (
                <Box key={period} sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: colors.textSecondary,
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      px: 2,
                      py: 1,
                    }}
                  >
                    {period === 'today' ? t('sessions.today') :
                     period === 'yesterday' ? t('sessions.yesterday') : t('sessions.previous7Days')}
                  </Typography>
                  {sessionList.map((session) => (
                    <ChatHistoryItem
                      key={session.id || `session-${period}-${Math.random()}`}
                      chat={session}
                      isActive={currentSession?.id === session.id}
                      onClick={() => onSelectSession(session)}
                    />
                  ))}
                </Box>
              ) : null
            )}
          </>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '12px' }}>
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography
            sx={{
              color: colors.textSecondary,
              fontSize: '14px',
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.username || 'User'}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onLogout}
          sx={{
            color: colors.textSecondary,
            '&:hover': {
              color: colors.textPrimary,
              backgroundColor: colors.border,
            },
          }}
        >
          <LogoutIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: open ? 'block' : 'none',
        }}
        onClick={onClose}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: '80%',
            maxWidth: 300,
            height: '100%',
            transform: `translateX(${open ? '0' : '-100%'})`,
            transition: 'transform 300ms ease',
          }}
        >
          {sidebarContent}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        transform: `translateX(${open ? '0' : '-260px'})`,
        transition: 'transform 300ms ease',
        zIndex: 1200,
      }}
    >
      {sidebarContent}
    </Box>
  );
};

// Clean Input Area
const MinimalInput = ({ onSend, disabled, placeholder }) => {
  const { t } = useTranslation();
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
          backgroundColor: colors.sidebar,
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
          placeholder={placeholder || t('premiumChat.messagePlaceholder')}
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
              backgroundColor: message.trim() ? colors.accent : colors.border,
            },
            '&:disabled': {
              color: colors.textSecondary,
              backgroundColor: 'transparent',
            },
            transition: 'all 150ms ease',
          }}
        >
          <SendIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

// Settings Popup Component
const SettingsPopup = ({
  anchorEl,
  open,
  onClose,
  strategies = [],
  optimizationTypes = [],
  models = [],
  currentSettings,
  onSettingChange,
  enableMemory,
  contextWindowSize
}) => {
  const { t } = useTranslation();
  
  // Add safety checks - use only fallback for now to ensure they work
  const safeStrategies = [
    { id: 'quality', name: 'Kalite', description: 'En yüksek kalite', icon: '🏆', features: ['En kaliteli yanıtlar', 'GPT-4o model', 'Temperature: 0.7'] },
    { id: 'speed', name: 'Hız', description: 'En hızlı yanıt', icon: '⚡', features: ['Hızlı işlem', 'GPT-4o Mini model', 'Temperature: 0.5'] },
    { id: 'cost_effective', name: 'Maliyet Odaklı', description: 'Maliyet odaklı', icon: '💰', features: ['Bütçe dostu', 'Gemini Lite model', 'Temperature: 0.7'] },
    { id: 'reasoning', name: 'Muhakeme', description: 'Muhakeme odaklı', icon: '🧠', features: ['Detaylı analiz', 'DeepSeek R1 model', 'Temperature: 0.3'] },
    { id: 'creative', name: 'Yaratıcı', description: 'Yaratıcı çözümler', icon: '🎨', features: ['Yaratıcı yanıtlar', 'Grok-2 model', 'Temperature: 0.8'] }
  ];
  
  const safeOptimizationTypes = Array.isArray(optimizationTypes) && optimizationTypes.length > 0 ? optimizationTypes : [];
  
  const safeModels = [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most advanced model with multimodal capabilities' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient model for most tasks' },
    { id: 'gemini-lite', name: 'Gemini Lite', description: 'Cost-effective model for everyday tasks' },
    { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Advanced reasoning capabilities' },
    { id: 'grok-2', name: 'Grok-2', description: 'Creative model with humor and personality' }
  ];
  
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      sx={{
        '& .MuiPopover-paper': {
          backgroundColor: colors.sidebar,
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
          width: 400,
          maxHeight: '80vh',
          overflow: 'auto',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 2, fontSize: '16px', fontWeight: 600 }}>
          {t('chatSettings.title')}
        </Typography>
        
        {/* Mode Selection */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: colors.textSecondary, fontSize: '14px', mb: 1 }}>
            {t('chatSettings.chatMode')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Box
              onClick={() => onSettingChange('useStrategy', true)}
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 1,
                border: `1px solid ${colors.border}`,
                backgroundColor: currentSettings.useStrategy ? colors.accent : 'transparent',
                color: currentSettings.useStrategy ? 'white' : colors.textPrimary,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: currentSettings.useStrategy ? colors.accent : colors.background,
                },
                transition: 'all 0.2s ease',
              }}
            >
              {t('chatSettings.strategyMode')}
            </Box>
            <Box
              onClick={() => onSettingChange('useStrategy', false)}
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 1,
                border: `1px solid ${colors.border}`,
                backgroundColor: !currentSettings.useStrategy ? colors.accent : 'transparent',
                color: !currentSettings.useStrategy ? 'white' : colors.textPrimary,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: !currentSettings.useStrategy ? colors.accent : colors.background,
                },
                transition: 'all 0.2s ease',
              }}
            >
              {t('chatSettings.directModel')}
            </Box>
          </Box>
          <Typography sx={{ color: colors.textSecondary, fontSize: '11px' }}>
            {currentSettings.useStrategy
              ? t('chatSettings.strategyModeDescription')
              : t('chatSettings.directModelDescription')
            }
          </Typography>
        </Box>

        {/* Strategy Selection - Only when useStrategy is true */}
        {currentSettings.useStrategy && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: colors.textSecondary, fontSize: '14px', mb: 1 }}>
              {t('chatSettings.optimizationStrategy')}
            </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={currentSettings.strategy || ''}
              onChange={(e) => onSettingChange('strategy', e.target.value)}
              sx={{
                backgroundColor: colors.background,
                color: colors.textPrimary,
                fontSize: '14px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.border,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.accent,
                },
                '& .MuiSvgIcon-root': {
                  color: colors.textSecondary,
                },
              }}
            >
              {safeStrategies.map((strategy) => (
                <MenuItem key={strategy.id} value={strategy.id} sx={{ fontSize: '14px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{strategy.icon}</span>
                    <span>{strategy.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        )}

        {/* Direct Model Selection - Only when useStrategy is false */}
        {!currentSettings.useStrategy && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: colors.textSecondary, fontSize: '14px', mb: 1 }}>
              {t('chatSettings.modelSelection')}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={currentSettings.selectedModel || ''}
                onChange={(e) => onSettingChange('selectedModel', e.target.value)}
                sx={{
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                  fontSize: '14px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.accent,
                  },
                  '& .MuiSvgIcon-root': {
                    color: colors.textSecondary,
                  },
                }}
              >
                {safeModels.map((model) => (
                  <MenuItem key={model.id} value={model.id} sx={{ fontSize: '14px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span>{model.name}</span>
                      <Typography sx={{ fontSize: '11px', color: colors.textSecondary }}>
                        {model.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Temperature Control */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ color: colors.textSecondary, fontSize: '12px' }}>
                  {t('chatSettings.temperature')}
                </Typography>
                <Typography sx={{ color: colors.accent, fontSize: '12px', fontWeight: 600 }}>
                  {currentSettings.temperature}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', mx: 1 }}>
                <Box
                  sx={{
                    height: 4,
                    backgroundColor: colors.border,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      height: 4,
                      backgroundColor: colors.accent,
                      borderRadius: 2,
                      width: `${(currentSettings.temperature / 2) * 100}%`,
                    }}
                  />
                </Box>
                <Box
                  component="input"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={currentSettings.temperature}
                  onChange={(e) => onSettingChange('temperature', parseFloat(e.target.value))}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 4,
                    opacity: 0,
                    cursor: 'pointer',
                    '&::-webkit-slider-thumb': {
                      appearance: 'none',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      cursor: 'pointer',
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Optimization Type */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: colors.textSecondary, fontSize: '14px', mb: 1 }}>
            {t('chatSettings.optimizationType')}
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={currentSettings.optimizationType || ''}
              onChange={(e) => onSettingChange('optimizationType', e.target.value)}
              sx={{
                backgroundColor: colors.background,
                color: colors.textPrimary,
                fontSize: '14px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.border,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.accent,
                },
                '& .MuiSvgIcon-root': {
                  color: colors.textSecondary,
                },
              }}
            >
              {safeOptimizationTypes.map((type) => (
                <MenuItem key={type.id} value={type.id} sx={{ fontSize: '14px' }}>
                  {t(`optimizationTypes.${type.id}.name`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Memory Settings */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: colors.textSecondary, fontSize: '14px', mb: 1 }}>
            {t('chatSettings.memorySettings')}
          </Typography>
          
          {/* Enable Memory Checkbox */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              onClick={() => onSettingChange('enableMemory', !enableMemory)}
              sx={{
                width: 20,
                height: 20,
                border: `2px solid ${colors.border}`,
                borderRadius: '4px',
                backgroundColor: enableMemory ? colors.accent : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
                '&:hover': {
                  borderColor: colors.accent,
                },
                transition: 'all 0.2s ease',
              }}
            >
              {enableMemory && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: 'white',
                    borderRadius: '2px',
                  }}
                />
              )}
            </Box>
            <Typography sx={{ color: colors.textPrimary, fontSize: '14px' }}>
              {t('chatSettings.enableMemory')}
            </Typography>
          </Box>
          
          {/* Context Window Size Slider */}
          {enableMemory && (
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ color: colors.textSecondary, fontSize: '12px' }}>
                  {t('chatSettings.contextWindowSize')}
                </Typography>
                <Typography sx={{ color: colors.accent, fontSize: '12px', fontWeight: 600 }}>
                  {contextWindowSize} {t('chatSettings.messagesCount')}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', mx: 1 }}>
                <Box
                  sx={{
                    height: 4,
                    backgroundColor: colors.border,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      height: 4,
                      backgroundColor: colors.accent,
                      borderRadius: 2,
                      width: `${(contextWindowSize / 20) * 100}%`,
                    }}
                  />
                </Box>
                <Box
                  component="input"
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={contextWindowSize}
                  onChange={(e) => onSettingChange('contextWindowSize', parseInt(e.target.value))}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 4,
                    opacity: 0,
                    cursor: 'pointer',
                    '&::-webkit-slider-thumb': {
                      appearance: 'none',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      cursor: 'pointer',
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Current Strategy Info */}
        <Box sx={{
          backgroundColor: colors.background,
          borderRadius: 1,
          p: 1.5,
          border: `1px solid ${colors.border}`
        }}>
          <Typography sx={{ color: colors.textSecondary, fontSize: '12px', mb: 0.5 }}>
            {t('chatSettings.currentStrategyFeatures')}:
          </Typography>
          {safeStrategies.find(s => s.id === currentSettings.strategy)?.features?.map((feature, index) => (
            <Typography key={index} sx={{ color: colors.textPrimary, fontSize: '11px', ml: 1 }}>
              • {feature}
            </Typography>
          ))}
        </Box>
      </Box>
    </Popover>
  );
};

// Logout Confirmation Dialog
const LogoutConfirmDialog = ({ open, onClose, onConfirm, user }) => {
  const { t } = useTranslation();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.sidebar,
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ color: colors.textPrimary, fontSize: '18px', fontWeight: 600 }}>
        {t('premiumChat.logoutTitle')}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: colors.textSecondary, fontSize: '14px' }}>
          {user?.username} {t('premiumChat.logoutConfirmation')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: colors.textSecondary,
            borderColor: colors.border,
            '&:hover': {
              backgroundColor: colors.background,
              borderColor: colors.textSecondary,
            }
          }}
          variant="outlined"
        >
          {t('premiumChat.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            backgroundColor: '#dc2626',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b91c1c',
            }
          }}
          variant="contained"
        >
          {t('premiumChat.logout')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Premium Chat Component
const PremiumChat = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { t } = useTranslation();
  
  // Store integration
  const {
    currentSessionId,
    history,
    // loading, // Not used currently
    strategy,
    optimizationType,
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    useStrategy,
    setUseStrategy,
    optimizationTypes,
    enableMemory,
    contextWindowSize,
    setStrategy,
    setOptimizationType,
    setEnableMemory,
    setContextWindowSize,
    // setCurrentSessionId, // Not used currently
    optimize,
    loadInitialData,
    createNewSession,
    loadSession,
  } = useOptimizationStore();
  
  // Local UI state
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [, setLoadingSessions] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Settings popup state
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const settingsOpen = Boolean(settingsAnchor);
  
  // Logout confirmation state
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Load session messages from cache or backend
  const loadSessionMessages = useCallback(async (sessionId) => {
    try {
      if (!sessionId) return;
      
      // First check cache for session messages
      const cachedSessionData = getSessionFromCache(sessionId);
      if (cachedSessionData && cachedSessionData.messages) {
        // Transform cached messages to store format
        const transformedHistory = cachedSessionData.messages.map(msg => ({
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
          content: msg.content,
          isUser: msg.role === 'user' || msg.isUser,
          timestamp: msg.timestamp || new Date()
        }));
        
        // Load into store
        useOptimizationStore.getState().setHistory(transformedHistory);
        return;
      }
      
      await loadSession(sessionId);
      
      // After loading from backend, cache the session data
      const currentHistory = useOptimizationStore.getState().history;
      const sessionData = {
        id: sessionId,
        title: currentSession?.title || 'Chat Session',
        messages: currentHistory.map(item => ({
          id: item.id,
          content: item.content,
          role: item.isUser ? 'user' : 'assistant',
          timestamp: item.timestamp || new Date()
        })),
        timestamp: new Date(),
        messageCount: currentHistory.length
      };
      
      // Save to session cache
      saveSessionToCache(sessionId, sessionData);
      
    } catch (error) {
      console.error('Failed to load session messages:', error);
      logPremiumChatError(ERROR_TYPES.SESSION_LOAD, error, {
        sessionId,
        context: 'loadSessionMessages',
        cacheChecked: true
      });
    }
  }, [loadSession, currentSession]);

  // Load user sessions with enhanced cache support
  const loadUserSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      console.group('🔍 [PREMIUM_CHAT_DEBUG] Starting loadUserSessions...');
      console.log('🔗 User:', user?.username);
      console.log('🔐 Token exists:', !!localStorage.getItem('jwt_token'));
      
      // First check cache
      const cachedSessions = getSessionsFromCache();
      console.log('📦 [CACHE_DEBUG] Cache check result:', {
        hasCachedSessions: !!cachedSessions,
        sessionCount: cachedSessions?.length || 0,
        isCacheValid: isCacheValid(),
        cacheKeys: cachedSessions ? Object.keys(cachedSessions[0] || {}) : 'no cache'
      });
      
      if (cachedSessions && isCacheValid()) {
        console.log('✅ [DEBUG] Using cached sessions');
        setSessions(cachedSessions);
        
        // Auto-create new session if no sessions exist
        if (cachedSessions.length === 0) {
          const newSessionId = createNewSession();
          const sessionId = newSessionId || `session-${Date.now()}`;
          
          const newSession = {
            id: sessionId,
            title: t('sessions.newChat'),
            timestamp: new Date(),
            messageCount: 0,
          };
          
          const updatedSessions = addSessionToCache(newSession);
          if (updatedSessions) {
            setSessions(updatedSessions);
          } else {
            setSessions([newSession]);
          }
          
          setCurrentSession(newSession);
          return;
        }
        
        // Set current session based on URL sessionId or first session
        if (!currentSession) {
          let targetSession = null;
          
          if (sessionId) {
            // Find session by URL sessionId
            targetSession = cachedSessions.find(s => s.id === sessionId);
            if (!targetSession) {
              console.warn('Session not found in cache:', sessionId);
              // Redirect to first session or new chat
              const firstSession = cachedSessions[0];
              if (firstSession) {
                navigate(`/premium/chat/${firstSession.id}`, { replace: true });
                return;
              } else {
                navigate('/premium/chat', { replace: true });
                return;
              }
            }
          } else {
            // Use first session if no sessionId in URL
            targetSession = cachedSessions[0];
            if (targetSession) {
              // Update URL to include first session
              navigate(`/premium/chat/${targetSession.id}`, { replace: true });
            }
          }
          
          if (targetSession && targetSession.id) {
            setCurrentSession(targetSession);
            // Load session messages from cache or backend
            await loadSessionMessages(targetSession.id);
          }
        }
        return;
      }
      
      // Cache is invalid or doesn't exist, fetch from backend
      console.log('🌐 [API_DEBUG] Cache invalid/empty, fetching from backend...');
      console.log('🔗 API endpoint will be: /api/sessions?limit=20');
      console.log('🔑 Auth token exists:', !!localStorage.getItem('jwt_token'));
      console.log('🏠 Current URL:', window.location.href);
      
      const userSessions = await sessionApi.getSessions(20); // Get last 20 sessions
      console.log('📡 [API_RESPONSE_DEBUG] Raw API response:', userSessions);
      console.log('📊 Response analysis:', {
        type: typeof userSessions,
        isArray: Array.isArray(userSessions),
        hasData: !!userSessions,
        keys: userSessions ? Object.keys(userSessions) : 'no data',
        length: Array.isArray(userSessions) ? userSessions.length : 'not array'
      });
      
      // Handle different response formats from backend
      let sessionsArray = [];
      
      if (Array.isArray(userSessions)) {
        console.log('✅ [DEBUG] Response is array, using directly');
        sessionsArray = userSessions;
      } else if (userSessions && typeof userSessions === 'object') {
        console.log('🔧 [DEBUG] Response is object, checking for nested arrays...');
        
        // Check common response wrapper patterns
        if (Array.isArray(userSessions.sessions)) {
          console.log('✅ [DEBUG] Found sessions array in .sessions property');
          sessionsArray = userSessions.sessions;
        } else if (Array.isArray(userSessions.data)) {
          console.log('✅ [DEBUG] Found sessions array in .data property');
          sessionsArray = userSessions.data;
        } else if (Array.isArray(userSessions.items)) {
          console.log('✅ [DEBUG] Found sessions array in .items property');
          sessionsArray = userSessions.items;
        } else {
          console.log('❌ [DEBUG] No valid array found in response object:', Object.keys(userSessions));
          sessionsArray = [];
        }
      } else {
        console.log('❌ [DEBUG] Invalid response format:', userSessions);
        sessionsArray = [];
      }
      
      console.log('📊 [DEBUG] Final sessions array:', { count: sessionsArray.length, firstItem: sessionsArray[0] });
      
      // Transform API sessions to component format
      console.log('🔄 [DEBUG] Transforming sessions. Raw data structure check:');
      sessionsArray?.forEach((session, i) => {
        console.log(`   Session ${i}:`, {
          id: session.id,
          sessionId: session.sessionId,
          title: session.title,
          createdAt: session.createdAt,
          timestamp: session.timestamp,
          messageCount: session.messageCount,
          hasMessages: !!session.messages,
          messagesLength: session.messages?.length
        });
      });
      
      const transformedSessions = (sessionsArray || []).map((session, index) => ({
        id: session.id || session.sessionId || `fallback-session-${Date.now()}-${index}`,
        title: session.title || session.messages?.[0]?.content?.substring(0, 50) + '...' || t('sessions.newChat'),
        timestamp: new Date(session.createdAt || session.timestamp || Date.now()),
        messageCount: session.messageCount || 0,
      })).filter(session => session.id && session.id !== 'undefined' && session.id !== 'null');
      
      console.log('✨ [DEBUG] Transformed sessions:', transformedSessions);
      
      // Save sessions list to cache
      saveSessionsToCache(transformedSessions);
      setSessions(transformedSessions);
      
      // Auto-create new session if no sessions exist
      if (transformedSessions.length === 0) {
        console.log('No backend sessions, creating new session');
        const newSessionId = createNewSession();
        const sessionId = newSessionId || `session-${Date.now()}`;
        
        const newSession = {
          id: sessionId,
          title: t('sessions.newChat'),
          timestamp: new Date(),
          messageCount: 0,
        };
        
        const updatedSessions = addSessionToCache(newSession);
        setSessions(updatedSessions || [newSession]);
        setCurrentSession(newSession);
        return;
      }
      
      // Set current session if not set
      if (!currentSession) {
        const firstSession = transformedSessions[0];
        if (firstSession && firstSession.id) {
          setCurrentSession(firstSession);
          // Load session messages
          await loadSessionMessages(firstSession.id);
        }
      }
    } catch (error) {
      console.error('❌ [DEBUG] Failed to load user sessions:', error);
      console.error('❌ [DEBUG] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      logPremiumChatError(ERROR_TYPES.SESSION_LOAD, error, {
        context: 'loadUserSessions',
        backendFailed: true,
        cacheFallback: true
      });
      
      // Try to use cache even if backend fails
      const cachedSessions = getSessionsFromCache();
      if (cachedSessions && cachedSessions.length > 0) {
        console.log('Backend failed, using cached sessions');
        setSessions(cachedSessions);
        if (!currentSession) {
          setCurrentSession(cachedSessions[0]);
        }
        return;
      }
      
      // Create new session if everything fails
      console.log('All failed, creating new session');
      const newSessionId = createNewSession();
      const sessionId = newSessionId || `session-${Date.now()}`;
      
      const newSession = {
        id: sessionId,
        title: t('sessions.newChat'),
        timestamp: new Date(),
        messageCount: 0,
      };
      
      const updatedSessions = addSessionToCache(newSession);
      setSessions(updatedSessions || [newSession]);
      setCurrentSession(newSession);
    } finally {
      setLoadingSessions(false);
      console.groupEnd();
    }
  }, [currentSession, loadSessionMessages, createNewSession, navigate, sessionId, t]);

  // Load initial data and sessions
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
      loadUserSessions();
      
      // Create new session if none exists
      if (!currentSessionId) {
        createNewSession();
      }
    }
  }, [isAuthenticated, loadInitialData, currentSessionId, createNewSession, loadUserSessions]);

  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || !currentSession) return;
    
    console.group('📤 [MESSAGE_DEBUG] Starting handleSendMessage...');
    console.log('💬 Message content:', content.substring(0, 100) + '...');
    console.log('🎯 Current session:', currentSession?.id);
    console.log('⚙️ Settings:', { useStrategy, strategy, selectedModel, temperature });
    
    setIsTyping(true);
    
    try {
      // Set prompt and optimize using store
      console.log('📝 Setting prompt in store...');
      useOptimizationStore.getState().setPrompt(content);
      
      console.log('🚀 Calling optimize function...');
      await optimize();
      
      // Get updated history from store after optimization
      const updatedHistory = useOptimizationStore.getState().history;
      console.log('📊 Updated history after optimize:', {
        length: updatedHistory.length,
        lastMessage: updatedHistory[updatedHistory.length - 1]?.content?.substring(0, 50) + '...'
      });
      
      // Transform history to cache format
      const messagesForCache = updatedHistory.map(item => ({
        id: item.id || `msg-${Date.now()}-${Math.random()}`,
        content: item.content,
        role: item.isUser ? 'user' : 'assistant',
        timestamp: item.timestamp || new Date()
      }));
      
      // Update session title if it's a new session (first or second message)
      let sessionTitle = currentSession.title;
      if (updatedHistory.length <= 2) {
        sessionTitle = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        setCurrentSession(prev => ({ ...prev, title: sessionTitle }));
      }
      
      // Save complete session data to cache
      const sessionData = {
        id: currentSession.id,
        title: sessionTitle,
        messages: messagesForCache,
        timestamp: new Date(),
        messageCount: updatedHistory.length
      };
      
      saveSessionToCache(currentSession.id, sessionData);
      
      // Update sessions list cache
      const updatedSessions = updateSessionInCache(currentSession.id, {
        title: sessionTitle,
        messageCount: updatedHistory.length,
        timestamp: new Date()
      });
      
      if (updatedSessions) {
        setSessions(updatedSessions);
      }
      
    } catch (error) {
      console.error('❌ [MESSAGE_ERROR] Failed to send message:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      logPremiumChatError(ERROR_TYPES.MESSAGE_SEND, error, {
        sessionId: currentSession?.id,
        messageLength: content.length,
        useStrategy,
        strategy,
        selectedModel,
        temperature
      });
      toast.error(t('premiumChat.messageSentError'));
    } finally {
      setIsTyping(false);
      console.groupEnd();
    }
  }, [currentSession, optimize, t, useStrategy, strategy, selectedModel, temperature]);

  const handleCopyMessage = useCallback(() => {
    toast.success(t('premiumChat.messageCopied'), { duration: 2000 });
  }, [t]);

  const handleNewChat = useCallback(() => {
    const newSessionId = createNewSession();
    // Ensure we have a valid session ID
    const sessionId = newSessionId || `session-${Date.now()}`;
    
    const newSession = {
      id: sessionId,
      title: t('sessions.newChat'),
      timestamp: new Date(),
      messageCount: 0,
    };
    
    // Add to cache and update sessions list
    const updatedSessions = addSessionToCache(newSession);
    if (updatedSessions) {
      setSessions(updatedSessions);
    } else {
      setSessions(prev => [newSession, ...prev]);
    }
    
    setCurrentSession(newSession);
    setSidebarOpen(false);
    
    // Navigate to new session URL
    navigate(`/premium/chat/${sessionId}`);
  }, [createNewSession, navigate, t]);

  const handleSelectSession = useCallback(async (session) => {
    // Validate session object
    if (!session || !session.id || session.id === 'undefined' || session.id === 'null') {
      console.warn('Invalid session selected:', session);
      return;
    }
    
    
    // Update URL to reflect selected session
    navigate(`/premium/chat/${session.id}`);
    
    setCurrentSession(session);
    setSidebarOpen(false);
    
    // Skip if already current session
    if (session.id === currentSessionId) {
      console.log('✅ Session already active:', session.id);
      return;
    }
    
    // 🚀 INSTANT CACHE-FIRST LOADING (ChatGPT Style)
    try {
      console.log('🔍 Checking localStorage cache for session:', session.id);
      const cachedSessionData = getSessionFromCache(session.id);
      
      if (cachedSessionData && cachedSessionData.messages && cachedSessionData.messages.length > 0) {
        console.log('⚡ INSTANT LOAD from cache - Found', cachedSessionData.messages.length, 'messages');
        
        // Transform cached messages to store format INSTANTLY
        const transformedHistory = cachedSessionData.messages.map((msg, index) => ({
          id: msg.id || `cached-${Date.now()}-${index}`,
          content: msg.content,
          isUser: msg.role === 'user' || msg.isUser,
          result: msg.role === 'assistant' && !msg.isUser ? {
            finalResponse: msg.content,
            model: msg.model || 'cached',
            strategy: 'quality',
            processingTimeMs: 0
          } : undefined,
          timestamp: msg.timestamp || new Date()
        }));
        
        // Update store state INSTANTLY - no API delay
        useOptimizationStore.setState({
          currentSessionId: session.id,
          history: transformedHistory
        });
        
        return; // Done! No API call needed
      }
      
      
      // Fallback to API only if cache is empty
      await loadSession(session.id);
      console.log('✅ Session loaded from API');
      
    } catch (error) {
      console.error('❌ Failed to load session:', error);
      logPremiumChatError(ERROR_TYPES.SESSION_LOAD, error, {
        sessionId: session.id,
        context: 'handleSelectSession',
        cacheAvailable: Boolean(getSessionFromCache(session.id))
      });
      toast.error(t('premiumChat.sessionLoadError'));
      
      // Even on error, set empty state for the session
      useOptimizationStore.setState({
        currentSessionId: session.id,
        history: []
      });
    }
  }, [currentSessionId, loadSession, navigate, t]);

  const handleLogout = useCallback(() => {
    setLogoutDialogOpen(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    setLogoutDialogOpen(false);
    await logout();
    navigate('/');
  }, [logout, navigate]);

  // Settings handlers
  const handleSettingsClick = useCallback((event) => {
    setSettingsAnchor(event.currentTarget);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsAnchor(null);
  }, []);

  const handleSettingChange = useCallback((setting, value) => {
    switch (setting) {
      case 'useStrategy':
        setUseStrategy(value);
        break;
      case 'selectedModel':
        setSelectedModel(value);
        break;
      case 'temperature':
        setTemperature(value);
        break;
      case 'strategy':
        setStrategy(value);
        break;
      case 'optimizationType':
        setOptimizationType(value);
        break;
      case 'enableMemory':
        setEnableMemory(value);
        break;
      case 'contextWindowSize':
        setContextWindowSize(value);
        break;
      default:
        break;
    }
  }, [setUseStrategy, setSelectedModel, setTemperature, setStrategy, setOptimizationType, setEnableMemory, setContextWindowSize]);


  // Transform strategies to ensure it's an array - use consistent fallback
  const safeStrategies = React.useMemo(() => {
    return [
      { id: 'quality', name: 'Kalite', description: 'En yüksek kalite', icon: '🏆', features: ['En kaliteli yanıtlar', 'GPT-4o model', 'Temperature: 0.7'] },
      { id: 'speed', name: 'Hız', description: 'En hızlı yanıt', icon: '⚡', features: ['Hızlı işlem', 'GPT-4o Mini model', 'Temperature: 0.5'] },
      { id: 'cost_effective', name: 'Maliyet Odaklı', description: 'Maliyet odaklı', icon: '💰', features: ['Bütçe dostu', 'Gemini Lite model', 'Temperature: 0.7'] },
      { id: 'reasoning', name: 'Muhakeme', description: 'Muhakeme odaklı', icon: '🧠', features: ['Detaylı analiz', 'DeepSeek R1 model', 'Temperature: 0.3'] },
      { id: 'creative', name: 'Yaratıcı', description: 'Yaratıcı çözümler', icon: '🎨', features: ['Yaratıcı yanıtlar', 'Grok-2 model', 'Temperature: 0.8'] }
    ];
  }, []);

  // Transform optimizationTypes to ensure it's an array
  const safeOptimizationTypes = React.useMemo(() => {
    if (Array.isArray(optimizationTypes) && optimizationTypes.length > 0) {
      return optimizationTypes;
    }
    // Fallback to data from JSON file
    return optimizationTypesData.optimizationTypes.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description
    }));
  }, [optimizationTypes]);


  // Transform history for message display
  const messages = history.map(item => ({
    id: item.id,
    role: item.isUser ? 'user' : 'assistant',
    content: item.content,
    timestamp: new Date(),
  }));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <MinimalSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        currentSession={currentSession}
        user={user}
        onLogout={handleLogout}
        isMobile={isMobile}
      />
      
      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: sidebarOpen && !isMobile ? '260px' : 0,
          transition: 'margin-left 300ms ease',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.background,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {(!sidebarOpen || isMobile) && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  color: colors.textSecondary,
                  '&:hover': {
                    color: colors.textPrimary,
                    backgroundColor: colors.sidebar,
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              sx={{
                color: colors.textPrimary,
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {currentSession?.title || 'Arkegu AI'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageMonitor />
            <IconButton
              onClick={handleSettingsClick}
              size="small"
              sx={{
                color: colors.textSecondary,
                '&:hover': {
                  color: colors.textPrimary,
                  backgroundColor: colors.sidebar,
                },
              }}
            >
              <TuneIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  color: colors.textSecondary,
                  fontSize: '12px',
                  backgroundColor: colors.sidebar,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                }}
              >
                {useStrategy ? `Strategy: ${strategy}` : `${selectedModel} [T:${temperature}]`}
              </Typography>
              <Typography
                sx={{
                  color: colors.textSecondary,
                  fontSize: '12px',
                  backgroundColor: colors.sidebar,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                }}
              >
                {enableMemory ? t('memory.memoryOn') : t('memory.memoryOff')}
              </Typography>
            </Box>
          </Box>
        </Box>
        
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
            {isTyping && (
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
          </Box>
        </Box>
      </Box>
      
      {/* Input Area */}
      <MinimalInput
        onSend={handleSendMessage}
        disabled={isTyping}
        placeholder={t('chat.inputPlaceholder.continue')}
      />
      
      {/* Settings Popup */}
      <SettingsPopup
        anchorEl={settingsAnchor}
        open={settingsOpen}
        onClose={handleSettingsClose}
        strategies={safeStrategies}
        optimizationTypes={safeOptimizationTypes}
        models={[
          { id: 'gpt-4o', name: 'GPT-4o', description: 'Most advanced model with multimodal capabilities' },
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient model for most tasks' },
          { id: 'gemini-lite', name: 'Gemini Lite', description: 'Cost-effective model for everyday tasks' },
          { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Advanced reasoning capabilities' },
          { id: 'grok-2', name: 'Grok-2', description: 'Creative model with humor and personality' }
        ]}
        currentSettings={{
          useStrategy,
          selectedModel,
          temperature,
          strategy,
          optimizationType,
        }}
        onSettingChange={handleSettingChange}
        enableMemory={enableMemory}
        contextWindowSize={contextWindowSize}
      />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={confirmLogout}
        user={user}
      />
    </Box>
  );
};

// Helper functions
const isToday = (date) => {
  if (!date) return false;
  const dateObj = date instanceof Date ? date : new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

const isYesterday = (date) => {
  if (!date) return false;
  const dateObj = date instanceof Date ? date : new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateObj.toDateString() === yesterday.toDateString();
};

export default PremiumChat;