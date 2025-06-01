import { tr } from './tr';
import { en } from './en';

export const translations = {
  tr,
  en,
};

export const defaultLanguage = 'tr';

export const getTranslation = (language = defaultLanguage) => {
  return translations[language] || translations[defaultLanguage];
};
