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
import { useTranslation } from '../hooks/useTranslation';

const About = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  const features = t.about.features;
  
  const techStack = [
    { icon: <CodeIcon />, title: t.about.technologies.stack.backend.title, tech: t.about.technologies.stack.backend.tech, color: '#667eea' },
    { icon: <AIIcon />, title: t.about.technologies.stack.ai.title, tech: t.about.technologies.stack.ai.tech, color: '#764ba2' },
    { icon: <SpeedIcon />, title: t.about.technologies.stack.frontend.title, tech: t.about.technologies.stack.frontend.tech, color: '#f59e0b' },
    { icon: <SecurityIcon />, title: t.about.technologies.stack.security.title, tech: t.about.technologies.stack.security.tech, color: '#10b981' },
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
              {t.about.title}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              {t.about.subtitle}
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
                    {t.about.mission.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {t.about.mission.description1}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {t.about.mission.description2}
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
                  {t.about.technologies.title}
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
                    {t.about.contact.title}
                  </Typography>
                  <Typography variant="body2">
                    {t.about.contact.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t.about.contact.email}
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
