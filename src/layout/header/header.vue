<template>
  <div class="toolbar-top" :class="todayHint && 'with-subline'">
    <div class="toolbar-headline">
      <div class="toolbar-title">
        <h2 class="listTitle">
          <icon-font v-if="iconType" :type="iconType" class="listTitle-icon" />
          <span>{{ $t(title) }}</span>
        </h2>
      </div>
      <div class="toolbar-subline" v-if="todayHint">
        <span class="todayDateHint">
          <span>{{ todayHint }}</span>
        </span>
      </div>
    </div>
    <div class="toolbar-actions">
      <div class="language">
        <tooltips :title="$t('header.i18n')" :color="'block'">
          <a-button type="text" @click="checked = !checked">
            {{ checked ? "zh-cn" : "en" }}
          </a-button>
        </tooltips>
      </div>
      <div class="sortingOptions">
        <tooltips :title="isSort ? $t('header.des', 0) : $t('header.asc', 0)">
          <a-button type="link" @click="onSort">
            <swap-outlined :class="isSort ? 'rotate' : ''" />
            {{ isSort ? $t("header.asc", 1) : $t("header.des", 1) }}
          </a-button>
        </tooltips>
      </div>
      <input class="theme-box" type="color" :value="colorState.primaryColor"
        @input="(e) => onColorChange('primaryColor', e)" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TodoHeader",
};
</script>

<script setup lang="ts">
import { dayjs, IconFont, SwapOutlined } from "@/shared";
import { computed, ref, reactive, onMounted, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";
import { TodoType } from "@/models/todo";
import { ConfigProvider } from "ant-design-vue";
import { useI18nStore, i18nDayjs, setLocale } from "@/hooks";
import { LANG_VALUE } from "@/i18n";
import tooltips from "@/components/tooltips/tooltips.vue";

let route = useRoute();

let props = defineProps({
  isSort: Boolean
});
// let isSort = ref(false);
let emits = defineEmits<{
  (e: 'onSort'): void
}>()

const onSort = () => emits('onSort');

let iconType = ref<string>();
let todayHint = ref<string | null>();
let title = computed(() => {
  switch (route.name) {
    case TodoType.MYDAY:
      iconType.value = "icon-sun";
      todayHint.value = i18nDayjs().format("dddd, MMMM D");
      return "my_day";
    case TodoType.PLANS:
      iconType.value = "icon-calendar";
      todayHint.value = null;
      return "planned";
    case TodoType.COMPLETED:
      iconType.value = "icon-completed";
      todayHint.value = null;
      return "completed";
    case TodoType.ALL:
      iconType.value = "icon-all";
      todayHint.value = null;
      return "all";
    default:
      return "my_day";
  }
});

const colorState = reactive({
  primaryColor: "#42b883",
  errorColor: "#ff4d4f",
  warningColor: "#faad14",
  successColor: "#52c41a",
  infoColor: "#1890ff",
});

const checked = ref<boolean>(useI18nStore().language === LANG_VALUE.Zh);

watch(
  checked,
  (_val, oldVal) => {
    setLocale(_val ? LANG_VALUE.Zh : LANG_VALUE.En)
  },
  { immediate: true }
);

onMounted(() => {
  ConfigProvider.config({
    theme: colorState,
  });
});

const onColorChange = (type: string, e: any) => {
  Object.assign(colorState, { [type]: e.target.value });
  ConfigProvider.config({
    theme: colorState,
  });
};
</script>

<style lang="scss" scoped>
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
  display: flex;
  align-items: center;
  margin: 0;
  padding: 6px 8px 8px 0px;
  color: #323130;
  // color: var(--font-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 2rem;
  font-weight: 600;
}

.listTitle-icon {
  margin-right: 8px;
  font-size: 2.4rem;
}

.toolbar-subline {
  display: flex;
  color: #797775;
  // color: var(--font-color-secondary);
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
    transition: transform 1s ease-in-out;
  }

  .language>.ant-btn {
    width: 42px;
    padding: 0;
    margin: 0;
    color: var(--ant-primary-color);
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
  box-shadow: -8px -8px 10px rgba(255, 255, 255, 1),
    8px 8px 25px rgb(0, 0, 0, 15%);
  border: 8px solid #faf9f8;
  border-radius: 50%;
}

.theme-box::-webkit-color-swatch {
  box-shadow: -2px -2px 2px rgb(255 255 255), 2px 2px 4px rgb(0 0 0 / 15%);
  border-radius: 50%;
  border: none;
}
</style>
