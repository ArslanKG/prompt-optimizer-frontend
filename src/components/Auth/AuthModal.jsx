import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useTranslation } from '../../hooks/useTranslation';
import { sanitizeFormData, sanitizeInputText } from '../../utils/textSanitizer';

const AuthModal = ({ open, onClose }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { login, register, loading } = useAuth();
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleInputChange = (field) => (event) => {
    const inputValue = event.target.value;
    
    // Sanitize input for security
    const sanitizedValue = sanitizeInputText(inputValue, '', false); // Don't show notifications for auth forms
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (tab === 1) { // Register tab
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Sanitize form data before submission
      const sanitizedFormData = sanitizeFormData(formData);
      
      if (tab === 0) {
        // Login
        await login({
          username: sanitizedFormData.username,
          password: sanitizedFormData.password,
        });
      } else {
        // Register
        await register({
          username: sanitizedFormData.username,
          email: sanitizedFormData.email,
          password: sanitizedFormData.password,
        });
        // Switch to login tab after successful registration
        setTab(0);
        setFormData(prev => ({
          ...prev,
          email: '',
          password: '',
          confirmPassword: '',
        }));
        return; // Don't close modal, let user login
      }
      
      // Close modal on successful login
      onClose();
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form after closing
      setTimeout(() => {
        setTab(0);
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setErrors({});
      }, 300);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {tab === 0 ? t('auth.welcomeBack') : t('auth.createAccount')}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab
            icon={<LoginIcon />}
            label={t('auth.login')}
            iconPosition="start"
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<RegisterIcon />}
            label={t('auth.register')}
            iconPosition="start"
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 0 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('auth.username')}
                value={formData.username}
                onChange={handleInputChange('username')}
                error={!!errors.username}
                helperText={errors.username}
                disabled={loading}
                sx={{ mb: 2 }}
                autoComplete="username"
              />

              {tab === 1 && (
                <TextField
                  fullWidth
                  label={t('auth.email')}
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  sx={{ mb: 2 }}
                  autoComplete="email"
                />
              )}

              <TextField
                fullWidth
                label={t('auth.password')}
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                sx={{ mb: tab === 1 ? 2 : 3 }}
                autoComplete={tab === 0 ? 'current-password' : 'new-password'}
              />

              {tab === 1 && (
                <TextField
                  fullWidth
                  label={t('auth.confirmPassword')}
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={loading}
                  sx={{ mb: 3 }}
                  autoComplete="new-password"
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  },
                }}
              >
                {loading ? (
                  <LoadingSpinner size={24} message="" />
                ) : (
                  tab === 0 ? t('auth.signIn') : t('auth.createAccount')
                )}
              </Button>
            </Box>
          </motion.div>
        </AnimatePresence>

      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;