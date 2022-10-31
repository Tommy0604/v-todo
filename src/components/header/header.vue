<template>
  <div class="toolbar-top" :class="todayHint && 'with-subline'">
    <div class="toolbar-headline">
      <div class="toolbar-title">
        <h2 class="listTitle">
          <icon-font v-if="iconType" :type="iconType" class="listTitle-icon" />
          <span>{{ title }}</span>
        </h2>
      </div>
      <div class="toolbar-subline" v-if="todayHint">
        <span class="todayDateHint">
          <span>{{ todayHint }}</span>
        </span>
      </div>
    </div>
    <div class="toolbar-right"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TodoHeader",
};
</script>

<script setup lang="ts">
import { dayjs, IconFont } from "../../shared";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { TodoType } from "../../models/todo";

let route = useRoute();
let iconType = ref<string>();
let todayHint = ref<string | null>();
let title = computed(() => {
  switch (route.name) {
    case TodoType.MYDAY:
      iconType.value = 'icon-sun';
      todayHint.value = dayjs().locale('en').format('dddd, MMMM D');
      return "我的一天";
    case TodoType.PLANS:
      iconType.value = 'icon-calendar';
      todayHint.value = null;
      return "计划内";
    case TodoType.COMPLETED:
      iconType.value = 'icon-completed';
      todayHint.value = null;
      return "已完成";
    case TodoType.ALL:
      iconType.value = 'icon-all';
      todayHint.value = null;
      return "全部";
    default:
      return "我的一天";
  }
});

</script>

<style lang="scss">
.toolbar-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 48px;

  &.with-subline .toolbar-headline {
    margin-top: 16px;
  }

  .toolbar-headline {
    min-width: 100px;
    flex: 1 1 0px;
    margin-right: 20px;
  }
}


.toolbar-title {
  align-items: center;
  display: flex;
  min-width: 20px;
}

.listTitle {
  color: #323130;
  // color: var(--font-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  padding: 6px 8px;
}

.listTitle-icon {
  margin-right: 8px;
  font-size: 2.4rem;
}

.toolbar-subline {
  display: flex;
  color: #797775;
  // color: var(--font-color-secondary);
  padding: 0 10px;
  font-weight: 400;
}

.todayDateHint {
  font-size: 1.2rem;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
