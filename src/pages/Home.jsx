import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Common/Logo';
import { useTranslation } from '../hooks/useTranslation';

const FeatureCard = ({ icon, title, description, details, gradient, delay }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [expanded, setExpanded] = React.useState(false);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        style={{ height: '100%' }}
      >
        <Card
          sx={{
            height: expanded ? 'auto' : '220px',
            minHeight: '220px',
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 41, 59, 0.6)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
            overflow: 'hidden',
            maxWidth: '500px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              '& .feature-overlay': {
                opacity: 1,
              },
              '& .feature-icon': {
                transform: 'scale(1.1) rotate(5deg)',
              },
            },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {/* Gradient Overlay */}
          <Box
            className="feature-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: gradient,
              opacity: 0.7,
              transition: 'opacity 0.3s ease',
            }}
          />
          
          <CardContent sx={{ 
            p: 3,
            pb: 2,
            height: '100%',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            {/* Top Content */}
            <Box>
              {/* Icon and Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  className="feature-icon"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: gradient,
                    color: 'white',
                    display: 'flex',
                    mr: 3,
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    minWidth: 56,
                    minHeight: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 0.5 }}>
                    {title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: expanded ? 'none' : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: '0.95rem',
                    }}
                  >
                    {description}
                  </Typography>
                </Box>
              </Box>
              
              {/* Details Section */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, opacity: 0.8 }}>
                        {t('home.features.title')}:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 3 }}>
                        {details.map((detail, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mb: 1,
                                color: theme.palette.text.secondary,
                                '&::marker': {
                                  color: theme.palette.primary.main,
                                }
                              }}
                            >
                              {detail}
                            </Typography>
                          </motion.li>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            
            {/* Expand Indicator - Bottom */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                pt: 1,
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  userSelect: 'none',
                  fontSize: '0.75rem',
                }}
              >
                {expanded ? t('common.hideDetails') : t('common.showDetails')}
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <ExpandIcon sx={{ fontSize: 16 }} />
                </motion.span>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.smartOptimization.title'),
      description: t('home.features.smartOptimization.description'),
      details: t('home.features.smartOptimization.details'),
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.multiModel.title'),
      description: t('home.features.multiModel.description'),
      details: t('home.features.multiModel.details'),
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.strategies.title'),
      description: t('home.features.strategies.description'),
      details: t('home.features.strategies.details'),
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.analytics.title'),
      description: t('home.features.analytics.description'),
      details: t('home.features.analytics.details'),
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', pt: 10 }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Logo size={180} animate />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                fontWeight: 900,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              <span className="gradient-text">{t('home.title')}</span>
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.8rem' },
                fontWeight: 300,
                color: 'text.secondary',
              }}
            >
              {t('home.subtitle')}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              {t('home.description')}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  },
                }}
                onClick={() => navigate('/chat')}
              >
                {t('home.startButton')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  const element = document.getElementById('features-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.primary.main + '10',
                  },
                }}
              >
                {t('home.exploreFeatures')}
              </Button>
            </Box>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box sx={{ mt: 6, display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  7+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.stats.models')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  4
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.stats.strategies')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  &lt;3s
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.stats.responseTime')}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>

      {/* Features Section */}
      <Box id="features-section" sx={{ py: 8, position: 'relative' }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              textAlign="center"
              sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('home.features.title')}
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}
            >
              {t('home.features.subtitle')}
            </Typography>
          </motion.div>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <FeatureCard {...feature} delay={0.1 * index} />
              </Grid>
            ))}
          </Grid>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {t('home.cta.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {t('home.cta.description')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => navigate('/chat')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
                  },
                }}
              >
                {t('home.cta.button')}
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
