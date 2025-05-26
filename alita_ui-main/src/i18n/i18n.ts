import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../i18n/languageJSON/en.json';
import fr from '../i18n/languageJSON/fr.json';
import ta from '../i18n/languageJSON/ta.json';
import hi from '../i18n/languageJSON/hi.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        fr: { translation: fr },
        ta: { translation: ta },
        hi: { translation: hi }
    },
    lng: 'en',
    fallbackLng: 'en'
});

export default i18n;
