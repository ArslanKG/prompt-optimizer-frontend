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

  const [t, setT] = useState(() => getTranslation(language));

  useEffect(() => {
    setT(getTranslation(language));
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
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
