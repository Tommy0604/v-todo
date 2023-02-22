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
    <div class="toolbar-actions">
      <div class="sortingOptions">
        <a-button type="link" @click="setSort">
          <swap-outlined :class="isSort ? 'rotate' : ''" />
          Sort
        </a-button>
      </div>
      <input class="theme-box" type="color" :value="colorState.primaryColor"
        @input="e => onColorChange('primaryColor', e)" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TodoHeader",
};
</script>

<script setup lang="ts">
import { dayjs, IconFont, SwapOutlined } from "../../shared";
import { computed, ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { TodoType } from "../../models/todo";
import { ConfigProvider } from "ant-design-vue";
import { useSort } from "../../services/util.service";

let { isSort, setSort } = useSort();
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

const colorState = reactive({
  primaryColor: '#42b883',
  errorColor: '#ff4d4f',
  warningColor: '#faad14',
  successColor: '#52c41a',
  infoColor: '#1890ff',
});

onMounted(() => {
  ConfigProvider.config({
    theme: colorState,
  });
})

const onColorChange = (type: string, e: any) => {
  Object.assign(colorState, { [type]: e.target.value });
  ConfigProvider.config({
    theme: colorState,
  });
};

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

.toolbar-actions {
  display: flex;
  align-items: center;

  .ant-btn .anticon {
    transition: all 1s ease-in-out;
  }

  .anticon {
    transform: rotate(0.25turn);
  }

  .rotate {
    transform: rotate(0.75turn);
  }
}

.theme-box {
  appearance: none;
  width: 36px;
  height: 36px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.theme-box::-webkit-color-swatch,
.theme-box::-webkit-color-swatch-wrapper {
  padding: 0;
}

.theme-box::-webkit-color-swatch-wrapper {
  box-shadow: -8px -8px 10px rgba(255, 255, 255, 1), 8px 8px 25px rgb(0, 0, 0, 15%);
  border: 8px solid #faf9f8;
  border-radius: 50%;
}

.theme-box::-webkit-color-swatch {
  box-shadow: -2px -2px 2px rgb(255 255 255), 2px 2px 4px rgb(0 0 0 / 15%);
  border-radius: 50%;
  border: none;
}
</style>
