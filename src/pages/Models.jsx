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
import { optimizationApi } from '../services/api';
import { MODEL_TYPE_COLORS } from '../utils/constants';

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
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await optimizationApi.getModels();
        setModels(data);
      } catch (error) {
        console.error('Failed to fetch models:', error);
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
              AI Modelleri
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Kullanılabilir tüm AI modellerini keşfedin
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
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <SpeedIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.fast, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Hızlı</Typography>
                  <Typography variant="body2" color="text.secondary">
                    En hızlı yanıt süreleri
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <BalanceIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.balanced, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Dengeli</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hız ve kalite dengesi
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <PsychologyIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.advanced, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Gelişmiş</Typography>
                  <Typography variant="body2" color="text.secondary">
                    En yüksek kalite
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <ReasoningIcon sx={{ fontSize: 40, color: MODEL_TYPE_COLORS.reasoning, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Muhakeme</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Karmaşık problemler için
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
                            {model.id}
                          </Typography>
                          <Chip
                            label={model.type}
                            size="small"
                            sx={{
                              backgroundColor: `${MODEL_TYPE_COLORS[model.type]}20`,
                              color: MODEL_TYPE_COLORS[model.type],
                              fontWeight: 'medium',
                              mr: 1,
                            }}
                          />
                          {model.isEnabled !== false && (
                            <Chip
                              label="Aktif"
                              size="small"
                              color="success"
                            />
                          )}
                        </Box>
                        
                        <Box sx={{ mx: 3, width: '20%' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Maliyet
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${model.cost}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ width: '30%' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Öncelik Seviyesi
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(model.priority / 3) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: MODEL_TYPE_COLORS[model.type] || theme.palette.primary.main,
                              },
                            }}
                          />
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