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
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  GitHub as GitHubIcon,
  Menu as MenuIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  ModelTraining as ModelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../Common/Logo';
import { useTranslation } from '../../hooks/useTranslation';

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
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

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

  const navItems = [
    { label: t.navigation.home, path: '/', icon: <AutoAwesomeIcon /> },
    { label: t.navigation.chat, path: '/chat', icon: <AutoAwesomeIcon /> },
    { label: t.navigation.models, path: '/models', icon: <ModelIcon /> },
    { label: t.navigation.about, path: '/about', icon: <SpeedIcon /> },
  ];

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: 'blur(20px)',
          backgroundColor: scrolled
            ? theme.palette.mode === 'dark'
              ? 'rgba(15, 23, 42, 0.8)'
              : 'rgba(255, 255, 255, 0.8)'
            : 'transparent',
          borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : 'none',
          transition: 'all 0.3s ease-in-out',
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
                  {t.home.title}
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
                      '&:hover': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  ml: 1,
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
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
