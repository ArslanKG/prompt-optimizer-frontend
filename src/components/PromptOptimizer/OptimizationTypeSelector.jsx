import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Grid,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { OPTIMIZATION_TYPE_CONFIGS } from '../../utils/constants';
import { useTranslation } from '../../hooks/useTranslation';
import optimizationTypesData from '../../data/optimizationTypes.json';

const OptimizationTypeSelector = ({ value, onChange, disabled }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Merge JSON data with constants for complete configuration
  const optimizationTypes = React.useMemo(() => {
    return optimizationTypesData.optimizationTypes.map(type => ({
      ...type,
      ...OPTIMIZATION_TYPE_CONFIGS[type.id], // Merge with constants for additional config
    }));
  }, []);

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
        {t('chat.optimizationType')}
      </Typography>
      
      <Grid container spacing={2}>
        {optimizationTypes.map((config, index) => {
          const isSelected = value === config.id;
          const gradientColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
          const color = gradientColors[index % gradientColors.length];
          
          return (
            <Grid size={{ xs: 6, md: 4, lg: 2.4 }} key={config.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
              >
                <Box
                  onClick={() => !disabled && onChange(config.id)}
                  sx={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1,
                    borderRadius: 4,
                    p: 3,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    
                    // Glass morphism effect
                    background: isSelected
                      ? `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.1)} 100%)`
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: isSelected
                      ? `2px solid ${color}`
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    
                    // Hover effects
                    '&:hover': {
                      background: disabled ? undefined : isSelected
                        ? `linear-gradient(135deg, ${alpha(color, 0.25)} 0%, ${alpha(color, 0.15)} 100%)`
                        : theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.06)'
                          : 'rgba(255, 255, 255, 0.2)',
                      borderColor: disabled ? undefined : color,
                      transform: disabled ? 'none' : 'translateY(-8px)',
                      boxShadow: disabled ? 'none' : `0 20px 40px ${alpha(color, 0.25)}`,
                    },
                    
                    // Animated background
                    '&::before': isSelected ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${alpha(color, 0.1)}, transparent)`,
                      animation: 'shimmer 2s infinite',
                    } : {},
                    
                    '@keyframes shimmer': {
                      '0%': { left: '-100%' },
                      '100%': { left: '100%' },
                    },
                  }}
                >
                  {/* Icon container */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      mx: 'auto',
                      mb: 2,
                      background: isSelected
                        ? `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`
                        : `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.05)})`,
                      border: `1px solid ${alpha(color, isSelected ? 0.5 : 0.2)}`,
                      color: isSelected ? 'white' : color,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      
                      // Glow effect for selected
                      ...(isSelected && {
                        boxShadow: `0 0 20px ${alpha(color, 0.4)}`,
                      }),
                    }}
                  >
                    {config.icon}
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem',
                          color: color,
                          fontWeight: 'bold',
                        }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </Box>
                  
                  {/* Content */}
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      color: isSelected ? color : 'text.primary',
                      mb: 1,
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {t(`optimizationTypes.${config.id}.name`) || config.name}
                  </Typography>
                  
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      lineHeight: 1.4,
                      fontSize: '0.7rem'
                    }}
                  >
                    {t(`optimizationTypes.${config.id}.description`) || config.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default OptimizationTypeSelector;
