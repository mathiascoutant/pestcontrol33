import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";
import esTranslation from "./locales/es.json";

// Configure i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: "fr", // Default language (French)
    debug: process.env.NODE_ENV === "development",
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
