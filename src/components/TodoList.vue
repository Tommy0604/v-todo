<template>
  <div>
    <!-- <modal :showModal="showModal"></modal> -->
    <!-- <button v-if="active < all" @click="clear">清理</button> -->
    <!-- <div v-if="todoList.length"> -->
    <transition-group name="flip-list" tag="ul" class="container">
      <div class="taskItem" v-for="(todo, i) in todoList" :key="todo.id">
        <a-dropdown :trigger="['contextmenu']" overlayClassName="task-item">
          <div class="taskItem-ctx">
            <a-checkbox v-model:checked="todo.done"></a-checkbox>
            <button class="taskItem-title-wrapper">
              <span :class="{ done: todo.done }"> {{ todo.title }} </span>
              <div class="metaDataInfo">
                <span class="metaDataInfo-group" v-if="todo.overdueTime">
                  <span class="taskItemInfo-date" :class="isOverdue(todo.overdueTime)">
                    <icon-font :type="'icon-calendar'" :style="{ 'font-size':'1.6rem' }" />
                    <span class="taskItemInfo-label">{{ overdueFormat(todo.overdueTime) }}</span>
                    <!-- <img :src="getIconUrl('calendar')" alt=""> -->

                  </span>
                </span>
                <span class="metaDataInfo-group" v-if="todo.remindTime">
                  <span class="taskItemInfo-reminder">
                    <icon-font :type="'icon-remind'" :style="{ 'font-size':'1.6rem' }" />
                    <span class="taskItemInfo-label">{{ calendarPipe(todo.remindTime) }}</span>
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
    <!-- </div> -->
    <!-- <div v-else>暂无数据</div> -->
    <!-- <div>
      全选
      <input type="checkbox" v-model="allDone" />
      <span> {{ active }} / {{ all }} </span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, getCurrentInstance, computed, watchEffect } from "vue";
// import modal from "./modal.vue";
import { Todo, TodoType } from "../models";
import { useTodos } from "./todoLIst.service";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { Dayjs, dayjs, IconFont, } from "../shared";
import { useDate } from "../services/date.service";
// isToday, isTomorrow
let { todos, clear, showModal } = useTodos();
let { calendarPipe } = useDate();

let props = defineProps({
  completedList: [],
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
    // if (newRouterName !== oldRouterName) {
    //   todoList.value.forEach((item: Todo) => (item.done = false));
    // }
  },
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
        (item: Todo) => item.type.toLocaleString() === todoType && !item.done
      );
      todoList.value.forEach((item: Todo) => {
        if (!!item.remindTime && !item.reminded) {
          let time = new Date(),
            intervalId,
            secondsRemaining = (60 - time.getSeconds()) * 1000; // Starting from 0 seconds 
          setTimeout(() => {
            intervalId = setTimeout(function tick() {
              const current = dayjs();

              if (+current >= +dayjs(item.remindTime)) {
                clearInterval(intervalId);
                item.reminded = true;
                let audio = new Audio(
                  new URL(`../assets/audio/popup.wav`, import.meta.url).href);
                audio.play();
              } else {
                intervalId = setTimeout(tick, 30000);
              }
            }, 30000);
          }, secondsRemaining);
        }
      });
    }
      break;
  }
}

function removeTodo(e, v, i) {
  todoList.value.splice(i, 1);

  const index = todos.value.findIndex(
    (item) => item.type === route.name && item.id === v
  );

  index >= 0 && todos.value.splice(index, 1);
}

function isOverdue(date: string | Dayjs) {
  if (dayjs(date).isToday()) return 'dueToday';
  else if (dayjs(date) < dayjs()) return 'overdue';
  else return ''
}

function overdueFormat(date: string | Dayjs) {
  return dayjs(date).locale("en").calendar(null, {
    sameDay: "[Today]", // The same day ( 2:30 AM, Today )
    nextDay: "[Tomorrow]", // The next day ( 2:30 AM, Tomorrow )
    nextWeek: "ddd, MMMM D", // The next week ( 2:30 AM, Mon, October 31 )
    lastDay: "h:mm A, MMMM D", // The day before ( 2:30 AM, Yesterday )
    lastWeek: "h:mm A, ddd, MMMM D", // The last week ( 2:30 AM, Mon, XXX 17 )
    sameElse: "h:mm A, MMMM D, YYYY", // Everything else ( 2:30 AM, Mon 1, 2022 )
  })
}

const getIconUrl = (type) => new URL(`../assets/${type}.svg`, import.meta.url).href;
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";

.container {
  padding: 0;
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
  
  margin-top: 8px;
  border-radius: 4px;

  &:first-child {
    margin-top: 0;
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
  color: #323130;
  position: relative;
  flex: 1 1 0px;
  min-height: 52px;
  padding: 8px 14px;
  line-height: 2rem;
  overflow: hidden;
  cursor: pointer;
  text-align: left;

  .metaDataInfo {
    font-size: 1.2rem;
    line-height: 1.6rem;
    color: #797775;
    // color: var(--font-color-secondary);
    flex-wrap: wrap;
  }

  .metaDataInfo-group {
    flex-wrap: wrap;

    &::after {
      color: #797775;
      // color: var(--font-color-secondary);
      content: '\2022';
      margin: 0 6px;
    }

    &:last-child::after {
      content: '';
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
  transition: all 1s ease;
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
