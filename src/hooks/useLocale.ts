import { LANG_VALUE, i18n } from "../i18n";

export function setLocale(lang: LANG_VALUE) {
  localStorage.setItem('Language', lang);
  i18n.global.locale.value = lang;
}