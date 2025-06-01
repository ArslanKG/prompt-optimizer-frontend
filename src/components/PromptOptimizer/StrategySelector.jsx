import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  useTheme,
  Chip,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { STRATEGY_CONFIGS } from '../../utils/constants';
import { useTranslation } from '../../contexts/TranslationContext';

const StrategySelector = ({ value, onChange, disabled }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        {t.chat.strategy}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(STRATEGY_CONFIGS).map(([key, config], index) => (
          <Grid item xs={12} sm={6} key={key}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => !disabled && onChange(key)}
                sx={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                  borderRadius: 3,
                  width: '250px',
                  border: value === key ? `2px solid ${config.color}` : `1px solid ${theme.palette.divider}`,
                  background: value === key
                    ? theme.palette.mode === 'dark'
                      ? `${config.color}15`
                      : `${config.color}08`
                    : theme.palette.background.paper,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: config.color,
                    transform: !disabled ? 'translateY(-2px)' : 'none',
                    boxShadow: !disabled ? theme.shadows[4] : 'none',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Radio
                      checked={value === key}
                      disabled={disabled}
                      sx={{
                        color: config.color,
                        '&.Mui-checked': {
                          color: config.color,
                        },
                      }}
                    />
                    <Typography variant="h3" sx={{ ml: 1 }}>
                      {config.icon}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold" color={config.color}>
                    {t.strategies[key]?.name || config.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {t.strategies[key]?.description || config.description}
                  </Typography>
                  <Chip
                    label={config.estimatedTime}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: `${config.color}20`,
                      color: config.color,
                      fontWeight: 'medium',
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StrategySelector;
