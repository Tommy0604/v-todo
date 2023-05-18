import { defineStore } from "pinia";
import { LANG_VALUE, getLanguage } from "../i18n";

import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import { Todo } from "@/models";

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

const useTodoStore = defineStore('todoStore', {
  state: () => ({
    todo: null as Todo | null
  }),
})

export {
  useI18nStore,
  useTodoStore
}