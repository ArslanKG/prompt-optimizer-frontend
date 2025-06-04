import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Container,
  useTheme,
  useScrollTrigger,
  Slide,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  GitHub as GitHubIcon,
  Menu as MenuIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  ModelTraining as ModelIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Common/Logo';
import { useTranslation } from '../../contexts/TranslationContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';
import trFlag from '../../assets/tr.png';
import enFlag from '../../assets/en.png';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, changeLanguage } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogin = () => {
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'tr' ? 'en' : 'tr';
    changeLanguage(newLanguage);
  };

  const navItems = [
    { label: t('navigation.home'), path: '/', icon: <AutoAwesomeIcon /> },
    { label: t('navigation.chat'), path: '/chat', icon: <AutoAwesomeIcon /> },
    { label: t('navigation.models'), path: '/models', icon: <ModelIcon /> },
    { label: t('navigation.about'), path: '/about', icon: <SpeedIcon /> },
  ];

  // Don't show header on premium chat page (it has its own header)
  if (location.pathname === '/premium/chat') {
    return null;
  }

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: 'blur(30px)',
          background: scrolled
            ? theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
              : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
            : theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
          borderBottom: scrolled
            ? `1px solid ${theme.palette.mode === 'dark' ? 'rgba(110, 97, 204, 0.1)' : 'rgba(110, 97, 204, 0.08)'}`
            : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: scrolled
            ? theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)'
            : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 1,
                }}
                onClick={() => navigate('/')}
              >
                <Logo size={50} animate />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  {t('home.title')}
                </Typography>
              </Box>
            </motion.div>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Button
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                      px: 2.5,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      background: 'transparent',
                      border: `1px solid transparent`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(110, 97, 204, 0.15)'
                          : 'rgba(110, 97, 204, 0.08)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(110, 97, 204, 0.3)' : 'rgba(110, 97, 204, 0.2)'}`,
                        color: '#6E61CC',
                        transform: 'translateY(-1px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 8px 25px rgba(110, 97, 204, 0.2)'
                          : '0 8px 25px rgba(110, 97, 204, 0.15)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <Tooltip title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}>
                <IconButton
                  onClick={handleLanguageToggle}
                  sx={{
                    ml: 1,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={language === 'tr' ? trFlag : enFlag}
                      alt={language === 'tr' ? 'Turkish' : 'English'}
                      style={{
                        width: 40,
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                </IconButton>
              </Tooltip>

              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <IconButton
                href="https://github.com/ArslanKG"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    background: '#333',
                    color: 'white',
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Authentication */}
              {isAuthenticated ? (
                <Tooltip title={user?.username || 'User'}>
                  <IconButton
                    onClick={handleUserMenu}
                    sx={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      },
                    }}
                  >
                    <Avatar sx={{ width: 28, height: 28 }}>
                      {user?.username?.charAt(0).toUpperCase() || <PersonIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {t('auth.signIn')}
                </Button>
              )}
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      handleClose();
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.icon}
                      {item.label}
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleLanguageToggle}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={language === 'tr' ? enFlag : trFlag}
                      alt={language === 'tr' ? 'Switch to English' : 'Switch to Turkish'}
                      style={{
                        width: 20,
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    />
                    {language === 'tr' ? 'English' : 'Türkçe'}
                  </Box>
                </MenuItem>
                <MenuItem onClick={toggleDarkMode}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    {darkMode ? 'Light Theme' : 'Dark Theme'}
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              minWidth: 200,
              mt: 1,
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            {t('auth.signOut')}
          </MenuItem>
        </Menu>

        {/* Auth Modal */}
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
