<template>
  <a-config-provider :locale="locale">
    <a-layout>
      <menu class="column-left">
        <left-menu></left-menu>
      </menu>
      <a-layout class="column-right">
        <router-view v-slot="{ Component, route }">
          <KeepAlive>
            <component :is="Component" :key="route.name" />
          </KeepAlive>
        </router-view>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { LeftMenu } from "@/layout";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

import { storeToRefs } from "pinia";
import { useI18nStore } from "./hooks/useStores";

const i18nStore = useI18nStore();
const { locale, language } = storeToRefs(i18nStore);

watch(language, (val) => {
  dayjs.locale(val);
});
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.ant-layout-sider-children {
  display: flex;
}

.column-left {
  background-color: #fff;
  position: relative;
  float: left;
  height: 100vh;
}

.column-right {
  background-color: #eee;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
