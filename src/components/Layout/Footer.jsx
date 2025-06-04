import React from 'react';
import { Box, Container, Typography, Link, IconButton, Divider } from '@mui/material';
import { GitHub, LinkedIn, Email, LocationOn } from '@mui/icons-material';
import Logo from '../Common/Logo';
import { useTranslation } from '../../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #21262d 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        color: (theme) => theme.palette.mode === 'dark' ? '#f0f6fc' : '#1e293b',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, transparent, #667eea, transparent)'
              : 'linear-gradient(90deg, transparent, #6366f1, transparent)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Main Footer Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
          {/* Brand Section */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Logo size={48} animate />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('home.title')}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              {t('home.description')}
            </Typography>
            
            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'rgba(0, 119, 181, 0.1)',
                  },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ flex: 0, minWidth: 200 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('footer.contact')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  info@arkegu.ai
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Eskişehir, Türkiye
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'rgba(102, 126, 234, 0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {t('home.title')}. {t('footer.copyright')}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('footer.builtWith')}
            </Typography>
            <Link
              href="https://reactjs.org/"
              color="text.secondary"
              underline="none"
              sx={{
                '&:hover': { color: 'text.primary' },
              }}
            >
              React
            </Link>
            <Typography variant="body2" color="text.secondary">
              {t('footer.and')}
            </Typography>
            <Link
              href="https://mui.com/"
              color="text.secondary"
              underline="none"
              sx={{
                '&:hover': { color: 'text.primary' },
              }}
            >
              Material-UI
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
