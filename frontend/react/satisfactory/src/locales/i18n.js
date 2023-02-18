import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend"; // adding lazy loading for translations, more information here: https://github.com/i18next/i18next-http-backend
// import { en } from "./translations/en";
// import { de } from "./translations/de";
// import { es } from "./translations/es";
// import { nl } from "./translations/nl";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    //supportedLngs: ["en", "de"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // locale files path
    },
    ns: ["dashboard", "satisfactory"],
    lng: "en",
    defaultNS: "common",
    fallbackLng: ["en"],
    supportedLngs: ["en", "nl", "es", "de"],
  });

// i18n.use(initReactI18next).init({
//   resources: {
//     en: { translation: en },
//     de: { translation: de },
//     nl: { translation: nl },
//     es: { translation: es },
//   },
//   lng: "en",
//   fallbackLng: "en",
//   interpolation: {
//     escapeValue: false,
//   },
// });
