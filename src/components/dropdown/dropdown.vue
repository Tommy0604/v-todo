<template>
  <a-dropdown :trigger="['click']" :overlayClassName="'date-overlay'" :visible="dropdownVisible">
    <icon-font ref="iconRef" :type="iconName" @focus="onFocus($event)" @blur="onBlur($event)" />
    <template #overlay>
      <a-menu @click="clickMenu" :triggerSubMenuAction="subMenuActionType">
        <a-menu-item v-for="item in calendarList" :key="item.key" @mousedown="(e) => e.preventDefault()">
          <div class="dropdown-item">
            <img :src="getIconUrl(item.icon)" alt="" />
            <span class="dropdown-item-Text">{{ $t(`calendar.${item.text}`) }}</span>
            <span class="dropdown-item-secondaryText">
              {{ item.secondaryText || '' }}
            </span>
          </div>
        </a-menu-item>
        <template v-if="showCustomItem">
          <a-menu-divider />
          <a-sub-menu key="sub1" @mousedown="(e) => e.preventDefault()">
            <template #icon>
              <img :src="getIconUrl('pick-date')" alt="" />
            </template>
            <template #title>
              {{ $t('calendar.pick_date') }}
            </template>
            <a-menu-item :key="DateType.OTHER_TIME" @mouseenter="duePickerOpen = true"
              @mouseleave="duePickerOpen = false">
              <div class="calendar-box">
                <a-calendar :fullscreen="false" @change="onDateChange" @click="(e) => e.stopPropagation()"
                  @select="select" @panelChange="panelChange" />
                <div class="calendar-footer">
                  <div class="time-pick" v-if="showTimePick">
                    <a-time-picker ref="timePickRef" use12-hours :value="timePick" :minute-step="20" format="HH:mm"
                      :disabledHours="disabledHours" :hideDisabledOptions="true" @focus="timeFocus" @blur="timeBlur"
                      @change="(time) => timePick = time" />
                  </div>
                  <div class="btn-save">
                    <a-button type="primary" @click="onSave">Save</a-button>
                  </div>
                </div>
              </div>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
export default {
  name: "DropdownCalendar",
};
</script>
<script lang="ts" setup>
import { IconFont, range } from "../../shared";
import dayjs, { Dayjs } from "dayjs";
import { ref } from "vue";
import { useDate } from "../../hooks/useDate";
import { Calendar, DateType, RepeatType } from "../../models";

let { datePipe } = useDate();

let dropdownVisible = ref(),
  duePickerOpen = ref<boolean>(false),
  timePickOpen = ref<boolean>(false);

let dueTime = ref<Dayjs>(dayjs()),
  timePick = ref<Dayjs>();
let iconRef = ref(),
  timePickRef = ref();

let subMenuActionType = ref<'click' | 'hover'>('hover');

const emit = defineEmits<{
  (e: 'clickMenu', type: string, value?: Dayjs): void,
}>();

let props = defineProps<{
  calendarList: Array<Calendar>,
  iconName: string,
  showTimePick?: boolean,
  showCustomItem?: boolean,
}>();

const onFocus = (event) => (dropdownVisible.value = true);
const onBlur = (event) => {
  if (duePickerOpen.value) return;
  dropdownVisible.value = false;
};

const clickMenu = (e) => {
  [DateType.TODAY, DateType.LATER_TODAY, DateType.TOMORROW, DateType.NEXT_WEEK, ...Object.values(RepeatType)].includes(e.key) && emit('clickMenu', e.key);

  if (e.keyPath.length < 2) {
    e.domEvent.stopPropagation();
    iconRef.value.blur();
  } else {
    props.showTimePick ? timePickOpen.value || iconRef.value.focus()
      : iconRef.value.focus();
  }
};

const onDateChange = (date: Dayjs) => {
  iconRef.value.focus();
  dueTime.value = date;
};

const onSave = (e: Event) => {
  e.stopPropagation();
  if (timePick.value) {
    dueTime.value = dayjs(`${dueTime.value.format('YYYY-MM-DD')} ${timePick.value.format('HH:mm:ss')}`);
  }
  emit('clickMenu', DateType.OTHER_TIME, dueTime.value!);
  dropdownVisible.value = false;
}

const timeFocus = (e: Event) => {
  e.stopPropagation();
  timePickOpen.value = true;
  subMenuActionType.value = 'click'; // Prevent out-of-focus layers due to time-picker pop-ups
  iconRef.value.blur();
}

const timeBlur = (e: Event) => {
  e.stopPropagation();
  timePickOpen.value = false;
  subMenuActionType.value = 'hover';
  iconRef.value.focus();
}

const select = () => console.log('select');
const panelChange = () => {
  iconRef.value.focus();
};

// Only (9, 5, 8, 12) are available at this time
const disabledHours = () => range(0, 24).filter(n => ![9, 21, 0, 24, 5, 17, 8, 20].includes(n));

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

.calendar-box {
  width: 300px;
  background-color: #FFF;

  .time-pick {
    text-align: left;
    padding: 8px
  }

  .btn-save {
    text-align: right;
    padding: 8px;
    font-weight: bold;
  }

  .ant-btn {
    font-weight: bold;
    border-radius: 4px;
  }

  .calendar-footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>
