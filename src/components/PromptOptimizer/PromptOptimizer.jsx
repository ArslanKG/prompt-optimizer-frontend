import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
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
import Logo from '../Common/Logo';

const PromptOptimizer = () => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const [showSettings, setShowSettings] = useState(true);
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
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
  
  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      content: prompt,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Optimize and get response
    await optimize();
    
    // Clear prompt after sending
    setPrompt('');
    setShowSettings(false);
  };
  
  const handleClear = () => {
    setPrompt('');
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setPrompt('');
    setShowSettings(true);
  };
  
  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 41, 59, 0.5)'
              : 'rgba(248, 250, 252, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Logo size={100} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Arkegu AI Chat
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Birden fazla AI modeli ile güçlendirilmiş akıllı asistan
              </Typography>
            </Box>
          </Box>
          
          {/* Settings Section */}
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Button
              fullWidth
              onClick={() => setShowSettings(!showSettings)}
              endIcon={showSettings ? <CollapseIcon /> : <ExpandIcon />}
              sx={{
                py: 1.5,
                borderRadius: 0,
                justifyContent: 'space-between',
                textTransform: 'none',
              }}
            >
              <Typography variant="subtitle2">
                Strateji: <strong>{STRATEGY_CONFIGS[strategy]?.name}</strong> • 
                Optimizasyon: <strong>{OPTIMIZATION_TYPE_CONFIGS[optimizationType]?.name}</strong>
              </Typography>
            </Button>
            
            <Collapse in={showSettings}>
              <Box sx={{ p: 3 }}>
                <StrategySelector
                  value={strategy}
                  onChange={setStrategy}
                  disabled={loading}
                />
                <Divider sx={{ my: 3 }} />
                <OptimizationTypeSelector
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
              height: '500px',
              overflowY: 'auto',
              p: 3,
              backgroundColor: theme.palette.background.default,
            }}
          >
            {messages.length === 0 ? (
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
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message) => (
                    <ChatMessage
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
              onChange={setPrompt}
              onSubmit={handleSubmit}
              onClear={handleClear}
              loading={loading}
              disabled={loading}
            />
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default PromptOptimizer;