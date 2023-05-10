<template>
  <!-- <modal :showModal="showModal"></modal> -->
  <!-- <button v-if="active < all" @click="clear">清理</button> -->
  <div v-if="todoList.length">
    <transition-group name="flip-list" tag="ul" class="container">
      <div class="taskItem" v-for="(todo, i) in todoList" :key="todo.id">
        <a-dropdown :trigger="['contextmenu']" overlayClassName="task-item">
          <div class="taskItem-ctx">
            <a-checkbox @change="onDoneChange($event, todo)" :checked="todo.done"></a-checkbox>
            <button class="taskItem-title-wrapper">
              <span :class="{ done: todo.done }"> {{ todo.title }} </span>
              <div class="metaDataInfo">
                <span class="metaDataInfo-group" v-if="todo.overdueTime">
                  <span class="taskItemInfo-date" :class="isOverdue(todo.overdueTime)">
                    <icon-font :type="'icon-calendar'" :style="{ 'font-size': '1.6rem' }" />
                    <span class="taskItemInfo-label">{{
                      overduePipe(todo.overdueTime)
                    }}</span>
                  </span>
                </span>
                <span class="metaDataInfo-group" v-if="todo.remindTime">
                  <span class="taskItemInfo-reminder">
                    <icon-font :type="'icon-remind'" :style="{ 'font-size': '1.6rem' }" />
                    <span class="taskItemInfo-label">{{
                      calendarPipe(todo.remindTime)
                    }}</span>
                  </span>
                </span>
                <span class="metaDataInfo-group" v-if="todo.completionTime">
                  <span class="taskItemInfo-date">
                    <icon-font :type="'icon-sun'" />
                    <span class="taskItemInfo-label">{{
                      calendarPipe(todo.remindTime)
                    }}</span>
                  </span>
                </span>
              </div>
            </button>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="removeTodo($event, todo.id, i)">
                删除任务
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </transition-group>
  </div>

  <div class="flex-center" v-else>
    <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_iikbn1ww.json" background="rgba(0, 0, 0, 0)"
      speed="1" style="width: 300px; height: 300px" loop autoplay></lottie-player>
  </div>

  <!-- <div> 全选
      <input type="checkbox" v-model="allDone" />
      <span> {{ active }} / {{ all }} </span>
    </div> -->
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  watchEffect,
  computed,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
} from "vue";
// import modal from "./modal.vue";
import { RepeatType, Todo, TodoType } from "../models";
import { useTodos } from "../hooks/useTodoList";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { Dayjs, dayjs, IconFont } from "../shared";
import { useDate } from "../hooks/useDate";
let { todos, clear, showModal, addTodo } = useTodos();
let { calendarPipe, overduePipe } = useDate();

let props = defineProps({
  isSort: Boolean
});

let todoList = ref<Todo[]>([]);
let route = useRoute();

let active = computed(() => {
  return todoList.value.filter((v) => !v.done).length;
});
let all = computed(() => todoList.value.length);
let allDone = computed({
  get: function () {
    return active.value === 0;
  },
  set: function (value) {
    todoList.value.forEach((todo) => {
      todo.done = !!value;
    });
  },
});

watch(
  [route, todos.value, todos],
  ([newRouter, newV], [oldRouter, oldV]) => {
    const newRouterName = newRouter?.name?.toString(),
      oldRouterName = oldRouter?.name?.toString();
    newRouterName && searchTodoList(newRouterName);
  },
  { immediate: true }
);


watch(
  () => props.isSort,
  (_val, oldVal) => sortTodoList(_val ? "asc" : "desc"),
  { immediate: true }
);

function searchTodoList(todoType: string) {
  switch (todoType) {
    case TodoType.COMPLETED:
      todoList.value = todos.value.filter((item: Todo) => item.done);
      break;
    case TodoType.ALL:
      todoList.value = todos.value;
      break;
    default: {
      todoList.value = todos.value.filter(
        (item: Todo) => item.type.toLocaleString() === todoType && !item.done && !item.overdue
      );
      todoList.value.forEach((item: Todo) => {
        if (!!item.remindTime && !item.reminded) {
          remindHander(item)
        }
      });
    }
      break;
  }
}

function remindHander(todo: Todo) {
  let time = new Date(),
    intervalId,
    secondsRemaining = (60 - time.getSeconds()) * 1000; // Starting from 0 seconds
  const func = () => {
    const current = dayjs();
    if (+current >= +dayjs(todo.remindTime) && !todo.reminded) {
      todo.reminded = true;
      let audio = new Audio(
        new URL(`../assets/audio/popup.wav`, import.meta.url).href
      );
      audio.play();
      clearInterval(intervalId);
    }
  };

  setTimeout(() => {
    func();
    intervalId = setInterval(func, 30000);
  }, secondsRemaining);
}

