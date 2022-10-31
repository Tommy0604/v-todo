<template>
  <a-config-provider :locale="locale">
    <a-layout>
      <div class="column-left">
        <div class="resize-bar"></div>
        <div class="resize-line"></div>
        <div class="resize-save">
          <a-layout-sider>
            <left-menu></left-menu>
          </a-layout-sider>
        </div>
      </div>
      <a-layout class="column-right">
        <a-layout-header>
          <TodoHeader />
        </a-layout-header>
        <a-layout-content>
          <router-view v-slot="{ Component, route }">
            <transition name="route" mode="out-in" appear>
              <KeepAlive>
                <div class="todo-content" :key="route.name">
                  <component :is="Component" />
                </div>
              </KeepAlive>
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

.resize-bar {
  width: 200px;
  min-width: 62px;
  max-width: 30vw;
  height: inherit;
  resize: horizontal;
  cursor: ew-resize;
  cursor: col-resize;
  opacity: 0;
  overflow: scroll;
}

/* resize line */
.resize-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border-right: 2px solid #eee;
  border-left: 1px solid #fff;
  pointer-events: none;
}

.resize-save {
  display: flex;
  position: absolute;
  top: 0;
  right: 5px;
  bottom: 0;
  left: 0;
  // padding: 16px;
  overflow-x: hidden;

  >.ant-layout-sider {
    flex: auto !important;
    max-width: inherit !important;
    min-width: inherit !important;
    width: 100% !important;
  }

  .ant-menu {
    width: 100% !important;
    border-color: #fff;
  }
}

.resize-bar:hover~.resize-line,
.resize-bar:active~.resize-line {
  border-left: 1px dashed skyblue;
}

.resize-bar::-webkit-scrollbar {
  // width: 200px;
  height: inherit;
}

/* Firefox只有下面一小块区域可以拉伸 */
@supports (-moz-user-select: none) {

  .resize-bar:hover~.resize-line,
  .resize-bar:active~.resize-line {
    border-left: 1px solid #bbb;
  }

  .resize-bar:hover~.resize-line::after,
  .resize-bar:active~.resize-line::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 0;
    right: -8px;
    background-size: 100% 100%;
  }
}
</style>
