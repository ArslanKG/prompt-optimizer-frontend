// Basit Premium Chat Hata Logger
const logPremiumChatError = (errorType, error, context = {}) => {
  const timestamp = new Date().toISOString();
  const userId = localStorage.getItem('user_id') || 'unknown';
  const sessionId = context.sessionId || 'unknown';
  
  const errorLog = {
    timestamp,
    errorType,
    userId,
    sessionId,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context,
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  // Console'a detaylı log
  console.group(`🚨 Premium Chat Error - ${errorType}`);
  console.error('Timestamp:', timestamp);
  console.error('User ID:', userId);
  console.error('Session ID:', sessionId);
  console.error('Error:', error);
  console.error('Context:', context);
  console.groupEnd();

  // Local storage'a da kaydet (son 50 hatayı tut)
  try {
    const existingLogs = JSON.parse(localStorage.getItem('premium_chat_errors') || '[]');
    existingLogs.push(errorLog);
    
    // Son 50 hatayı tut
    if (existingLogs.length > 50) {
      existingLogs.splice(0, existingLogs.length - 50);
    }
    
    localStorage.setItem('premium_chat_errors', JSON.stringify(existingLogs));
  } catch (storageError) {
    console.error('Error saving to localStorage:', storageError);
  }

  return errorLog;
};

// Hata tiplerini export et
export const ERROR_TYPES = {
  SESSION_LOAD: 'SESSION_LOAD_ERROR',
  MESSAGE_SEND: 'MESSAGE_SEND_ERROR',
  API_CALL: 'API_CALL_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  SETTINGS_ERROR: 'SETTINGS_ERROR'
};

export default logPremiumChatError;