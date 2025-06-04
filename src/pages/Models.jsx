import React, { useEffect, useState } from 'react';
import Logo from '../components/Common/Logo';
import {
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  Skeleton,
  useTheme,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Balance as BalanceIcon,
  AutoFixHigh as ReasoningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MODEL_TYPE_COLORS } from '../utils/constants';
import { useTranslation } from '../hooks/useTranslation';
import modelsData from '../data/models.json';

// Helper function to get the appropriate icon based on model type
const getModelIcon = (type) => {
  switch (type) {
    case 'fast': return <SpeedIcon />;
    case 'balanced': return <BalanceIcon />;
    case 'advanced': return <PsychologyIcon />;
    case 'reasoning': return <ReasoningIcon />;
    default: return <PsychologyIcon />;
  }
};

const Models = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Use local models data directly
        const data = modelsData.models;
        // Convert array to object with id as key for compatibility
        const modelsObject = {};
        data.forEach(model => {
          modelsObject[model.id] = model;
        });
        setModels(modelsObject);
      } catch (error) {
        console.error('Failed to load models:', error);
        setModels({});
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', pt: 10, pb: 6 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Logo size={150} animate />
            </Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('models.title')}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              {t('models.subtitle')}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 5,
              mb: 4,
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={6} justifyContent="center" alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <SpeedIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.fast, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">{t('models.types.fast.name')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('models.types.fast.description')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <BalanceIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.balanced, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">{t('models.types.balanced.name')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('models.types.balanced.description')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <PsychologyIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.advanced, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">{t('models.types.advanced.name')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('models.types.advanced.description')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ReasoningIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.reasoning, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">{t('models.types.reasoning.name')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('models.types.reasoning.description')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ width: '100%' }}>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                </Box>
              ))
            ) : (
              <Paper 
                elevation={0}
                sx={{
                  borderRadius: 0,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {Object.entries(models).map(([key, model], index) => (
                  <Box 
                    key={key} 
                    sx={{ 
                      p: 2,
                      borderBottom: index < Object.entries(models).length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                      }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: `${MODEL_TYPE_COLORS[model.type]}20` || theme.palette.primary.light,
                            color: MODEL_TYPE_COLORS[model.type] || theme.palette.primary.main,
                            mr: 2,
                          }}
                        >
                          {getModelIcon(model.type)}
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {model.name || model.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {model.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={t(`models.types.${model.type}.name`) || model.type}
                              size="small"
                              sx={{
                                backgroundColor: `${MODEL_TYPE_COLORS[model.type]}20`,
                                color: MODEL_TYPE_COLORS[model.type],
                                fontWeight: 'medium',
                              }}
                            />
                            {model.provider && (
                              <Chip
                                label={model.provider}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                            {(model.active !== false && model.isEnabled !== false) && (
                              <Chip
                                label={t('models.labels.active')}
                                size="small"
                                color="success"
                              />
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ mx: 3, width: '25%' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t('models.labels.cost')}
                          </Typography>
                          {model.pricing ? (
                            <Box>
                              <Typography variant="body2" fontWeight="bold" color="primary">
                                Input: {model.pricing.input}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="secondary">
                                Output: {model.pricing.output}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="h6" color="primary">
                              ${model.cost}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ width: '25%' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t('models.labels.priority')}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.max(0, 100 - ((model.priority - 1) / 6) * 100)}
                              sx={{
                                flexGrow: 1,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  backgroundColor: MODEL_TYPE_COLORS[model.type] || theme.palette.primary.main,
                                },
                              }}
                            />
                            <Typography variant="body2" fontWeight="bold">
                              #{model.priority}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Models;
