<template>
  <a-layout-footer v-if="ishow">
    <div class="plus">
      <plus-outlined @click="addTodoItem" />
    </div>
    <a-input
      v-model:value="title"
      :bordered="false"
      :placeholder="$t('add_task')"
      @keydown.enter="addTodoItem"
      @change="inputChange"
    />
    <div
      class="tools"
      v-if="ishowTool"
      :class="ishowTool ? 'enter-action' : 'leave-active'"
    >
      <div class="tool-calendar">
        <DropdownCalendar
          ref="dropdownRef"
          :iconName="'icon-calendar'"
          :calendarList="calendarList"
          @clickMenu="clickDue"
          :showCustomItem="true"
        />
        <div class="due-date-text">
          <span class="date">
            {{ pickDateText && t(`calendar.${pickDateText}`) }}
          </span>
        </div>
      </div>
      <div class="tool-remind">
        <DropdownCalendar
          :iconName="'icon-remind'"
          :calendarList="remindList"
          @clickMenu="clickRemind"
          :showTimePick="true"
          :showCustomItem="true"
        />
        <div class="due-date-text">
          <span class="date"> {{ remindText && calendarPipe(remindText) }} </span>
        </div>
      </div>
      <!-- TODO custom-->
      <div class="tool-repeat">
        <DropdownCalendar
          :iconName="'icon-repeat'"
          :calendarList="repeadList"
          @clickMenu="clickRepeat"
        />
        <div class="due-date-text">
          <span class="date">
            {{ repeatText && t(`calendar.${repeatText}`) }}
          </span>
        </div>
      </div>
    </div>
  </a-layout-footer>
</template>

<script lang="ts">
export default {
  name: "TodoFooter",
};
</script>
<script setup lang="ts">
import { ref, watch, computed, ComputedRef } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useTodos } from "../../hooks/useTodoList";
import { useDate } from "../../hooks/useDate";
import {
  Calendar,
  DateType,
  Remind,
  Repeat,
  RepeatType,
  TodoType,
} from "../../models";
import { PlusOutlined, dayjs, Dayjs } from "../../shared";
import DropdownCalendar from "../dropdown/dropdown.vue";
import { useI18n } from "vue-i18n";
import { i18nDayjs } from "../../hooks/useLocale";

let { todos, addTodo, clear, showModal } = useTodos();
let { datePipe, calendarPipe } = useDate();

const { t } = useI18n();
let route = useRoute();
let todoTypeDirection: string[] = Object.values(TodoType);
let todoType = ref<string>(todoTypeDirection[0]);
let ishow = ref<boolean>(false), // comp switch
  ishowTool = ref<boolean>(false), // tools switch
  anyPickerOpen = ref<boolean>(false); // due comp switch

let title = ref("");
let dropdownRef = ref();
let overdueTime = ref<Dayjs>(),
  remindTime = ref<Dayjs>();
let repeatType = ref<string>();

let pickDateText = ref<string>(),
  remindText = ref<string>(),
  repeatText = ref<string>();

let calendarList: ComputedRef<Calendar[]> = getCalendarList();
let remindList: ComputedRef<Remind[]> = getRemindText();
let repeadList: Repeat[] = [
  {
    key: RepeatType.DAILY,
    icon: "daily",
    text: RepeatType.DAILY,
  },
  {
    key: RepeatType.WEEKDAYS,
    icon: "weekdays",
    text: RepeatType.WEEKDAYS,
  },
  {
    key: RepeatType.WEEKLY,
    icon: "weekly",
    text: RepeatType.WEEKLY,
  },
  {
    key: RepeatType.MONTHLY,
    icon: "monthly",
    text: RepeatType.MONTHLY,
  },
  {
    key: RepeatType.YEARLY,
    icon: "yearly",
    text: RepeatType.YEARLY,
  },
];
let dropdownVisible = ref();

watch(
  () => route.name,
  (newValue, oldValue) => {
    if (oldValue !== newValue) title.value = "";

    ishow.value = newValue?.toString() !== TodoType.COMPLETED;
    todoType.value = newValue?.toString() ?? todoTypeDirection[0];
  },
  { immediate: true }
);

