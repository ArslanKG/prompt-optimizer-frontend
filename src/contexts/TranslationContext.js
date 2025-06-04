import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, defaultLanguage } from '../locales';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || defaultLanguage;
  });

  const [translations, setTranslations] = useState(() => getTranslation(language));

  useEffect(() => {
    setTranslations(getTranslation(language));
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Create t function that can handle nested keys like 'chatSettings.title'
  const t = (key, fallback = key) => {
    if (!key) return fallback;
    
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return fallback;
      }
    }
    
    return typeof result === 'string' || Array.isArray(result) ? result : fallback;
  };

  const value = {
    t,
    language,
    changeLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
