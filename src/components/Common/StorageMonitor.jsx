import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { getCacheStats, clearAllSessionsCache } from '../../utils/sessionCache';
import toast from 'react-hot-toast';

const StorageMonitor = ({ onStorageCleared }) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState(null);
  const [storageUsage, setStorageUsage] = useState(0);

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const updateStats = () => {
      const cacheStats = getCacheStats();
      const currentUsage = getStorageSize();
      setStats(cacheStats);
      setStorageUsage(currentUsage);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClearStorage = () => {
    try {
      clearAllSessionsCache();
      // Update stats after clearing
      const cacheStats = getCacheStats();
      const currentUsage = getStorageSize();
      setStats(cacheStats);
      setStorageUsage(currentUsage);
      
      toast.success('Tüm session verileri temizlendi!');
      onStorageCleared?.();
      setOpen(false);
    } catch (error) {
      toast.error('Veri temizlenirken hata oluştu');
    }
  };

  const getStorageWarningLevel = () => {
    const maxSize = 4 * 1024 * 1024; // 4MB
    const percentage = (storageUsage / maxSize) * 100;
    
    if (percentage > 90) return 'critical';
    if (percentage > 75) return 'warning';
    return 'normal';
  };

  const warningLevel = getStorageWarningLevel();
  const maxSize = 4 * 1024 * 1024; // 4MB
  const usagePercentage = (storageUsage / maxSize) * 100;

  return (
    <>
      {/* Storage Status Indicator */}
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            color: warningLevel === 'critical' ? '#ff5722' : 
                   warningLevel === 'warning' ? '#ff9800' : '#4caf50',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {warningLevel !== 'normal' ? <WarningIcon /> : <StorageIcon />}
        </IconButton>
        
        {warningLevel !== 'normal' && (
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              backgroundColor: warningLevel === 'critical' ? '#ff5722' : '#ff9800',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </Box>

      {/* Storage Monitor Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageIcon />
            <Typography variant="h6">Depolama Yöneticisi</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Storage Usage Overview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Depolama Kullanımı
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(usagePercentage, 100)}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: warningLevel === 'critical' ? '#ff5722' : 
                                   warningLevel === 'warning' ? '#ff9800' : '#4caf50',
                  },
                }}
              />
              <Typography variant="body2" sx={{ minWidth: 60 }}>
                {usagePercentage.toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary">
              {formatBytes(storageUsage)} / {formatBytes(maxSize)} kullanılıyor
            </Typography>
          </Box>

          {/* Warning Messages */}
          {warningLevel === 'critical' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <strong>Kritik:</strong> Depolama alanı dolmak üzere! Eski veriler temizlenmelidir.
            </Alert>
          )}
          {warningLevel === 'warning' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <strong>Uyarı:</strong> Depolama alanının %75'i dolu. Yakında temizlik gerekebilir.
            </Alert>
          )}

          {/* Cache Statistics */}
          {stats && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 1,
                  cursor: 'pointer' 
                }}
                onClick={() => setExpanded(!expanded)}
              >
                <Typography variant="subtitle2">Cache İstatistikleri</Typography>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
              
              <Collapse in={expanded}>
                <Box sx={{ pl: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${stats.sessionsInList} Session`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${stats.cachedSessions} Cache'li`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${stats.totalMessages} Mesaj`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                    Maksimum: {stats.maxSessions} session, {stats.maxMessagesPerSession} mesaj/session
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary">
                    Cache Durumu: {stats.cacheValid ? '✅ Geçerli' : '❌ Süresi Dolmuş'}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          )}

          {/* Recommendations */}
          <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              💡 Öneriler:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '12px', lineHeight: 1.4 }}>
              • Uzun konuşmalar otomatik olarak kısaltılır<br/>
              • Eski session'lar otomatik temizlenir<br/>
              • Kritik durumlarda acil veri tasarrufu aktif olur<br/>
              • Her mesaj sıkıştırılarak saklanır
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Kapat
          </Button>
          <Button
            onClick={handleClearStorage}
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            disabled={!stats || stats.sessionsInList === 0}
          >
            Tümünü Temizle
          </Button>
        </DialogActions>
      </Dialog>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default StorageMonitor;