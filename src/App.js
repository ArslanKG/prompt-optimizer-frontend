import React, { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useOptimizationStore from './store/optimizationStore';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Models from './pages/Models';
import About from './pages/About';
import Chat from './pages/Chat';
import PremiumChat from './pages/PremiumChat';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TranslationProvider } from './contexts/TranslationContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// App Content with routing logic
function AppContent() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
  const { loadInitialData } = useOptimizationStore();
  const { isAuthenticated } = useAuth();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#ec4899',
        light: '#f472b6',
        dark: '#db2777',
      },
      background: {
        default: darkMode ? '#0f172a' : '#ffffff',
        paper: darkMode ? '#1e293b' : '#f8fafc',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            padding: '10px 24px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#1e293b' : '#fff',
            color: darkMode ? '#fff' : '#0f172a',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      />
      <Router>
        <Routes>
          {/* Premium Chat Route - Only for authenticated users */}
          <Route
            path="/premium/chat/:sessionId?"
            element={
              <ProtectedRoute requireAuth={true}>
                <PremiumChat />
              </ProtectedRoute>
            }
          />
          
          {/* Public Routes - Redirect authenticated users to premium chat */}
          <Route
            path="/"
            element={
              <ProtectedRoute redirectIfAuth={true}>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/models"
            element={
              <ProtectedRoute redirectIfAuth={true}>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <Models />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute redirectIfAuth={true}>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <About />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute redirectIfAuth={true}>
                <Chat />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all route - redirect based on auth status */}
          <Route
            path="*"
            element={
              isAuthenticated ?
                <Navigate to="/premium/chat" replace /> :
                <Navigate to="/" replace />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <AppContent />
      </TranslationProvider>
    </AuthProvider>
  );
}

export default App;
