<template>
  <a-layout-footer v-if="ishow">
    <div class="plus">
      <plus-outlined @click="addTodoItem" />
    </div>
    <a-input v-model:value="title" :bordered="false" :placeholder="$t('add_task')" @keydown.enter="addTodoItem()"
      @compositionstart="lock = false" @compositionend="lock = true" @change="inputChange" />
    <div class="tools" v-if="ishowTool" :class="ishowTool ? 'enter-action' : 'leave-active'">
      <div class="tool-calendar">
        <tooltips :title="$t('footer.calendar')" :isDefault="false">
          <DropdownCalendar ref="dropdownRef" :iconName="'icon-calendar'" :calendarList="calendarList"
            @clickMenu="clickDue" :showCustomItem="true" />
        </tooltips>
        <div class="due-date-text">
          <span class="date">
            {{ pickDateText && t(`calendar.${pickDateText}`) }}
          </span>
        </div>
      </div>
      <div class="tool-remind">
        <tooltips :title="$t('footer.remind')" :isDefault="false">
          <DropdownCalendar :iconName="'icon-remind'" :calendarList="remindList" @clickMenu="clickRemind"
            :showTimePick="true" :showCustomItem="true" />
        </tooltips>
        <div class="due-date-text">
          <span class="date">
            {{ remindText && calendarPipe(remindText) }}
          </span>
        </div>
      </div>
      <!-- TODO custom-->
      <div class="tool-repeat">
        <tooltips :title="$t('footer.repeat')" :isDefault="false">
          <DropdownCalendar :iconName="'icon-repeat'" :calendarList="repeadList" @clickMenu="clickRepeat" />
        </tooltips>
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
import {
  Calendar,
  DateType,
  Remind,
  Repeat,
  RepeatType,
  TodoType,
} from "@/models";
import { PlusOutlined, dayjs, Dayjs } from "@/shared";
import { i18nDayjs, useDate, useTodos } from "@/hooks";
import { useI18n } from "vue-i18n";
import { DropdownCalendar, Tooltips } from "@/components";

let { todos, addTodo, clear, showModal } = useTodos();
let { duePipe, calendarPipe, getCalendarList, getRemindList, getRepeadList } = useDate();

const { t } = useI18n();
let route = useRoute();
let todoTypeDirection: string[] = Object.values(TodoType);
let todoType = ref<string>(todoTypeDirection[0]);
let ishow = ref<boolean>(false), // comp switch
  ishowTool = ref<boolean>(false), // tools switch
  anyPickerOpen = ref<boolean>(false); // due comp switch

let title = ref(""),
  lock = ref(true);
let dropdownRef = ref();
let overdueTime = ref<Dayjs>(),
  remindTime = ref<Dayjs>();
let repeatType = ref<string>();

let pickDateText = ref<string>(),
  remindText = ref<string>(),
  repeatText = ref<string>();

let calendarList: ComputedRef<Calendar[]> = getCalendarList();
let remindList: ComputedRef<Remind[]> = getRemindList();
let repeadList: Repeat[] = getRepeadList();
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
  if (!lock.value) return;

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

function clickDue(type: string, date?: Dayjs): void {
  const dueType = [DateType.TODAY, DateType.TOMORROW, DateType.NEXT_WEEK];
  const dateFormat = dueType.some((s) => s === type)
    ? duePipe(type as DateType)
    : date;

  overdueTime.value = dateFormat?.endOf("d");
  pickDateText.value = type;
}

function clickRemind(type: string, date?: Dayjs): void {
  const _remindTime = duePipe(type as DateType);
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

    >span {
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
