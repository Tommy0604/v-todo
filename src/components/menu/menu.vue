<template>
  <div id="resizeBar" class="resize-bar"></div>
  <div class="resize-line"></div>
  <div class="resize-save">
    <a-layout-sider :collapsed="collapsed" :trigger="null" collapsible>
      <a-menu
        id="menu"
        :openKeys="state.openKeys"
        :selectedKeys="[$route.path]"
        mode="inline"
        @click="handleClick"
      >
        <a-menu-item key="/myday">
          <template #icon>
            <icon-font type="icon-sun" :style="{ 'font-size': '2rem' }" />
          </template>
          <router-link to="/myday">我的一天</router-link>
        </a-menu-item>
        <a-menu-item key="/plans">
          <template #icon>
            <icon-font type="icon-calendar" :style="{ 'font-size': '2rem' }" />
          </template>
          <router-link to="/plans">计划内</router-link>
        </a-menu-item>
        <a-menu-item key="/completed">
          <template #icon>
            <icon-font type="icon-completed" :style="{ 'font-size': '2rem' }" />
          </template>
          <router-link to="/completed">已完成</router-link>
        </a-menu-item>
        <a-menu-item key="/all">
          <template #icon>
            <icon-font type="icon-all" :style="{ 'font-size': '2rem' }" />
          </template>
          <router-link to="/all">全部</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </div>
  <!-- 展开菜单按按钮 -->
  <div id="collapsed" class="collapsed">
    <a-button primary @click="toggleCollapsed">
      <MenuUnfoldOutlined v-if="collapsed" />
      <MenuFoldOutlined v-else />
    </a-button>
  </div>
</template>

<script lang="ts">
export default {
  name: "LeftMenu",
};
</script>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { IconFont } from "../../shared";

let collapsed = ref(false);
let oldBarWidth = ref<number>();
const state = reactive({
  openKeys: [],
  preOpenKeys: [],
});

const handleClick = (e) => {
  // console.log("click ================> ", e);
};
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  state.openKeys = collapsed.value ? [] : state.preOpenKeys;

  let eleResizeBar = document.getElementById("resizeBar");

  if (eleResizeBar) {
    eleResizeBar.style.width = !collapsed.value
      ? `${oldBarWidth.value}px`
      : "62px";
  }
};
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);

onMounted(() => {
  let eleResizeBar = document.querySelector("#resizeBar");
  let eleCollapsed = document.getElementById("collapsed");

  function handleBarWidthChange() {
    requestAnimationFrame(() => {
      if (eleCollapsed && eleResizeBar) {
        const leftOffset = eleResizeBar.clientWidth;
        // Record the menu width when the menu is put away
        !collapsed.value && (oldBarWidth.value = leftOffset + 16);

        eleCollapsed.style.left = `${leftOffset}px`;
      }
    });
  }
  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      handleBarWidthChange();
    }
  });

  eleResizeBar && observer.observe(eleResizeBar);
});
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.ant-layout {
  height: 100%;
}

::v-deep() {
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item {
    padding: 0 calc(50% - 10px);
  }
}

.collapsed {
  position: absolute;
  top: calc(50% - 15px);
  transition: top 1s ease-in-out;
  > .ant-btn {
    padding: 4px 8px;
    border-radius: 50%;
    border: 0;
    box-shadow: -10px 0px 10px rgba(255, 255, 255, 1),
      4px 0px 17px rgb(0, 0, 0, 15%);
  }
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
  transition: width 0.6s, min-width 1s ease-in-out, max-width 1s ease-in-out;
}

@media only screen and (min-width: 992px) {
  .resize-bar {
    min-width: 66px;
    max-width: 30vw;
  }
}

.resize-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-save {
  display: flex;
  position: absolute;
  top: 0;
  right: 2px;
  bottom: 0;
  left: 0;
  overflow-x: hidden;

  > .ant-layout-sider {
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

.resize-bar:hover ~ .resize-line,
.resize-bar:active ~ .resize-line {
  border-left: 1px dashed var(--ant-primary-color);
}

.resize-bar::-webkit-scrollbar {
  height: inherit;
}

/* Firefox has only the following small area to stretch */
@supports (-moz-user-select: none) {
  .resize-bar:hover ~ .resize-line,
  .resize-bar:active ~ .resize-line {
    border-left: 1px solid #bbb;
  }

  .resize-bar:hover ~ .resize-line::after,
  .resize-bar:active ~ .resize-line::after {
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
