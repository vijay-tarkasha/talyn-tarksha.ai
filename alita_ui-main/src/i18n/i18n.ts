import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../i18n/languageJSON/en.json';
// import fr from '../i18n/languageJSON/fr.json';
import ta from '../i18n/languageJSON/ta.json';
import hi from '../i18n/languageJSON/hi.json';
import te from '../i18n/languageJSON/te.json';
import ma from '../i18n/languageJSON/ma.json';
import ka from '../i18n/languageJSON/ka.json';
import mar from '../i18n/languageJSON/mar.json';
import gu from '../i18n/languageJSON/gu.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        // fr: { translation: fr },
        ta: { translation: ta },
        hi: { translation: hi },
        te: { translation: te }, 
        ma: { translation: ma } ,
        ka: { translation: ka } ,
        mar: { translation: mar } ,
        gu: { translation: gu } ,
    },
    lng: 'en',
    fallbackLng: 'en'
});

export default i18n;
