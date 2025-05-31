import React, { useState, useRef } from 'react';
import {
  TextField,
  IconButton,
  Box,
  Typography,
  Chip,
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
import { EXAMPLE_PROMPTS } from '../../utils/constants';

const PromptInput = ({ value, onChange, onSubmit, onClear, loading, disabled }) => {
  const theme = useTheme();
  const textFieldRef = useRef(null);
  const [showExamples, setShowExamples] = useState(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleExampleClick = (prompt) => {
    onChange(prompt);
    setShowExamples(false);
    textFieldRef.current?.focus();
  };

  return (
    <Box>
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Prompt'unuzu buraya yazın... (Örn: React hooks nedir ve nasıl kullanılır?)"
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
            startAdornment: (
              <InputAdornment position="start">
                <PsychologyIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {value && (
                    <Tooltip title="Temizle">
                      <IconButton
                        size="small"
                        onClick={onClear}
                        disabled={loading}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Gönder">
                    <IconButton
                      color="primary"
                      onClick={onSubmit}
                      disabled={!value.trim() || loading}
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
            ),
          }}
        />

      {/* Example Prompts */}
      {showExamples && !value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Örnek promptlar:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {EXAMPLE_PROMPTS.slice(0, 1)[0].prompts.slice(0, 4).map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={prompt}
                    onClick={() => handleExampleClick(prompt)}
                    sx={{
                      cursor: 'pointer',
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'rgba(99, 102, 241, 0.05)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default PromptInput;