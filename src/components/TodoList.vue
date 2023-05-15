<template>
  <!-- <modal :showModal="showModal"></modal> -->
  <!-- <button v-if="active < all" @click="clear">清理</button> -->
  <div v-if="todoList.length">
    <transition-group name="flip-list" tag="ul" class="container">
      <div class="task-item" v-for="(todo, i) in todoList" :key="todo.id">
        <TodoItem :todo="todo" @on-remove="removeTodo"></TodoItem>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
let { todos, clear, showModal, addTodo } = useTodos();
import TodoItem from "./TodoItem.vue";

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

let todoList = ref<Todo[]>([])

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
watch(todoList, () => checkRepeatTask);

onMounted(() => {
  checkRepeatTask();
});

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

function removeTodo(id: string) {
  const todosIndex = todoList.value.findIndex((item) => item.id === id);
  const index = todos.value.findIndex((item) => item.id === id);

  todosIndex >= 0 && todoList.value.splice(todosIndex, 1);
  index >= 0 && todos.value.splice(index, 1);
}

function isOverdue(date: string | Dayjs) {
  if (dayjs(date).isToday()) return "dueToday";
  else if (dayjs(date) < dayjs()) return "overdue";
  else return "";
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

</script>

<style lang="scss">
@import "../styles/global.scss";

.container {
  padding: 0;
  margin: 2px 24px;
}

.task-item {
  background-color: #fff;
  background-color: $--bg-primary;
  // box-shadow: 0px 0.3px 0.9px rgb(0 0 0 / 10%), 0px 1.6px 3.6px rgb(0 0 0 / 10%);
  box-shadow: 0px 0.3px 0.9px $--bg-shadow, 0px 1.6px 3.6px $--bg-shadow;

  margin-bottom: 8px;
  border-radius: 4px;

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
</style>