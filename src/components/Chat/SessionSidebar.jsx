import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Drawer,
  Button,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Chat as ChatIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '../../hooks/useTranslation';

const SessionSidebar = ({ 
  open, 
  onClose, 
  activeSessionId, 
  onSessionSelect, 
  onNewSession,
  width = 320 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, deleteSession } = useAuth();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (isAuthenticated && open) {
      loadSessions();
    }
  }, [isAuthenticated, open]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionApi.getSessions(20); // Get last 20 sessions
      
      // Handle new API response format
      if (Array.isArray(data)) {
        setSessions(data);
      } else if (data && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load chat sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, session) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedSession(session);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSession(null);
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    
    try {
      setLoading(true);
      await deleteSession(selectedSession.sessionId);
      
      // Remove from local state immediately
      setSessions(prev => prev.filter(s => s.sessionId !== selectedSession.sessionId));
      
      // If deleted session was active, trigger new session
      if (selectedSession.sessionId === activeSessionId) {
        onNewSession();
      }
      
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const formatLastActivity = (timestamp) => {
    try {
      if (!timestamp) return 'Unknown';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Unknown';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  const truncateTitle = (title, maxLength = 25) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const sidebarContent = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Clean Header - ChatGPT Style */}
      <Box sx={{ p: 3, pb: 2 }}>
        {/* Premium New Chat Button */}
        <Box
          onClick={onNewSession}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            p: 2.5,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d1d5db'}`,
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? '#21262d' : '#f3f4f6',
            },
          }}
        >
          <AddIcon sx={{
            fontSize: 16,
            color: theme.palette.mode === 'dark' ? '#f0f6fc' : theme.palette.text.primary
          }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.mode === 'dark' ? '#f0f6fc' : theme.palette.text.primary,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            }}
          >
            {t('sessions.newChat')}
          </Typography>
        </Box>
      </Box>

      {/* Clean Sessions List - ChatGPT Style */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          pb: 2,
          // Minimal scrollbar
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.mode === 'dark' ? '#30363d' : '#d1d5db',
            borderRadius: '2px',
          },
        }}
      >
        {!isAuthenticated ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: 48,
                color: theme.palette.mode === 'dark' ? '#7d8590' : theme.palette.text.secondary,
                opacity: 0.5,
                mb: 2
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
              }}
            >
              {t('sessions.signInToSave')}
            </Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner message={t('sessions.loadingSessions')} />
          </Box>
        ) : sessions.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
            }}
          >
            <ChatIcon
              sx={{
                fontSize: 48,
                color: theme.palette.mode === 'dark' ? '#7d8590' : theme.palette.text.secondary,
                opacity: 0.5,
                mb: 2
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === 'dark' ? '#7d8590' : theme.palette.text.secondary,
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
              }}
            >
              {t('sessions.noSessions')}
            </Typography>
          </Box>
        ) : (
          <Box>
            {sessions.map((session) => {
              // Handle both old and new session object formats
              const sessionId = session.sessionId || session.id;
              const sessionTitle = session.title || `Chat ${new Date(session.createdAt || session.timestamp || Date.now()).toLocaleDateString()}`;
              const lastActivity = session.lastActivityAt || session.timestamp || session.createdAt;
              const messageCount = session.messageCount || session.messages?.length || 0;
              
              return (
                <Box
                  key={sessionId}
                  className="session-item"
                  onClick={() => onSessionSelect(sessionId)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    p: 2.5,
                    mb: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    bgcolor: sessionId === activeSessionId
                      ? theme.palette.mode === 'dark' ? '#21262d' : '#f3f4f6'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? '#30363d' : '#f3f4f6',
                      '& .MuiIconButton-root': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <ChatIcon sx={{
                    fontSize: 16,
                    color: theme.palette.mode === 'dark' ? '#7d8590' : theme.palette.text.secondary,
                    flexShrink: 0,
                  }} />
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: sessionId === activeSessionId ? 600 : 400,
                        fontFamily: 'Inter, sans-serif',
                        color: theme.palette.mode === 'dark' ? '#f0f6fc' : theme.palette.text.primary,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {truncateTitle(sessionTitle, 25)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.mode === 'dark' ? '#7d8590' : theme.palette.text.secondary,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                        }}
                      >
                        {formatLastActivity(lastActivity)}
                      </Typography>
                      {messageCount > 0 && (
                        <>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.mode === 'dark' ? '#7d8590' : theme.palette.text.secondary,
                              fontSize: '0.75rem',
                            }}
                          >
                            •
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.mode === 'dark' ? '#7d8590' : theme.palette.text.secondary,
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.75rem',
                            }}
                          >
                            {messageCount} msg
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, { ...session, sessionId });
                    }}
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '$parent:hover &': { opacity: 1 },
                      '.session-item:hover &': { opacity: 1 },
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>


      {/* Simple Clean Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? '#2f2f2f' : '#ffffff',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#4f4f4f' : '#e5e7eb'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? '#3f3f3f' : '#f3f4f6',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={handleDeleteSession}
          sx={{
            color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626',
            fontWeight: 500,
          }}
        >
          <DeleteIcon sx={{ mr: 1.5, fontSize: 18 }} />
          {t('sessions.deleteSession')}
        </MenuItem>
      </Menu>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: theme.palette.mode === 'dark' ? '#171717' : '#f7f7f8',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
};

export default SessionSidebar;