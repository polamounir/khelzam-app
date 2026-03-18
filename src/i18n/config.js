import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Handle RTL/LTR document direction
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng.startsWith('ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Initialize direction on load
const currentLng = i18n.language || 'ar';
document.documentElement.dir = currentLng.startsWith('ar') ? 'rtl' : 'ltr';
document.documentElement.lang = currentLng;

export default i18n;
