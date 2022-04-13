import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import translationRU from "./locales/ru";
import translationKG from "./locales/kg";
import { isDevMode } from "../common/utils";

// locales
// const ru_locale = require('./locales/ru');
// const en_locale = require('./locales/en');
// const kg_locale= require('./locales/kg');

i18n.use(reactI18nextModule).init({
  lng: "ru",
  fallbackLng: "ru",
  resources: {
    ru: {
      translation: translationRU
    },
    kg: {
      translation: translationKG
    }
  },
  keySeparator: false,
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  },
  debug: false //isDevMode()
});
export default i18n;
