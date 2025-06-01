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

const PromptInput = memo(({ value, onChange, onSubmit, onClear, loading, disabled, hasMessages }) => {
  const theme = useTheme();
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
        // Pass the local value directly to onSubmit
        onSubmit(localValue);
      }
    }
  }, [localValue, onSubmit]);

  const handleChange = useCallback((e) => {
    // Only update local state while typing
    setLocalValue(e.target.value);
  }, []);
  
  const handleBlur = useCallback(() => {
    // Sync with parent state when user stops typing
    if (localValue !== value) {
      onChange(localValue);
    }
  }, [localValue, value, onChange]);
  
  const handleSubmitClick = useCallback(() => {
    if (localValue.trim()) {
      // Pass the local value directly to onSubmit
      onSubmit(localValue);
    }
  }, [localValue, onSubmit]);
  
  const handleClearClick = useCallback(() => {
    setLocalValue('');
    onClear();
  }, [onClear]);

  // Memoize the icons to prevent re-renders
  const startIcon = React.useMemo(() => (
    <InputAdornment position="start">
      <PsychologyIcon color="primary" />
    </InputAdornment>
  ), []);
  
  const endIcon = React.useMemo(() => (
    <InputAdornment position="end">
      <Box sx={{ display: 'flex', gap: 1 }}>
        {localValue && (
          <Tooltip title="Temizle">
            <IconButton
              size="small"
              onClick={handleClearClick}
              disabled={loading}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Gönder">
          <IconButton
            color="primary"
            onClick={handleSubmitClick}
            disabled={!localValue.trim() || loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              },
              '&.Mui-disabled': {
                background: theme.palette.action.disabledBackground,
              },
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <AutoAwesomeIcon />
              </motion.div>
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </InputAdornment>
  ), [localValue, loading, handleClearClick, handleSubmitClick, theme.palette.action.disabledBackground]);

  // Dynamic placeholder based on whether there are messages
  const placeholder = hasMessages 
    ? "Sorunuzu yazın..." 
    : "Prompt'unuzu buraya yazın... (Örn: React hooks nedir ve nasıl kullanılır?)";

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
              borderRadius: 2,
              background: theme.palette.background.paper,
              '& fieldset': {
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
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
