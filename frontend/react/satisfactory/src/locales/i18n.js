import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./translations/en";
import { de } from "./translations/de";
import { es } from "./translations/es";
import { nl } from "./translations/nl";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    nl: { translation: nl },
    es: { translation: es },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
