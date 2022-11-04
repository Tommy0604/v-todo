<template>
  <a-layout-footer v-if="ishow">
    <div class="plus">
      <plus-outlined @click="addTodoItem" />
    </div>
    <a-input v-model:value="title" :bordered="false" placeholder="Add a task" @keydown.enter="addTodoItem"
      @change="inputChange" />
    <div class="tools" v-if="ishowTool" :class="ishowTool ? 'enter-action' : 'leave-active'">
      <div class="tool-calendar">
        <DropdownCalendar ref="dropdownRef" :iconName="'icon-calendar'" :calendarList="calendarList"
          @click-menu="clickDue" />

        <div class="due-date-text">
          <span class="date"> {{ pickDateText || "" }} </span>
        </div>
      </div>
      <div class="tool-remind">
        <DropdownCalendar :iconName="'icon-remind'" :calendarList="remindList" @clickMenu="clickRemind"
          :showTimePick="true" />

        <div class="due-date-text">
          <span class="date"> {{ remindText || "" }} </span>
        </div>
      </div>
      <!-- TODO -->
      <!-- <div class="tool-repeat">
        <icon-font type="icon-repeat" />
      </div> -->
    </div>
  </a-layout-footer>
</template>

<script lang="ts">
export default {
  name: "TodoFooter",
};
</script>
<script setup lang="ts">
import { defineComponent, ref, onMounted, watch, computed, ComputedRef } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useTodos } from "../todoLIst.service";
import { useDate } from "../../services/date.service";
import { DateType, TodoType } from "../../models";
import { IconFont, PlusOutlined, dayjs, Dayjs } from "../../shared";
import DropdownCalendar, { Calendar, Remind } from "../dropdown/dropdown.vue";

let { todos, addTodo, clear, showModal } = useTodos();
let { datePipe, calendarPipe } = useDate();

let route = useRoute();
let todoTypeDirection: string[] = Object.values(TodoType);
let todoType = ref<string>(todoTypeDirection[0]);
let ishow = ref<boolean>(false), // comp switch
  ishowTool = ref<boolean>(false), // tools switch
  anyPickerOpen = ref<boolean>(false); // due comp switch

let title = ref('');
let dropdownRef = ref();
let overdueTime = ref<Dayjs>();
let remindTime = ref<Dayjs>();
let pickDateText = ref<string>(),
  remindText = ref<string>();
let calendarList: Calendar[] = [{
  key: DateType.TODAY,
  icon: 'daily',
  text: 'Today',
  secondaryText: 'Tue'
}, {
  key: DateType.TOMORROW,
  icon: 'tomorrow',
  text: 'Tomorrow',
  secondaryText: 'Web'
}, {
  key: DateType.NEXT_WEEK,
  icon: 'next-week',
  text: 'Next week',
  secondaryText: 'Mon'
}];

let remindList: ComputedRef<Remind[]> = getRemindText();
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
  let obj = {
    title: title.value,
    type: todoType.value,
    overdueTime: overdueTime.value?.format(),
    remindTime: remindTime.value?.format()
  }
  addTodo(obj);
  initParams();
};

const initParams = () => {
  title.value = '';
  pickDateText.value = '';
  overdueTime.value = undefined;
  remindText.value = '';
  remindTime.value = undefined;
}

const onFocus = (event) => (dropdownVisible.value = true);
const onBlur = (event) => {
  if (anyPickerOpen.value) return;
  dropdownVisible.value = false;
};

function inputChange() {
  ishowTool.value = !!title.value;
}

function getRemindText() {
  return computed(() => {
    return [{
      key: DateType.LATER_TODAY,
      icon: 'later-today',
      text: 'Later ToDay',
      secondaryText: dayjs().add(dayjs().minute() >= 30 ? 4 : 3, 'h').locale("en").format("h:00 A"),
    }, {
      key: DateType.TOMORROW,
      icon: 'later-tomorrow',
      text: 'Tomorrow',
      secondaryText: dayjs().add(1, 'day').locale("en").format('ddd, 9 ') + 'AM'
    }, {
      key: DateType.NEXT_WEEK,
      icon: 'later-next-week',
      text: 'Next week',
      secondaryText: 'Mon, 9 AM'
    }]
  });
}

function clickDue(type: DateType, date?: Dayjs) {
  const dueType = [DateType.TODAY, DateType.TOMORROW, DateType.NEXT_WEEK];
  const dateFormat = dueType.some((s) => s === type) ? datePipe(type) : date;

  overdueTime.value = dateFormat?.endOf('d');
  pickDateText.value = type.toString();
}

function clickRemind(type: DateType, date?: Dayjs) {
  const _remindTime = datePipe(type);
  const dateFormat = type === DateType.LATER_TODAY ?
    _remindTime.format('YYYY-MM-DD HH:mm')
    : [DateType.TOMORROW, DateType.NEXT_WEEK].includes(type) ?
      _remindTime.format('YYYY-MM-DD 9:00')
      : date?.format('YYYY-MM-DD HH:mm');

  console.log('remindTime ==========>', dateFormat);
  remindTime.value = dayjs(dateFormat);
  remindText.value = calendarPipe(dateFormat);
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
  .tool-remind {
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
