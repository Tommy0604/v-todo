import { createI18n } from "vue-i18n";
import en from "./en.json";
import zh from "./zh-cn.json";

enum LANG_VALUE {
  En = 'en',
  Zh = 'zh-cn'
}

const i18n = createI18n({
  legacy: false,
  locale: getLanguage(),
  messages: {
    [LANG_VALUE.Zh]: zh,
    [LANG_VALUE.En]: en
  }
})

function getLanguage() {
  if (typeof window === 'undefined') return;
  const chooseLanguage = localStorage.getItem('Language');
  if (chooseLanguage) return chooseLanguage;

  const language = navigator.language.toLowerCase()
  const locales = [LANG_VALUE.En, LANG_VALUE.Zh]
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return LANG_VALUE.En
}

export {
  i18n,
  LANG_VALUE,
  getLanguage
}