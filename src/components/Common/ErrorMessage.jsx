import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useTranslation } from '../../hooks/useTranslation';

const ErrorMessage = ({ error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <Alert 
      severity="error" 
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            {t('common.refresh')}
          </Button>
        )
      }
    >
      <AlertTitle>{t('common.error')}</AlertTitle>
      {error || t('errors.general')}
    </Alert>
  );
};

export default ErrorMessage;
