import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import translationsPL from '../translations/pl.json';

i18n.use(reactI18nextModule).init({
  debug: true,
  lng: 'pl',
  resources: {
    pl: {
      translation: translationsPL
    }
  },
  react: {
    wait: false,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    nsMode: 'default'
  }
});

export default i18n;
