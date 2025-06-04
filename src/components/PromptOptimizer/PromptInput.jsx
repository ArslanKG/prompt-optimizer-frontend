import React, { useRef, useCallback, memo, useState, useEffect } from 'react';
import {
  TextField,
  IconButton,
  Box,
  useTheme,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
  Clear as ClearIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import {
  sanitizeInputText,
  validateAndSanitizeForSubmission
} from '../../utils/textSanitizer';

const PromptInput = memo(({ value, onChange, onSubmit, onClear, loading, disabled, hasMessages }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const textFieldRef = useRef(null);
  
  // Local state to prevent re-renders during typing
  const [localValue, setLocalValue] = useState(value);
  
  // Sync with parent value only when it changes externally (e.g., after submit)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (localValue.trim()) {
        // Final validation before submission
        const result = validateAndSanitizeForSubmission(localValue);
        
        if (!result.isValid) {
          // Clean the text and update state
          setLocalValue(result.sanitizedText);
          return;
        }
        
        // Pass the validated value to onSubmit
        onSubmit(result.sanitizedText);
      }
    }
  }, [localValue, onSubmit]);

  const handleChange = useCallback((e) => {
    const inputValue = e.target.value;
    
    // Sanitize input in real-time
    const sanitizedValue = sanitizeInputText(inputValue, localValue);
    
    // Only update local state while typing
    setLocalValue(sanitizedValue);
  }, [localValue]);
  
  const handleBlur = useCallback(() => {
    // Validate and sanitize text before syncing with parent state
    const result = validateAndSanitizeForSubmission(localValue, false);
    
    if (!result.isValid) {
      // Clean the text and update state
      setLocalValue(result.sanitizedText);
      onChange(result.sanitizedText);
    } else if (localValue !== value) {
      onChange(localValue);
    }
  }, [localValue, value, onChange]);
  
  const handleSubmitClick = useCallback(() => {
    if (localValue.trim()) {
      // Final validation before submission
      const result = validateAndSanitizeForSubmission(localValue);
      
      if (!result.isValid) {
        // Clean the text and update state
        setLocalValue(result.sanitizedText);
        return;
      }
      
      // Pass the validated value to onSubmit
      onSubmit(result.sanitizedText);
    }
  }, [localValue, onSubmit]);
  
  const handleClearClick = useCallback(() => {
    setLocalValue('');
    onClear();
  }, [onClear]);

  // Memoize the icons to prevent re-renders
  const startIcon = React.useMemo(() => (
    <InputAdornment position="start">
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)'}`,
          color: theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1',
        }}
      >
        <PsychologyIcon />
      </Box>
    </InputAdornment>
  ), [theme.palette.mode]);
  
  const endIcon = React.useMemo(() => (
    <InputAdornment position="end">
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {localValue && (
          <Tooltip title={t('common.close')} arrow>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                size="small"
                onClick={handleClearClick}
                disabled={loading}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(239, 68, 68, 0.05)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'}`,
                  color: theme.palette.mode === 'dark' ? '#fca5a5' : '#dc2626',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </motion.span>
          </Tooltip>
        )}
        <Tooltip title={t('chat.buttons.send')} arrow>
          <motion.span
            whileHover={{ scale: !localValue.trim() || loading ? 1 : 1.05 }}
            whileTap={{ scale: !localValue.trim() || loading ? 1 : 0.95 }}
          >
            <IconButton
              onClick={handleSubmitClick}
              disabled={!localValue.trim() || loading}
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                background: !localValue.trim() || loading
                  ? theme.palette.action.disabledBackground
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: `2px solid ${!localValue.trim() || loading
                  ? 'transparent'
                  : 'rgba(255, 255, 255, 0.2)'}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: !localValue.trim() || loading
                    ? theme.palette.action.disabledBackground
                    : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: !localValue.trim() || loading ? 'none' : 'translateY(-1px)',
                  boxShadow: !localValue.trim() || loading
                    ? 'none'
                    : '0 10px 25px rgba(103, 126, 234, 0.3)',
                },
                '&.Mui-disabled': {
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                >
                  <AutoAwesomeIcon />
                </motion.div>
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </motion.span>
        </Tooltip>
      </Box>
    </InputAdornment>
  ), [localValue, loading, handleClearClick, handleSubmitClick, theme.palette.mode, theme.palette.action.disabledBackground, theme.palette.action.disabled, t]);

  // Dynamic placeholder based on whether there are messages
  const placeholder = hasMessages
    ? t('chat.inputPlaceholder.continue')
    : t('chat.inputPlaceholder.initial');

  return (
    <Box>
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          value={localValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 41, 59, 0.4)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& fieldset': {
                border: 'none',
              },
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.6)'
                  : 'rgba(255, 255, 255, 0.95)',
                border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                transform: 'translateY(-1px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-focused': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 1)',
                border: `2px solid ${theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1'}`,
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 15px 40px rgba(99, 102, 241, 0.2)'
                  : '0 15px 40px rgba(99, 102, 241, 0.15)',
              },
              '&.Mui-disabled': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.2)'
                  : 'rgba(248, 250, 252, 0.5)',
                opacity: 0.6,
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '1rem',
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              '&::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 0.7,
                fontStyle: 'italic',
              },
            },
            '& .MuiInputAdornment-root': {
              marginTop: '0px !important',
            },
          }}
          InputProps={{
            startAdornment: startIcon,
            endAdornment: endIcon,
          }}
        />
    </Box>
  );
});

PromptInput.displayName = 'PromptInput';

export default PromptInput;
