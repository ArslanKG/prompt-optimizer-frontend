import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Logo from '../components/Common/Logo';

const About = () => {
  const theme = useTheme();
  
  const features = [
    'Multi-model AI desteği ile en iyi sonuçları alın',
    'Prompt optimizasyonu ile daha etkili sorgular',
    '4 farklı strateji ile ihtiyacınıza uygun çözümler',
    'Gerçek zamanlı yanıt ve işlem takibi',
    'Modern ve kullanıcı dostu arayüz',
    'Güvenli ve hızlı API entegrasyonu',
  ];
  
  const techStack = [
    { icon: <CodeIcon />, title: 'Backend', tech: '.NET 8, C#, RESTful API', color: '#667eea' },
    { icon: <AIIcon />, title: 'AI Models', tech: 'GPT-4, Gemini, DeepSeek, Grok', color: '#764ba2' },
    { icon: <SpeedIcon />, title: 'Frontend', tech: 'React, Material-UI, Framer Motion', color: '#f59e0b' },
    { icon: <SecurityIcon />, title: 'Security', tech: 'HTTPS, Bearer Auth, CORS', color: '#10b981' },
  ];
  
  return (
    <Box sx={{ minHeight: '100vh', pt: 10, pb: 6 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Logo size={150} animate />
            </Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
            >
              Arkegu AI Hakkında
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Yapay zeka teknolojilerini kullanarak prompt optimizasyonu yapan,
              çoklu AI modeli desteği sunan yenilikçi bir platform
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(30, 41, 59, 0.5)'
                      : 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Misyonumuz
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Arkegu AI, kullanıcıların AI modellerinden en verimli şekilde
                    faydalanmalarını sağlamak için geliştirilmiş bir platformdur.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Amacımız, karmaşık AI teknolojilerini herkes için erişilebilir ve
                    kullanımı kolay hale getirmektir. Birden fazla AI modelini tek bir
                    platformda birleştirerek, kullanıcılarımıza en iyi sonuçları sunuyoruz.
                  </Typography>
                  <List>
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6} style= {{width: '100%' }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  Teknolojilerimiz
                </Typography>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    mb: 3,
                    width: '100%',
                    flexGrow: 1,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Grid container spacing={4}>
                    {techStack.map((item, index) => (
                      <Grid item xs={6} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                fontSize: 40,
                                color: item.color,
                                mb: 1,
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              {React.cloneElement(item.icon, { sx: { fontSize: 40 } })}
                            </Box>
                            <Typography variant="h6" fontWeight="bold">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.tech}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    width: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    İletişim
                  </Typography>
                  <Typography variant="body2">
                    Sorularınız veya önerileriniz için bizimle iletişime geçin
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    info@arkegu.ai
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;