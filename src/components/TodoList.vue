<template>
  <!-- <modal :showModal="showModal"></modal> -->
  <!-- <button v-if="active < all" @click="clear">清理</button> -->
  <div v-if="todoList.length">
    <transition-group name="flip-list" tag="ul" class="container">
      <div class="todoItem" draggable="true" v-for="(todo, i) in todoList" :key="todo.id">
        <TodoItem :data="todo" @on-remove="removeTodo"></TodoItem>
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
import { useDate, useTodos } from '@/hooks';
import { Todo, TodoType } from '@/models';
import dayjs, { Dayjs } from 'dayjs';
import { getCurrentInstance, Transition, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
let { todos, clear, showModal, addTodo } = useTodos();
import TodoItem from "./TodoItem.vue";
const instance = getCurrentInstance();
const props = defineProps<{
  isSort: Boolean,
}>()

let route = useRoute();

// let active = computed(() => {
//   return todoList.value.filter((v) => !v.done).length;
// });
// let all = computed(() => todoList.value.length);
// let allDone = computed({
//   get: function () {
//     return active.value === 0;
//   },
//   set: function (value) {
//     todoList.value.forEach((todo) => {
//       todo.done = !!value;
//     });
//   },
// });

let todoList = ref<Todo[]>([]);
let isUpdatingTodoList = ref(false);

let worker;

watch(route, (newRouter,) => {
  const newRouterName = newRouter?.name?.toString();
  if (newRouterName) {
    worker && worker.terminate();
  }
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

watch(isUpdatingTodoList, () => checkRepeatTask());

onMounted(() => {
  checkRepeatTask();

  const draggables = document.querySelectorAll(".todoItem");
  const droppables = document.querySelectorAll(".container");

  draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  });

  droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();

      const bottomTask = insertAboveTask(zone, (e as DragEvent).clientY);
      const curTask = document.querySelector(".is-dragging");

      if (!bottomTask) {
        curTask && zone.appendChild(curTask);
      } else {
        curTask && zone.insertBefore(curTask, bottomTask);
      }
    });
  });

  const insertAboveTask = (zone: Element, mouseY: number) => {
    const els = zone.querySelectorAll(".todoItem:not(.is-dragging)");
    let closestTask;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task: { getBoundingClientRect: () => { top: number; height: number }; }) => {
      const { top, height } = task.getBoundingClientRect();
      const offset = mouseY - (top + height / 2);

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
      }
    });

    return closestTask;
  };


});

function initWorker() {
  worker && worker.terminate();
  worker = new Worker(
    new URL("../workers/worker.js", import.meta.url),
    { type: "module" }
  );
  worker.addEventListener("message", (e) => {
    repeatTodo(e.data);
  });
}

function searchTodoList(todoType: string) {
  switch (todoType) {
    case TodoType.COMPLETED:
      todoList.value = todos.value.filter((item: Todo) => item.done);
      break;
    case TodoType.ALL:
      todoList.value = todos.value.concat();
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
  isUpdatingTodoList.value = !isUpdatingTodoList.value;
}

function remindHander(todo: Todo) {
  let time = new Date(),
    intervalId: string | number | NodeJS.Timeout | undefined,
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

function removeTodo(id: string) {
  const todosIndex = todoList.value.findIndex((item) => item.id === id);
  const index = todos.value.findIndex((item) => item.id === id);

  todosIndex >= 0 && todoList.value.splice(todosIndex, 1);
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

function checkRepeatTask() {
  const repeat = todoList.value.findIndex((item) => !!item.repeatType);
  if (repeat >= 0 && typeof Worker !== "undefined") {
    initWorker();
    watch(todoList, () => {
      worker.postMessage({
        type: "update",
        todoList: JSON.parse(JSON.stringify(todoList.value)),
      });
    }, {
      flush: 'post'
    });

    const todos = {
      type: "start",
      todoList: JSON.parse(JSON.stringify(todoList.value)),
    };
    worker.postMessage(todos);

    /**
     * Since the webworker is a standalone process,
     * it is considered outside the setup scope,
     * so import the current component instance to avoid lifecycle mobilization warnings.
     */
    onUnmounted(() => {
      worker.postMessage({
        type: "stop",
      });
    }, instance);
  }
}


const repeatTodo = (item: Todo) => {
  let newTodo = {
    ...item,
    overdueTime: undefined,
    createTime: undefined,
    remindTime: undefined,
    reminded: undefined,
  };

  todoList.value.forEach(todo => {
    if (todo.id === item.id) {
      console.log('input id:', item.id, '\rtodo:', todo);
      todo.overdue = true;
      todo.overdueTime = dayjs().format();
    }
  })

  addTodo(newTodo);
  isUpdatingTodoList.value = !isUpdatingTodoList.value;
};

</script>

<style lang="scss">
@import "../styles/global.scss";

.container {
  padding: 0;
  margin: 2px 24px;
}

.todoItem {
  background-color: #fff;
  background-color: $--bg-primary;
  // box-shadow: 0px 0.3px 0.9px rgb(0 0 0 / 10%), 0px 1.6px 3.6px rgb(0 0 0 / 10%);
  box-shadow: 0px 0.3px 0.9px $--bg-shadow, 0px 1.6px 3.6px $--bg-shadow;

  margin-bottom: 8px;
  border-radius: 4px;

  transition: all .3s ease;

  &:first-child {
    margin-top: 8;
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

.highlight {
  background-color: pink;
  color: gray;
}

@media (hover: hover) {
  .todoItem:hover {
    background-color: #f6f6f5;
    // background-color: $--bg-hover;
  }
}
</style>