function removeTodo(e: Event, id: string, idx: number) {
  todoList.value.splice(idx, 1);

  const index = todos.value.findIndex((item) => item.id === id);

  index >= 0 && todos.value.splice(index, 1);
}

function sortTodoList(sortType: "asc" | "desc") {
  todoList.value = todoList.value.sort((a, b) =>
    (
      sortType === "asc"
        ? dayjs(a.createTime).isAfter(b.createTime)
        : dayjs(b.createTime).isAfter(a.createTime)
    )
      ? 1
      : -1
  );
}

function isOverdue(date: string | Dayjs) {
  if (dayjs(date).isToday()) return "dueToday";
  else if (dayjs(date) < dayjs()) return "overdue";
  else return "";
}

const repeatTodo = (item: Todo) => {
  let newTodo = {
    ...item,
    overdue: false,
    overdueTime: undefined,
    createTime: undefined,
    remindTime: undefined,
    reminded: undefined,
  };

  item.overdue = true;
  item.overdueTime = dayjs().format();

  addTodo(newTodo);
};

const onDoneChange = (e: Event, todo: Todo) => {
  todo.done = !todo.done;
  todo.completionTime = todo.done ? dayjs().format() : "";
};

function checkRepeatTask() {
  const repeat = todoList.value.findIndex((item) => !!item.repeatType);
  if (repeat >= 0 && typeof Worker !== "undefined") {
    const worker = new Worker(
      new URL("../workers/worker.js", import.meta.url),
      { type: "module" }
    );
    const todos = {
      type: "start",
      todoList: JSON.parse(JSON.stringify(todoList.value)),
    };
    worker.postMessage(todos);
    worker.addEventListener("message", (e) => {
      repeatTodo(e.data);
    });

    onUnmounted(() => {
      worker.postMessage({
        type: "stop",
      });
    });
  }
}

watch(todoList, () => checkRepeatTask);

onMounted(() => {
  checkRepeatTask();
});
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";

.container {
  padding: 0;
  margin: 2px 24px;
}

button {
  background: none;
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: none;
}

.taskItem {
  background-color: #fff;
  background-color: $--bg-primary;
  // box-shadow: 0px 0.3px 0.9px rgb(0 0 0 / 10%), 0px 1.6px 3.6px rgb(0 0 0 / 10%);
  box-shadow: 0px 0.3px 0.9px $--bg-shadow, 0px 1.6px 3.6px $--bg-shadow;

  margin-bottom: 8px;
  border-radius: 4px;

  &:first-child {
    margin-top: 8;
  }

  .taskItem-ctx {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0px 16px;
    min-height: 52px;
    position: relative;
    word-wrap: break-word;
    word-break: break-word;
  }
}

.metaDataInfo,
.metaDataInfo-group,
.taskItemInfo-date,
.taskItemInfo-reminder {
  display: flex;
  align-items: center;
}

.taskItemInfo-date {
  &.dueToday {
    color: #2564cf;
    // color: var(--font-color-brand);
  }

  &.overdue {
    color: #a80000;
    // color: var(--font-color-warning);
  }
}

.taskItem-title-wrapper {
  font-size: 1.4rem;
  position: relative;
  flex: 1 1 0px;
  min-height: 52px;
  padding: 8px 14px;
  line-height: 2rem;
  overflow: hidden;
  cursor: pointer;
  text-align: left;

  .done {
    text-decoration: line-through;
    color: #797775;
    // color: var(--font-color-tertiary);
  }

  .metaDataInfo {
    font-size: 1.2rem;
    line-height: 1.6rem;
    color: #797775;
    // color: var(--font-color-secondary);
    flex-wrap: wrap;
  }

  .metaDataInfo-group {
    flex-wrap: wrap;

    .anticon {
      font-size: 1.6rem;
    }

    &::after {
      color: #797775;
      // color: var(--font-color-secondary);
      content: "\2022";
      margin: 0 6px;
    }

    &:last-child::after {
      content: "";
    }
  }

  .taskItemInfo-label {
    margin-left: 4px;
    white-space: nowrap;
  }
}

@media (hover: hover) {
  .taskItem:hover {
    background-color: #eff6fc;
    background-color: $--bg-hover;
  }
}

// transition animation
.flip-list-move,
.flip-list-enter-active,
.flip-list-leave-active {
  transition: all .8s ease;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

::v-deep() {
  .ant-checkbox-inner {
    border-radius: 10px;
  }

  .ant-checkbox-checked::after {
    border-radius: 10px;
  }

  .ant-checkbox-wrapper {
    padding: 0px;
    cursor: pointer;
    height: 32px;
    width: 32px;
    position: relative;
    line-height: 32px;
  }
}
</style>
