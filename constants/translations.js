import i18n from 'i18next';
import { initReactI18next, useTranslation as useReactI18nextTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getItem, setItem } from '../store/storage';
import en from '../translations/en.json';
import el from '../translations/el.json';

const languageDetector = {
  type: 'languageDetector',
  async: false,
  detect: () => {
    try {
      // First check saved language
      const savedLanguage = getItem('selectedLanguage');
      if (savedLanguage && ['en', 'el'].includes(savedLanguage)) {
        console.log('Found saved language:', savedLanguage);
        return savedLanguage;
      }
      
      // Get device locale
      const deviceLocale = Localization.locale;
      console.log('Device locale full:', deviceLocale);
      
      // Extract language code
      let deviceLanguage = 'en'; // default
      if (deviceLocale) {
        if (deviceLocale.startsWith('el')) {
          deviceLanguage = 'el';
        } else if (deviceLocale.startsWith('en')) {
          deviceLanguage = 'en';
        }
      }
      
      console.log('Detected device language:', deviceLanguage);
      
      // Save the detected language
      setItem('selectedLanguage', deviceLanguage);
      return deviceLanguage;
    } catch (error) {
      console.log('Error detecting language:', error);
      return 'en';
    }
  },
  init: () => {
    console.log('Language detector initialized');
  },
  cacheUserLanguage: (language) => {
    try {
      console.log('Caching language:', language);
      setItem('selectedLanguage', language);
    } catch (error) {
      console.log('Error caching language:', error);
    }
  }
};

// Clear any existing instance and initialize fresh
if (i18n.isInitialized) {
  console.log('i18next already initialized, creating new instance');
}

const initializeI18n = () => {
  return i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { 
          translation: en 
        },
        el: { 
          translation: el 
        }
      },
      fallbackLng: 'en',
      debug: __DEV__,
      
      // Language detection options
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage']
      },
      
      interpolation: {
        escapeValue: false
      },

      react: {
        useSuspense: false
      }
    });
};

// Initialize only once
let initPromise;
if (!i18n.isInitialized) {
  initPromise = initializeI18n().then(() => {
    console.log('i18next initialized successfully with language:', i18n.language);
    return i18n;
  });
} else {
  initPromise = Promise.resolve(i18n);
}

export const useTranslation = () => {
  const result = useReactI18nextTranslation();
  
  const changeLanguage = async (languageCode) => {
    console.log('Changing language to:', languageCode);
    try {
      await result.i18n.changeLanguage(languageCode);
      setItem('selectedLanguage', languageCode);
      console.log('Language changed successfully to:', languageCode);
    } catch (error) {
      console.log('Error changing language:', error);
    }
  };

  const getCurrentLanguage = () => {
    return result.i18n.language || 'en';
  };

  const getSupportedLanguages = () => {
    return ['en', 'el'];
  };

  const getLanguageName = (code) => {
    const names = {
      en: 'English',
      el: 'Ελληνικά'
    };
    return names[code] || code;
  };

  return {
    ...result,
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    getSupportedLanguages,
    getLanguageName
  };
};

export default i18n;