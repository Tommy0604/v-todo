import { LANG_VALUE, i18n } from "../i18n";
import { useI18nStore } from "./useStores";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import { ComputedRef, computed } from "vue";

export function setLocale(lang: LANG_VALUE) {
  const i18nStore = useI18nStore()
  const { language } = storeToRefs(i18nStore)

  i18n.global.locale.value = lang
  language.value = lang
  localStorage.setItem('Language', lang)
}

export function i18nDayjs(date?: string | number | dayjs.Dayjs | Date | null | undefined): dayjs.Dayjs {
  const i18nStore = useI18nStore();
  const _dayjs = date ? dayjs(date) : dayjs();
  return computed(() => _dayjs.locale(i18nStore.language || 'zh-cn')).value;
}