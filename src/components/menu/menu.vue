<template>
  <a-menu id="dddddd" :openKeys="openKeys" :selectedKeys="[$route.path]" mode="inline" @click="handleClick">
    <!-- mode="vertical" -->
    <!-- 展开菜单按按钮 -->
    <!-- <div>
      <a-button
        type="primary"
        style="margin-bottom: 16px"
        @click="toggleCollapsed"
      >
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
    </div> -->
    <a-menu-item key="/myday">
      <template #icon>
        <!-- <smile-outlined :style="{fontSize: '18px'}"/> -->
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
</template>

<script lang="ts">
export default {
  name: "LeftMenu",
};
</script>
<script setup lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import {
  SmileOutlined,
  TableOutlined,
  CheckCircleOutlined,
  FireOutlined
} from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import { IconFont } from "../../shared";

let collapsed = ref(false);
let selectedKeys = ref<string[]>([]);
let openKeys = ref<string[]>([]);
const handleClick = (e) => {
  // console.log("click ================> ", e);
};
const titleClick = (e: Event) => {
  // console.log("titleClick", e);
};
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  openKeys.value = collapsed.value ? [] : ["sub1"];
};
watch(
  () => openKeys,
  (val) => {
  }
);

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

.icon-font {
  font-size: 2rem;
}
</style>