const addTodoItem = () => {
  let newTodo = {
    title: title.value,
    type: todoType.value,
    overdueTime: overdueTime.value?.format(),
    remindTime: remindTime.value?.format(),
    repeatType: repeatType.value,
  };
  addTodo(newTodo);
  initParams();
};

const initParams = () => {
  title.value = "";
  pickDateText.value = "";
  overdueTime.value = undefined;
  remindText.value = "";
  remindTime.value = undefined;
  repeatText.value = "";
  repeatType.value = undefined;
};

const onFocus = (event) => (dropdownVisible.value = true);
const onBlur = (event) => {
  if (anyPickerOpen.value) return;
  dropdownVisible.value = false;
};

function inputChange() {
  ishowTool.value = !!title.value;
}

function getCalendarList() {
  let day = dayjs().day();
  return computed(() => [
    {
      key: DateType.TODAY,
      icon: "today",
      text: "today",
      secondaryText: i18nDayjs().isoWeekday(day).format("ddd"),
    },
    {
      key: DateType.TOMORROW,
      icon: "tomorrow",
      text: "tomorrow",
      secondaryText: i18nDayjs()
        .isoWeekday(day + 1)
        .format("ddd"),
    },
    {
      key: DateType.NEXT_WEEK,
      icon: "next-week",
      text: "next_week",
      secondaryText: i18nDayjs().isoWeekday(1).format("ddd"),
    },
  ]);
}

function getRemindText() {
  return computed(() => {
    return [
      {
        key: DateType.LATER_TODAY,
        icon: "later-today",
        text: "later_today",
        secondaryText: i18nDayjs()
          .add(dayjs().minute() >= 30 ? 4 : 3, "h")
          .format("h:00 A"),
      },
      {
        key: DateType.TOMORROW,
        icon: "later-tomorrow",
        text: "tomorrow",
        secondaryText:
          i18nDayjs().add(1, "day").format("ddd, 9 ") + t("calendar.am"),
      },
      {
        key: DateType.NEXT_WEEK,
        icon: "later-next-week",
        text: "next_week",
        secondaryText:
          i18nDayjs().isoWeekday(1).format("ddd, 9 ") + t("calendar.am"),
      },
    ];
  });
}

function clickDue(type: string, date?: Dayjs): void {
  const dueType = [DateType.TODAY, DateType.TOMORROW, DateType.NEXT_WEEK];
  const dateFormat = dueType.some((s) => s === type)
    ? datePipe(type as DateType)
    : date;

  overdueTime.value = dateFormat?.endOf("d");
  pickDateText.value = type;
}

function clickRemind(type: string, date?: Dayjs): void {
  const _remindTime = datePipe(type as DateType);
  const dateFormat =
    type === DateType.LATER_TODAY
      ? _remindTime.format("YYYY-MM-DD HH:mm")
      : [DateType.TOMORROW, DateType.NEXT_WEEK].includes(type as DateType)
      ? _remindTime.format("YYYY-MM-DD 9:00")
      : date?.format("YYYY-MM-DD HH:mm");

  remindTime.value = dayjs(dateFormat);
  remindText.value = dateFormat;
}

function clickRepeat(type: string): void {
  repeatText.value = repeatType.value = type;
}

</script>

<style lang="scss" scoped>
.plus {
  font-size: 24px;
  padding-right: 8px;
  cursor: pointer;
}

$class-prefix: "tool";

.tools {
  display: flex;
  font-size: 24px;

  .tool-calendar,
  .tool-remind,
  .tool-repeat {
    display: flex;
    align-items: center;
  }

  .due-date-text {
    font-size: 18px;
    margin-left: 4px;

    > span {
      white-space: nowrap;
    }
  }

  [class^="tool"] {
    margin-right: 16px;

    &:last-child {
      margin: 0;
    }
  }

  .anticon {
    cursor: pointer;
  }
}

.enter-active {
  opacity: 0;
  transition: all 1s ease;
}

.leave-active {
  opacity: 1;
  transition: all 1s ease;
}

:global(.date-overlay) {
  width: 240px;
}
</style>
