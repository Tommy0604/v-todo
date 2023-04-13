<template>
  <a-config-provider :locale="locale">
    <a-layout>
      <div class="column-left">
        <left-menu></left-menu>
      </div>
      <a-layout class="column-right">
        <a-layout-header>
          <TodoHeader />
        </a-layout-header>
        <a-layout-content>
          <router-view v-slot="{ Component, route }">
            <transition name="route" mode="out-in" appear>
              <div class="todo-content" :key="route.name">
                <KeepAlive>
                  <component :is="Component" />
                </KeepAlive>
              </div>
            </transition>
          </router-view>
        </a-layout-content>
        <TodoFooter />
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import LeftMenu from "./components/menu/menu.vue";
import TodoHeader from "./components/header/header.vue";
import TodoFooter from "./components/footer/footer.vue";

import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

const locale = zhCN;
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

.todo-content {
  margin: 0 24px;
}

</style>
