import React from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { OPTIMIZATION_TYPE_CONFIGS } from '../../utils/constants';
import { useTranslation } from '../../hooks/useTranslation';

const OptimizationTypeSelector = ({ value, onChange, disabled }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        {t.chat.optimizationType}
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(e, newValue) => newValue && onChange(newValue)}
        disabled={disabled}
        sx={{ width: '100%' }}
      >
        {Object.entries(OPTIMIZATION_TYPE_CONFIGS).map(([key, config], index) => (
          <ToggleButton
            key={key}
            value={key}
            sx={{
              flex: 1,
              py: 2,
              px: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {config.icon}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {t.optimizationTypes[key]?.name || config.name}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {t.optimizationTypes[key]?.description || config.description}
                </Typography>
              </Box>
            </motion.div>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default OptimizationTypeSelector;
