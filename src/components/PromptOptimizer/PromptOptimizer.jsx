import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  useTheme,
  Collapse,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Slider,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Memory as MemoryIcon,
  CloudOff as CloudOffIcon,
  AccountCircle as SessionIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useOptimizationStore from '../../store/optimizationStore';
import { STRATEGY_CONFIGS, OPTIMIZATION_TYPE_CONFIGS } from '../../utils/constants';
import PromptInput from './PromptInput';
import StrategySelector from './StrategySelector';
import OptimizationTypeSelector from './OptimizationTypeSelector';
import ChatMessage from './ChatMessage';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';

// Memoize heavy components
const MemoizedStrategySelector = memo(StrategySelector);
const MemoizedOptimizationTypeSelector = memo(OptimizationTypeSelector);
const MemoizedChatMessage = memo(ChatMessage);

const PromptOptimizer = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const messagesEndRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const {
    prompt,
    setPrompt,
    strategy,
    setStrategy,
    optimizationType,
    setOptimizationType,
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    useStrategy,
    setUseStrategy,
    models,
    loading,
    optimize,
    error,
    currentSessionId,
    history,
    createNewSession,
    enableMemory,
    setEnableMemory,
    contextWindowSize,
    setContextWindowSize,
    loadInitialData,
  } = useOptimizationStore();
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  // Update local messages when history changes
  useEffect(() => {
    // History is already formatted in the store, just use it directly
    setMessages(history);
  }, [history]);
  
  const handleSubmit = useCallback(async (promptValue) => {
    // Use the passed promptValue or fallback to store prompt
    const textToSubmit = promptValue || prompt;
    
    if (!textToSubmit.trim()) return;
    
    // Update store with the latest value
    if (promptValue && promptValue !== prompt) {
      setPrompt(promptValue);
    }
    
    // Small delay to ensure store is updated before optimize
    setTimeout(async () => {
      await optimize();
      setPrompt('');
      setShowSettings(false);
    }, 0);
  }, [prompt, optimize, setPrompt]);
  
  const handleClear = useCallback(() => {
    setPrompt('');
  }, [setPrompt]);
  
  const handlePromptChange = useCallback((newValue) => {
    setPrompt(newValue);
  }, [setPrompt]);
  
  const handleNewChat = useCallback(() => {
    createNewSession();
    setPrompt('');
    setShowSettings(true);
  }, [createNewSession, setPrompt]);
  
  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);
  
  // Memoize strategy text
  const strategyText = useMemo(() => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography variant="subtitle2">
        Mode: <strong>{useStrategy ? 'Strategy' : 'Direct Model'}</strong> •
        {useStrategy ? (
          <>Strategy: <strong>{t(`strategies.${strategy}.name`) || STRATEGY_CONFIGS[strategy]?.name}</strong></>
        ) : (
          <>Model: <strong>{selectedModel}</strong> • Temp: <strong>{temperature}</strong></>
        )}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isAuthenticated && currentSessionId && (
          <Chip
            icon={enableMemory ? <MemoryIcon /> : <CloudOffIcon />}
            label={enableMemory ? t('memory.memoryOn') : t('memory.memoryOff')}
            size="small"
            color={enableMemory ? 'primary' : 'default'}
            variant="outlined"
          />
        )}
        {currentSessionId && (
          <Chip
            icon={<SessionIcon />}
            label={`Session: ${currentSessionId.slice(0, 8)}...`}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  ), [strategy, selectedModel, temperature, useStrategy, t, isAuthenticated, currentSessionId, enableMemory]);
  
  // Memoize empty state
  const emptyState = useMemo(() => (
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
          {/* Modern Icon Container */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(110, 97, 204, 0.15), rgba(99, 102, 241, 0.1))'
                : 'linear-gradient(135deg, rgba(110, 97, 204, 0.08), rgba(99, 102, 241, 0.05))',
              border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(110, 97, 204, 0.2)' : 'rgba(110, 97, 204, 0.15)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              
              // Animated background
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `conic-gradient(from 0deg, transparent, ${theme.palette.mode === 'dark' ? 'rgba(110, 97, 204, 0.1)' : 'rgba(110, 97, 204, 0.05)'}, transparent)`,
                animation: 'rotate 10s linear infinite',
              },
              
              '@keyframes rotate': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: '3rem',
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(135deg, #6E61CC, #667eea)',
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
              fontFamily: 'Inter, sans-serif',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #ffffff, #e2e8f0)'
                : 'linear-gradient(135deg, #1e293b, #475569)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('chat.emptyState.title')}
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            {t('chat.emptyState.description')}
          </Typography>
          
          {/* Feature Pills */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '🎯', text: 'Akıllı Optimizasyon' },
              { icon: '⚡', text: 'Hızlı Yanıt' },
              { icon: '🧠', text: 'Çoklu Model' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(110, 97, 204, 0.1)'
                      : 'rgba(110, 97, 204, 0.05)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(110, 97, 204, 0.2)' : 'rgba(110, 97, 204, 0.15)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 25px rgba(110, 97, 204, 0.2)'
                        : '0 8px 25px rgba(110, 97, 204, 0.15)',
                    },
                  }}
                >
                  <Typography variant="body2">{feature.icon}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {feature.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </motion.div>
    </Box>
  ), [t, theme.palette.mode, theme.palette.text.secondary]);
  
  // Memoize paper styles
  const paperStyles = useMemo(() => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: theme.palette.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.7)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    borderRadius: 4,
    m: 2,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  }), [theme.palette.mode]);
  
  return (
    <Box
      sx={{
        height: '94vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Paper elevation={0} sx={paperStyles}>
          {/* Settings Section */}
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Button
              fullWidth
              onClick={toggleSettings}
              endIcon={
                <Box
                  sx={{
                    transition: 'all 0.3s ease',
                    transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <ExpandIcon />
                </Box>
              }
              sx={{
                py: 2,
                px: 3,
                borderRadius: 0,
                justifyContent: 'space-between',
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                },
              }}
            >
              {strategyText}
            </Button>
            
            <Collapse in={showSettings}>
              <Box
                sx={{
                  p: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(15, 23, 42, 0.3)'
                    : 'rgba(248, 250, 252, 0.8)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Mode Selection */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Chat Mode
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label="Strategy Mode"
                      color={useStrategy ? 'primary' : 'default'}
                      variant={useStrategy ? 'filled' : 'outlined'}
                      onClick={() => setUseStrategy(true)}
                      disabled={loading}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Chip
                      label="Direct Model"
                      color={!useStrategy ? 'primary' : 'default'}
                      variant={!useStrategy ? 'filled' : 'outlined'}
                      onClick={() => setUseStrategy(false)}
                      disabled={loading}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {useStrategy
                      ? 'Strategy mode uses optimized AI configurations for specific purposes'
                      : 'Direct model mode gives you full control over model selection and parameters'
                    }
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Strategy Selection - Only when useStrategy is true */}
                {useStrategy && (
                  <>
                    <MemoizedStrategySelector
                      value={strategy}
                      onChange={setStrategy}
                      disabled={loading}
                    />
                    <Divider sx={{ my: 3 }} />
                    <MemoizedOptimizationTypeSelector
                      value={optimizationType}
                      onChange={setOptimizationType}
                      disabled={loading}
                    />
                    <Divider sx={{ my: 3 }} />
                  </>
                )}

                {/* Model Selection - Only when useStrategy is false */}
                {!useStrategy && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Model Selection
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Choose AI Model
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {models.map((model) => (
                          <Chip
                            key={model.name || model.id}
                            label={model.displayName || model.name}
                            color={selectedModel === (model.name || model.id) ? 'primary' : 'default'}
                            variant={selectedModel === (model.name || model.id) ? 'filled' : 'outlined'}
                            onClick={() => setSelectedModel(model.name || model.id)}
                            disabled={loading}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: selectedModel === (model.name || model.id)
                                  ? undefined
                                  : 'action.hover'
                              }
                            }}
                          />
                        ))}
                      </Box>
                      {models.find(m => (m.name || m.id) === selectedModel)?.costPer1KTokens && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Cost: ${models.find(m => (m.name || m.id) === selectedModel).costPer1KTokens}/1K tokens
                        </Typography>
                      )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Temperature Control */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Temperature: {temperature}
                    </Typography>
                    <Slider
                      value={temperature}
                      onChange={(e, value) => setTemperature(value)}
                      min={0}
                      max={2}
                      step={0.1}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 0.7, label: '0.7' },
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                      ]}
                      disabled={loading}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Lower values = more focused, Higher values = more creative
                    </Typography>

                    <Divider sx={{ my: 3 }} />
                  </>
                )}
                
                {/* Memory Settings - Only show for authenticated users */}
                {isAuthenticated && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {t('memory.sessionMemory')}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableMemory}
                          onChange={(e) => setEnableMemory(e.target.checked)}
                          disabled={loading}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2">
                            {t('memory.enableMemory')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t('memory.memoryDescription')}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    {enableMemory && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {t('memory.contextWindow')}: {contextWindowSize} {t('sessions.messages')}
                        </Typography>
                        <Slider
                          value={contextWindowSize}
                          onChange={(e, value) => setContextWindowSize(value)}
                          min={5}
                          max={50}
                          step={5}
                          marks={[
                            { value: 5, label: '5' },
                            { value: 10, label: '10' },
                            { value: 25, label: '25' },
                            { value: 50, label: '50' },
                          ]}
                          disabled={loading}
                          sx={{ mt: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {t('memory.contextDescription')}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Collapse>
          </Box>
          
          {/* Error Display */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">
                {error}
              </Alert>
            </Box>
          )}
          
          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(30, 41, 59, 0.1) 100%)'
                : 'linear-gradient(180deg, rgba(248, 250, 252, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              position: 'relative',
              
              // Custom scrollbar
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)',
                borderRadius: '3px',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.3)',
                },
              },
            }}
          >
            {messages.length === 0 ? (
              emptyState
            ) : (
              <>
                <AnimatePresence>
                  {messages
                    .filter(message => message && message.content && message.id)
                    .map((message, index) => (
                      <MemoizedChatMessage
                        key={message.id || `message-${index}-${Date.now()}`}
                        message={message.content}
                        isUser={message.isUser}
                        result={message.result}
                      />
                    ))}
                </AnimatePresence>
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LoadingSpinner message={t('chat.messages.thinking')} />
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>
          
          {/* Input Section */}
          <Box
            sx={{
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 41, 59, 0.6)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(15px)',
              borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            }}
          >
            {messages.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  onClick={handleNewChat}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.1)'
                      : 'rgba(99, 102, 241, 0.05)',
                    color: theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)'}`,
                    '&:hover': {
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(99, 102, 241, 0.1)',
                    }
                  }}
                >
                  {t('chat.buttons.newChat')}
                </Button>
              </Box>
            )}
            <PromptInput
              value={prompt}
              onChange={handlePromptChange}
              onSubmit={handleSubmit}
              onClear={handleClear}
              loading={loading}
              disabled={loading}
              hasMessages={messages.length > 0}
            />
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default memo(PromptOptimizer);
