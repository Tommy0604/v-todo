import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { ref, computed, watchEffect, Ref } from "vue";
import { Todo, TodoType } from "../models/todo";

let todos = useStorage("todos", []);
let showModal = ref(false);
type AddOptions = {
  title: string;
  type: string;
  createTime?: string;
  overdueTime?: string;
  remindTime?: string;
  repeatType?: string;
};

//TODO 待转到 firebase
function useTodos() {
  watchEffect(() => {
    if (typeof localStorage !== "undefined") {
    localStorage.setItem("todos", JSON.stringify(todos.value));
    }
  });

  function addTodo({
    title,
    type,
    createTime = dayjs().format(),
    overdueTime,
    remindTime,
    repeatType,
  }: AddOptions) {
    if (!title.trim()) {
      showModal.value = true;
      setTimeout(() => {
        showModal.value = false;
      }, 1500);
      return;
    }
    todos.value.unshift({
      id: nanoid(),
      title,
      done: false,
      type,
      createTime,
      overdueTime,
      remindTime,
      repeatType
    });
  }
  function clear() {
    todos.value = todos.value.filter((v) => !v.done);
  }
  return { todos, addTodo, clear, showModal };
}

function useStorage(name: string, value: Array<Todo> = []): Ref<Array<Todo>> {
  let data;
  // TODO: Unable to get window because of web worker
  if (typeof localStorage !== "undefined") {
    data = ref<Array<Todo>>(JSON.parse(localStorage.getItem(name) || "[]"));
    watchEffect(() => {
      typeof localStorage !== "undefined" && localStorage.setItem(name, JSON.stringify(data.value));
    });
  } else {
    data = ref([]);
  }
  return data;
}

export { useTodos, useStorage };
