import { defineStore } from "pinia";
import { LANG_VALUE, getLanguage } from "../i18n";

import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";

const useI18nStore = defineStore('i18nStore', {
  state: () => ({
    language: getLanguage()
  }),
  getters: {
    locale(state) {
      switch (state.language) {
        case LANG_VALUE.En:
          return enUS
        case LANG_VALUE.Zh:
          return zhCN
        default: zhCN
          break
      }
    },
  }
})

export {
  useI18nStore
}