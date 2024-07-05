import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { En_Str } from "./en_str";
import { Es_Str } from "./es_str";
import { It_Str } from "./it_str";

i18n.use(initReactI18next).init({
    lng: localStorage.getItem('langCode') ? localStorage.getItem('langCode') : 'en',
    fallbackLng: localStorage.getItem('langCode') ? localStorage.getItem('langCode') : 'en',
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: En_Str,
        },
        es: {
            translation: Es_Str,
        },
        it: {
            translation: It_Str,
        },
    },
});

export default i18n;