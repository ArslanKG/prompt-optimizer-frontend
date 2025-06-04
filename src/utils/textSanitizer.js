import toast from 'react-hot-toast';

/**
 * Sanitizes string for safe JSON serialization by removing problematic Unicode characters
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeStringForJSON = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    // Remove unpaired surrogates that can cause JSON errors
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
    .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
    // Remove control characters except tab, newline, carriage return
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize Unicode to prevent encoding issues
    .normalize('NFC');
};

/**
 * Recursively sanitizes objects for safe JSON serialization
 * @param {*} obj - The object to sanitize
 * @returns {*} - The sanitized object
 */
export const sanitizeObject = (obj) => {
  if (typeof obj === 'string') {
    return sanitizeStringForJSON(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  } else if (obj !== null && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeStringForJSON(key)] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
};

/**
 * Validates text for problematic characters that could cause JSON errors
 * @param {string} text - The text to validate
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
export const validateText = (text) => {
  if (typeof text !== 'string') return { isValid: true, error: null };
  
  // Check for unpaired surrogates
  const hasUnpairedSurrogates = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(text);
  if (hasUnpairedSurrogates) {
    return { 
      isValid: false, 
      error: 'Metin geçersiz emoji veya özel karakterler içeriyor.' 
    };
  }
  
  // Check if text can be properly JSON stringified
  try {
    JSON.stringify(text);
    return { isValid: true, error: null };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Metin JSON formatında gönderilemez. Lütfen özel karakterleri kontrol edin.' 
    };
  }
};

/**
 * Real-time input sanitizer for text fields
 * @param {string} inputValue - The input value to sanitize
 * @param {string} previousValue - The previous value to compare against
 * @param {boolean} showNotification - Whether to show notification on changes
 * @returns {string} - The sanitized value
 */
export const sanitizeInputText = (inputValue, previousValue = '', showNotification = true) => {
  if (typeof inputValue !== 'string') return inputValue;
  
  const sanitized = sanitizeStringForJSON(inputValue);
  
  // If sanitization changed the text and it's not empty, notify user
  if (sanitized !== inputValue && inputValue.length > 0 && showNotification) {
    toast.error('Geçersiz karakterler otomatik olarak temizlendi.', {
      duration: 2000,
      position: 'top-right',
    });
  }
  
  return sanitized;
};

/**
 * Validates and sanitizes text before submission
 * @param {string} text - The text to validate and sanitize
 * @param {boolean} showNotification - Whether to show error notifications
 * @returns {Object} - { isValid: boolean, sanitizedText: string, error: string|null }
 */
export const validateAndSanitizeForSubmission = (text, showNotification = true) => {
  const validation = validateText(text);
  
  if (!validation.isValid) {
    if (showNotification) {
      toast.error(validation.error);
    }
    return {
      isValid: false,
      sanitizedText: sanitizeStringForJSON(text),
      error: validation.error
    };
  }
  
  return {
    isValid: true,
    sanitizedText: text,
    error: null
  };
};

/**
 * Sanitizes form data for safe submission
 * @param {Object} formData - The form data object to sanitize
 * @returns {Object} - The sanitized form data
 */
export const sanitizeFormData = (formData) => {
  return sanitizeObject(formData);
};

/**
 * Checks if text contains potentially problematic characters
 * @param {string} text - The text to check
 * @returns {boolean} - True if text contains problematic characters
 */
export const hasProblematicCharacters = (text) => {
  if (typeof text !== 'string') return false;
  
  // Check for unpaired surrogates
  const hasUnpairedSurrogates = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(text);
  
  // Check for control characters (except allowed ones)
  // eslint-disable-next-line no-control-regex
  const hasControlCharacters = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(text);
  
  return hasUnpairedSurrogates || hasControlCharacters;
};

const textSanitizer = {
  sanitizeStringForJSON,
  sanitizeObject,
  validateText,
  sanitizeInputText,
  validateAndSanitizeForSubmission,
  sanitizeFormData,
  hasProblematicCharacters
};

export default textSanitizer;