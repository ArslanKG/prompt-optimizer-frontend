// Advanced Session Cache Utility with Storage Management
// Improved localStorage handling with size limits and compression
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const SESSIONS_LIST_KEY = 'arkegu_sessions_list';
const SESSION_PREFIX = 'arkegu_session_';
const MAX_SESSIONS = 15; // Reduced from 20 to prevent storage overflow
const MAX_MESSAGES_PER_SESSION = 25; // Reduced from 30 to prevent storage overflow
const MAX_MESSAGE_LENGTH = 10000; // Maximum characters per message
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB - safe localStorage limit
const COMPRESSION_THRESHOLD = 1000; // Compress messages longer than 1000 chars

/**
 * Get current localStorage usage in bytes
 * @returns {number} Used space in bytes
 */
const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

/**
 * Check if storage has enough space
 * @param {number} requiredSpace - Required space in bytes
 * @returns {boolean} True if enough space available
 */
const hasStorageSpace = (requiredSpace) => {
  const currentSize = getStorageSize();
  return (currentSize + requiredSpace) < MAX_STORAGE_SIZE;
};

/**
 * Clean old data to free up space
 * @param {number} requiredSpace - Space needed in bytes
 */
const freeUpStorage = (requiredSpace) => {
  try {
    const sessions = getSessionsFromCache() || [];
    
    // Sort by timestamp (oldest first)
    const sortedSessions = sessions.sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // Remove oldest sessions until we have enough space
    let freedSpace = 0;
    const sessionsToRemove = [];
    
    for (const session of sortedSessions) {
      const sessionKey = `${SESSION_PREFIX}${session.id}`;
      const sessionData = localStorage.getItem(sessionKey);
      
      if (sessionData) {
        freedSpace += sessionData.length + sessionKey.length;
        sessionsToRemove.push(session.id);
        
        if (freedSpace >= requiredSpace) break;
      }
    }
    
    // Remove the selected sessions
    sessionsToRemove.forEach(sessionId => {
      removeSessionFromCache(sessionId);
    });
    
  } catch (error) {
    console.error('Error freeing up storage:', error);
  }
};

/**
 * Compress large text content
 * @param {string} text - Text to compress
 * @returns {string} Compressed or original text
 */
const compressText = (text) => {
  if (text.length < COMPRESSION_THRESHOLD) return text;
  
  try {
    // Simple compression: replace common patterns
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n\s*\n/g, '\n') // Multiple newlines to single
      .trim();
  } catch (error) {
    return text;
  }
};

/**
 * Truncate message if too long
 * @param {string} content - Message content
 * @returns {string} Truncated content if necessary
 */
const truncateMessage = (content) => {
  if (content.length <= MAX_MESSAGE_LENGTH) return content;
  
  return content.substring(0, MAX_MESSAGE_LENGTH - 100) +
    '\n\n[... Mesaj çok uzun olduğu için kısaltıldı ...]';
};

/**
 * Safe JSON parse with fallback
 * @param {string} jsonString - JSON string to parse
 * @returns {any|null} Parsed object or null on error
 */
const safeJsonParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
};

/**
 * Safe JSON stringify with error handling
 * @param {any} data - Data to stringify
 * @returns {string|null} JSON string or null on error
 */
const safeJsonStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return null;
  }
};

/**
 * Get sessions list from cache (session metadata only, without messages)
 * @returns {Array|null} Sessions array or null if cache is invalid/expired
 */
