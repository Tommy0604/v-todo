<template>
  <a-dropdown ref="dropdownRef" :trigger="['click']" :overlayClassName="'date-overlay'" :visible="dropdownVisible">
    <icon-font :type="iconName" @focus="onFocus($event)" @blur="onBlur($event)" ref="iconRef" />
    <template #overlay>
      <a-menu @click="clickMenu">
        <a-menu-item v-for="item in calendarList" :key="item.key" @mousedown="(e) => e.preventDefault()">
          <div class="dropdown-item">
            <img :src="getIconUrl(item.icon)" alt="" />
            <span class="dropdown-item-Text">{{ item.text }}</span>
            <span class="dropdown-item-secondaryText">
              {{ item.secondaryText }}
            </span>
          </div>
        </a-menu-item>
        <a-menu-divider />
        <a-sub-menu key="sub1" @mousedown="(e) => e.preventDefault()">
          <template #icon>
            <img :src="getIconUrl('pick-date')" alt="" />
          </template>
          <template #title>
            <!-- TODO -->Pick a date
          </template>
          <a-menu-item :key="DateType.OTHER_TIME" @mouseenter="anyPickerOpen = true"
            @mouseleave="anyPickerOpen = false">
            <div style="width: 300px">
              <a-calendar :value="pickDate" :fullscreen="false" @change="onDateChange" />
            </div>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
export default {
  name: "DropdownCalendar",
};
export interface Calendar {
  icon: string;
  key: DateType;
  text: string;
  secondaryText: string;
}

export interface Remind extends Calendar { }
</script>
<script lang="ts" setup>
import { IconFont, PlusOutlined } from "../../shared";
import { Dayjs } from "dayjs";
import { ref } from "vue";
import { DateType } from "../../models";
import { useDate } from "../../services/date.service";

let { datePipe } = useDate();

let dropdownVisible = ref(),
  anyPickerOpen = ref<boolean>(false);
let iconRef = ref();
let pickDate = ref<Dayjs>();

const emit = defineEmits<{
  (e: 'clickMenu', value: string): void,
}>();

let props = defineProps<{
  calendarList: Array<Calendar>;
  iconName: string;
}>();

const onFocus = (event) => (dropdownVisible.value = true);
const onBlur = (event) => {
  if (anyPickerOpen.value) return;
  dropdownVisible.value = false;
};

const clickMenu = (e) => {
  emit('clickMenu', e);
  if (e.keyPath.length < 2) {
    e.domEvent.stopPropagation();
    iconRef.value.blur();
  } else {
    iconRef.value.focus();
  }
};

const onDateChange = (event) => {
  iconRef.value.focus();
};

const getIconUrl = (type) => new URL(`../../assets/${type}.svg`, import.meta.url).href;
</script>

<style lang="scss" scoped>
.dropdown-item {
  display: flex;
  align-items: center;

  .dropdown-item-Text {
    padding: 0 4px;
    height: 20px;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 360px;
  }

  .dropdown-item-secondaryText {
    padding-left: 20px;
    text-align: right;
  }

  >img {
    margin-left: 4px;
    margin-right: 6px;
  }
}

::v-deep() {
  .ant-dropdown-menu-item {
    padding: 10px 12px;
  }

  .ant-dropdown-menu-item-icon {
    margin: 0 10px 0 4px;
  }

  .ant-dropdown-menu-submenu-title {
    padding: 10px 12px;
    display: flex;
  }
}
</style>
