import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Chip,
  Grid,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { STRATEGY_CONFIGS } from '../../utils/constants';
import { useTranslation } from '../../hooks/useTranslation';

const StrategySelector = ({ value, onChange, disabled }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 700,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {t('chat.strategy')}
      </Typography>
      
      <Grid container spacing={3}>
        {Object.entries(STRATEGY_CONFIGS).map(([key, config], index) => {
          const isSelected = value === key;
          
          return (
            <Grid size={{ xs: 12, sm: 6 }} key={key}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
              >
                <Box
                  onClick={() => !disabled && onChange(key)}
                  sx={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1,
                    borderRadius: 4,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    
                    // Glass morphism effect
                    background: isSelected
                      ? `linear-gradient(135deg, ${alpha(config.color, 0.15)} 0%, ${alpha(config.color, 0.05)} 100%)`
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.02)'
                        : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: isSelected
                      ? `2px solid ${config.color}`
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    
                    // Hover effects
                    '&:hover': {
                      background: disabled ? undefined : isSelected
                        ? `linear-gradient(135deg, ${alpha(config.color, 0.2)} 0%, ${alpha(config.color, 0.1)} 100%)`
                        : theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.2)',
                      borderColor: disabled ? undefined : config.color,
                      transform: disabled ? 'none' : 'translateY(-4px)',
                      boxShadow: disabled ? 'none' : `0 20px 40px ${alpha(config.color, 0.2)}`,
                    },
                    
                    // Gradient border animation
                    '&::before': isSelected ? {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      padding: '2px',
                      background: `linear-gradient(135deg, ${config.color}, ${alpha(config.color, 0.6)})`,
                      borderRadius: 'inherit',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                    } : {},
                  }}
                >
                  {/* Icon and selection indicator */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          background: `linear-gradient(135deg, ${alpha(config.color, 0.1)}, ${alpha(config.color, 0.05)})`,
                          border: `1px solid ${alpha(config.color, 0.2)}`,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {config.icon}
                      </Box>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${config.color}, ${alpha(config.color, 0.8)})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.8rem',
                            }}
                          >
                            ✓
                          </Box>
                        </motion.div>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Content */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: isSelected ? config.color : 'text.primary',
                      mb: 1,
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {t(`strategies.${key}.name`) || config.name}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6
                    }}
                  >
                    {t(`strategies.${key}.description`) || config.description}
                  </Typography>
                  
                  <Chip
                    label={config.estimatedTime}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(config.color, 0.15)}, ${alpha(config.color, 0.1)})`,
                      color: config.color,
                      fontWeight: 600,
                      border: `1px solid ${alpha(config.color, 0.2)}`,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StrategySelector;
