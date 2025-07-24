import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import trCommon from "@/locales/tr/common.json";
import enCommon from "@/locales/en/common.json";
import deCommon from "@/locales/de/common.json";

// Translation resources
const resources = {
  tr: {
    common: trCommon,
  },
  en: {
    common: enCommon,
  },
  de: {
    common: deCommon,
  },
};

// Language configuration
export const languages = [
  {
    code: "tr",
    name: "Türkçe",
    flag: "🇹🇷",
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "de",
    name: "Deutsch",
    flag: "🇩🇪",
  },
];

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr", // Turkish as default/fallback language
    defaultNS: "common",
    ns: ["common"],

    detection: {
      // Language detection options
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense for better control
    },
  });

export default i18n;
