<template>
  <a-layout-header>
    <TodoHeader :isSort="isSort" @onSort="onSort" />
  </a-layout-header>
  <a-layout-content>
    <todo-list :isSort="isSort"></todo-list>
  </a-layout-content>
  <TodoFooter />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TodoHeader, TodoFooter } from "@/layout";
import { TodoList } from "@/components";
import { onBeforeRouteLeave } from "vue-router";

let isSort = ref(false);
const onSort = () => isSort.value = !isSort.value;
onBeforeRouteLeave(() => {
  isSort.value = false;
})
</script>
