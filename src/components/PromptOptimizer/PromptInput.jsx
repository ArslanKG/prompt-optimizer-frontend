import React, { useRef } from 'react';
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

const PromptInput = ({ value, onChange, onSubmit, onClear, loading, disabled }) => {
  const theme = useTheme();
  const textFieldRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
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
    </Box>
  );
};

export default PromptInput;