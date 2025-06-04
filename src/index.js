import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

// Suppress ResizeObserver errors that are not critical
const resizeObserverErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    // This is a known issue and can be safely ignored
    return true;
  }
  return false;
};


// Global error handler for unhandled promise rejections and other errors
window.addEventListener('error', (event) => {
  if (resizeObserverErrorHandler(event.error)) {
    event.preventDefault();
    return;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && resizeObserverErrorHandler(event.reason)) {
    event.preventDefault();
    return;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// reportWebVitals(); // Disabled to prevent external analytics calls
