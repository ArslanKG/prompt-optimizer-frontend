import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import arkeguLogo from '../../assets/arkegu-logo.png';

const Logo = ({ size = 40, animate = false }) => {
  const logoElement = (
    <Box
      component="img"
      src={arkeguLogo}
      alt="Arkegu AI"
      sx={{
        height: size,
        width: 'auto',
        objectFit: 'contain',
      }}
    />
  );

  if (animate) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {logoElement}
      </motion.div>
    );
  }

  return logoElement;
};

export default Logo;