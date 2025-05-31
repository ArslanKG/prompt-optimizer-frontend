import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <Alert 
      severity="error" 
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Tekrar Dene
          </Button>
        )
      }
    >
      <AlertTitle>Hata</AlertTitle>
      {error || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}
    </Alert>
  );
};

export default ErrorMessage;