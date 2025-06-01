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
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useOptimizationStore from '../../store/optimizationStore';
import { STRATEGY_CONFIGS, OPTIMIZATION_TYPE_CONFIGS } from '../../utils/constants';
import PromptInput from './PromptInput';
import StrategySelector from './StrategySelector';
import OptimizationTypeSelector from './OptimizationTypeSelector';
import ChatMessage from './ChatMessage';
import LoadingSpinner from '../Common/LoadingSpinner';

// Memoize heavy components
const MemoizedStrategySelector = memo(StrategySelector);
const MemoizedOptimizationTypeSelector = memo(OptimizationTypeSelector);
const MemoizedChatMessage = memo(ChatMessage);

const PromptOptimizer = () => {
  const theme = useTheme();
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
    loading,
    optimize,
    result,
    error,
  } = useOptimizationStore();
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  useEffect(() => {
    if (result && result.finalResponse) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: result.finalResponse,
        isUser: false,
        result: result,
      }]);
    }
  }, [result]);
  
  const handleSubmit = useCallback(async (promptValue) => {
    // Use the passed promptValue or fallback to store prompt
    const textToSubmit = promptValue || prompt;
    
    if (!textToSubmit.trim()) return;
    
    // Update store with the latest value
    if (promptValue && promptValue !== prompt) {
      setPrompt(promptValue);
    }
    
    const userMessage = {
      id: Date.now(),
      content: textToSubmit,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    
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
    setMessages([]);
    setPrompt('');
    setShowSettings(true);
  }, [setPrompt]);
  
  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);
  
  // Memoize strategy text
  const strategyText = useMemo(() => (
    <Typography variant="subtitle2">
      Strateji: <strong>{STRATEGY_CONFIGS[strategy]?.name}</strong> • 
      Optimizasyon: <strong>{OPTIMIZATION_TYPE_CONFIGS[optimizationType]?.name}</strong>
    </Typography>
  ), [strategy, optimizationType]);
  
  // Memoize empty state
  const emptyState = useMemo(() => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Box>
        <Typography variant="h3" sx={{ opacity: 0.1, mb: 2 }}>
          💬
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Merhaba! Size nasıl yardımcı olabilirim?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Bir soru sorun ve AI modellerimiz size en iyi yanıtı versin.
        </Typography>
      </Box>
    </Box>
  ), []);
  
  // Memoize paper styles
  const paperStyles = useMemo(() => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.5)'
      : 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
    m: 2,
  }), [theme.palette.mode, theme.palette.divider]);
  
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
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Button
              fullWidth
              onClick={toggleSettings}
              endIcon={showSettings ? <CollapseIcon /> : <ExpandIcon />}
              sx={{
                py: 1.5,
                borderRadius: 0,
                justifyContent: 'space-between',
                textTransform: 'none',
              }}
            >
              {strategyText}
            </Button>
            
            <Collapse in={showSettings}>
              <Box sx={{ p: 3 }}>
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
              backgroundColor: theme.palette.background.default,
            }}
          >
            {messages.length === 0 ? (
              emptyState
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message) => (
                    <MemoizedChatMessage
                      key={message.id}
                      message={message.content}
                      isUser={message.isUser}
                      result={message.result}
                    />
                  ))}
                </AnimatePresence>
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LoadingSpinner message="AI yanıt hazırlıyor..." />
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>
          
          {/* Input Section */}
          <Box sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
            {messages.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  onClick={handleNewChat}
                  sx={{ textTransform: 'none' }}
                >
                  Yeni Sohbet Başlat
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
