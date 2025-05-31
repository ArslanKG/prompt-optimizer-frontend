import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import Logo from '../Common/Logo';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
          <Logo size={40} />
          <Typography variant="h6" fontWeight="bold">
            Arkegu AI
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Arkegu AI. Built with '}
          <Link color="inherit" href="https://mui.com/">
            Material-UI
          </Link>
          {' and '}
          <Link color="inherit" href="https://reactjs.org/">
            React
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;