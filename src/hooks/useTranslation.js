import { useState, useEffect } from 'react';
import { getTranslation, defaultLanguage } from '../locales';

export const useTranslation = () => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or use default
    return localStorage.getItem('language') || defaultLanguage;
  });

  const [t, setT] = useState(() => getTranslation(language));

  useEffect(() => {
    // Update translation when language changes
    setT(getTranslation(language));
    // Save language preference
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return { t, language, changeLanguage };
};