export const getSessionsFromCache = () => {
  try {
    const cached = localStorage.getItem(SESSIONS_LIST_KEY);
    if (!cached) return null;

    const parsedData = safeJsonParse(cached);
    if (!parsedData) {
      clearAllSessionsCache();
      return null;
    }

    const { data, timestamp } = parsedData;
    const now = Date.now();

    // Check if cache is expired (older than 12 hours)
    if (now - timestamp > CACHE_DURATION) {
      clearAllSessionsCache();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading sessions list cache:', error);
    clearAllSessionsCache();
    return null;
  }
};

/**
 * Save sessions list to cache (only metadata, without messages)
 * @param {Array} sessions - Sessions array to cache
 */
export const saveSessionsToCache = (sessions) => {
  try {
    // Limit to MAX_SESSIONS most recent sessions
    const limitedSessions = sessions.slice(0, MAX_SESSIONS).map(session => ({
      id: session.id,
      title: session.title,
      timestamp: session.timestamp,
      messageCount: session.messageCount || 0
    }));

    const cacheData = {
      data: limitedSessions,
      timestamp: Date.now()
    };
    
    const jsonString = safeJsonStringify(cacheData);
    if (!jsonString) {
      return;
    }
    
    // Check storage space
    const requiredSpace = jsonString.length + SESSIONS_LIST_KEY.length;
    if (!hasStorageSpace(requiredSpace)) {
      freeUpStorage(requiredSpace);
    }
    
    localStorage.setItem(SESSIONS_LIST_KEY, jsonString);
    
    // Clean up old session caches that are not in the new list
    cleanupOldSessionCaches(limitedSessions);
    
  } catch (error) {
    console.error('Error saving sessions list cache:', error);
    
    // If quota exceeded, try emergency cleanup
    if (error.name === 'QuotaExceededError') {
      const currentSessions = getSessionsFromCache() || [];
      if (currentSessions.length > 5) {
        // Keep only 5 most recent sessions
        const emergencySessions = currentSessions.slice(0, 5);
        cleanupOldSessionCaches(emergencySessions);
        
        // Try again with reduced data
        const emergencyData = {
          data: emergencySessions,
          timestamp: Date.now()
        };
        
        const emergencyJson = safeJsonStringify(emergencyData);
        if (emergencyJson) {
          localStorage.setItem(SESSIONS_LIST_KEY, emergencyJson);
        }
      }
    }
  }
};

/**
 * Get individual session with messages from cache
 * @param {string} sessionId - Session ID
 * @returns {Object|null} Session data with messages or null
 */
export const getSessionFromCache = (sessionId) => {
  try {
    if (!sessionId) return null;
    
    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    const cached = localStorage.getItem(sessionKey);
    if (!cached) return null;

    const parsedData = safeJsonParse(cached);
    if (!parsedData) {
      localStorage.removeItem(sessionKey);
      return null;
    }

    const { data, timestamp } = parsedData;
    const now = Date.now();

    // Check if cache is expired
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(sessionKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading session cache:', error);
    // Clean up corrupted session
    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    localStorage.removeItem(sessionKey);
    return null;
  }
};

/**
 * Save individual session with messages to cache
 * @param {string} sessionId - Session ID
 * @param {Object} sessionData - Complete session data including messages
 */
export const saveSessionToCache = (sessionId, sessionData) => {
  try {
    if (!sessionId || !sessionData) return;

    // Process and limit messages
    const processedMessages = sessionData.messages ?
      sessionData.messages
        .slice(-MAX_MESSAGES_PER_SESSION) // Keep latest messages
        .map(message => ({
          ...message,
          content: truncateMessage(compressText(message.content || ''))
        })) : [];

    const limitedSessionData = {
      ...sessionData,
      messages: processedMessages
    };

    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    const cacheData = {
      data: limitedSessionData,
      timestamp: Date.now()
    };

    const jsonString = safeJsonStringify(cacheData);
    if (!jsonString) {
      return;
    }

    // Check storage space
    const requiredSpace = jsonString.length + sessionKey.length;
    if (!hasStorageSpace(requiredSpace)) {
      freeUpStorage(requiredSpace);
    }

    localStorage.setItem(sessionKey, jsonString);
    
  } catch (error) {
    console.error('Error saving session cache for:', sessionId, error);
    
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      
      try {
        // Define sessionKey for emergency save
        const emergencySessionKey = `${SESSION_PREFIX}${sessionId}`;
        
        // Try with minimal data
        const minimalData = {
          id: sessionData.id,
          title: sessionData.title,
          messages: sessionData.messages ?
            sessionData.messages.slice(-5).map(msg => ({
              ...msg,
              content: truncateMessage(msg.content || '').substring(0, 500)
            })) : [],
          timestamp: sessionData.timestamp
        };
        
        const minimalCacheData = {
          data: minimalData,
          timestamp: Date.now()
        };
        
        const minimalJson = safeJsonStringify(minimalCacheData);
        if (minimalJson) {
          localStorage.setItem(emergencySessionKey, minimalJson);
        }
      } catch (emergencyError) {
      }
    }
  }
};

/**
 * Add a new session to cache
 * @param {Object} newSession - New session object
 * @returns {Array|null} Updated sessions list or null on error
 */
export const addSessionToCache = (newSession) => {
  try {
    const cachedSessions = getSessionsFromCache() || [];
    
    // Create session metadata for the list
    const sessionMetadata = {
      id: newSession.id,
      title: newSession.title,
      timestamp: newSession.timestamp,
      messageCount: newSession.messageCount || 0
    };
    
    const updatedSessions = [sessionMetadata, ...cachedSessions];
    
    // Save sessions list
    saveSessionsToCache(updatedSessions);
    
    // Save complete session data separately
    saveSessionToCache(newSession.id, newSession);
    
    return updatedSessions.slice(0, MAX_SESSIONS);
  } catch (error) {
    console.error('Error adding session to cache:', error);
    return null;
  }
};

/**
 * Update an existing session in cache
 * @param {string} sessionId - Session ID to update
 * @param {Object} updates - Updates to apply to the session
 * @returns {Array|null} Updated sessions list or null on error
 */
export const updateSessionInCache = (sessionId, updates) => {
  try {
    const cachedSessions = getSessionsFromCache() || [];
    
    // Update session metadata in the list
    const updatedSessions = cachedSessions.map(session => 
      session.id === sessionId 
        ? { ...session, ...updates, timestamp: new Date() }
        : session
    );
    
    // Save updated sessions list
    saveSessionsToCache(updatedSessions);
    
    // If updates include messages, update the individual session cache
    if (updates.messages !== undefined) {
      const existingSessionData = getSessionFromCache(sessionId) || { 
        id: sessionId, 
        messages: [] 
      };
      
      const updatedSessionData = {
        ...existingSessionData,
        ...updates
      };
      
      saveSessionToCache(sessionId, updatedSessionData);
    }
    
    return updatedSessions;
  } catch (error) {
    console.error('Error updating session in cache:', error);
    return null;
  }
};

/**
 * Add a message to session cache
 * @param {string} sessionId - Session ID
 * @param {Object} message - Message object to add
 * @returns {boolean} Success status
 */
export const addMessageToSessionCache = (sessionId, message) => {
  try {
    if (!sessionId || !message) return false;

    // Process message content
    const processedMessage = {
      ...message,
      content: truncateMessage(compressText(message.content || ''))
    };

    // Get existing session data
    const existingSessionData = getSessionFromCache(sessionId) || {
      id: sessionId,
      title: 'New Chat',
      messages: [],
      timestamp: new Date(),
      messageCount: 0
    };

    // Add new message
    const updatedMessages = [...existingSessionData.messages, processedMessage];
    
    // Update session data
    const updatedSessionData = {
      ...existingSessionData,
      messages: updatedMessages.slice(-MAX_MESSAGES_PER_SESSION), // Keep only latest
      messageCount: updatedMessages.length,
      timestamp: new Date()
    };

    // Check if we can save this session
    const testJson = safeJsonStringify({
      data: updatedSessionData,
      timestamp: Date.now()
    });
    
    if (!testJson) {
      
      // Try with truncated message
      const truncatedMessage = {
        ...processedMessage,
        content: processedMessage.content.substring(0, 1000) + '...[kesik]'
      };
      
      const fallbackMessages = [...existingSessionData.messages, truncatedMessage];
      updatedSessionData.messages = fallbackMessages.slice(-MAX_MESSAGES_PER_SESSION);
    }

    // Save updated session
    saveSessionToCache(sessionId, updatedSessionData);

    // Update session metadata in sessions list
    updateSessionInCache(sessionId, {
      messageCount: updatedSessionData.messageCount,
      timestamp: updatedSessionData.timestamp
    });

    return true;
  } catch (error) {
    console.error('Error adding message to session cache:', error);
    
    // Try emergency save with minimal data
    try {
      const minimalMessage = {
        id: message.id || Date.now().toString(),
        content: (message.content || '').substring(0, 500) + '...',
        isUser: message.isUser || false,
        timestamp: new Date()
      };
      
      const existingData = getSessionFromCache(sessionId) || { messages: [] };
      const minimalData = {
        ...existingData,
        messages: [...(existingData.messages || []), minimalMessage].slice(-5) // Keep only 5 messages
      };
      
      saveSessionToCache(sessionId, minimalData);
      return true;
    } catch (emergencyError) {
      return false;
    }
  }
};

/**
 * Remove a session from cache
 * @param {string} sessionId - Session ID to remove
 * @returns {Array|null} Updated sessions list or null on error
 */
export const removeSessionFromCache = (sessionId) => {
  try {
    if (!sessionId) return null;
    
    // Remove from sessions list
    const cachedSessions = getSessionsFromCache() || [];
    const updatedSessions = cachedSessions.filter(session => session.id !== sessionId);
    saveSessionsToCache(updatedSessions);
    
    // Remove individual session cache
    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    localStorage.removeItem(sessionKey);
    
    return updatedSessions;
  } catch (error) {
    console.error('Error removing session from cache:', error);
    return null;
  }
};

/**
 * Clear all sessions cache
 */
export const clearAllSessionsCache = () => {
  try {
    // Clear sessions list
    localStorage.removeItem(SESSIONS_LIST_KEY);
    
    // Clear all individual session caches
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SESSION_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing all sessions cache:', error);
  }
};

/**
 * Clean up old session caches that are not in current sessions list
 * @param {Array} currentSessions - Current sessions list
 */
const cleanupOldSessionCaches = (currentSessions) => {
  try {
    const currentSessionIds = new Set(currentSessions.map(s => s.id));
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SESSION_PREFIX)) {
        const sessionId = key.replace(SESSION_PREFIX, '');
        if (!currentSessionIds.has(sessionId)) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error cleaning up old session caches:', error);
  }
};

/**
 * Check if cache exists and is valid
 * @returns {boolean} True if cache exists and is valid
 */
export const isCacheValid = () => {
  try {
    const cached = localStorage.getItem(SESSIONS_LIST_KEY);
    if (!cached) return false;

    const { timestamp } = JSON.parse(cached);
    const now = Date.now();

    return (now - timestamp) <= CACHE_DURATION;
  } catch (error) {
    return false;
  }
};

/**
 * Get cache statistics for debugging
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  try {
    const sessions = getSessionsFromCache() || [];
    let totalMessages = 0;
    let cachedSessionsCount = 0;
    
    sessions.forEach(session => {
      const sessionData = getSessionFromCache(session.id);
      if (sessionData) {
        cachedSessionsCount++;
        totalMessages += (sessionData.messages || []).length;
      }
    });
    
    return {
      sessionsInList: sessions.length,
      cachedSessions: cachedSessionsCount,
      totalMessages,
      cacheValid: isCacheValid(),
      maxSessions: MAX_SESSIONS,
      maxMessagesPerSession: MAX_MESSAGES_PER_SESSION
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
};

// Backward compatibility - alias for clearAllSessionsCache
export const clearSessionsCache = clearAllSessionsCache;