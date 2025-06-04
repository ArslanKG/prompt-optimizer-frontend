import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from '../../hooks/useTranslation';

const LoadingSpinner = ({ message }) => {
  const { t } = useTranslation();
  const displayMessage = message || t('common.loading');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {displayMessage}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
